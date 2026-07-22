import { User } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { hashPassword, verifyPassword } from "../../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { addDuration } from "../../utils/parseDuration";
import { env } from "../../config/env";
import { authRepository } from "./auth.repository";

// Jangan pernah mengembalikan passwordHash ke client
function toPublicUser(user: User) {
  const { passwordHash: _omit, ...publicUser } = user;
  return publicUser;
}

async function issueTokenPair(user: User) {
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id });

  const expiresAt = addDuration(new Date(), env.JWT_REFRESH_EXPIRES_IN);
  await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

  return { accessToken, refreshToken };
}

export const authService = {
  async register(email: string, password: string, name: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict("Email sudah terdaftar");
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepository.createUser(email, passwordHash, name);
    const tokens = await issueTokenPair(user);

    return { user: toPublicUser(user), ...tokens };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Email atau password salah");
    }

    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      throw ApiError.unauthorized("Email atau password salah");
    }

    const tokens = await issueTokenPair(user);
    return { user: toPublicUser(user), ...tokens };
  },

  /**
   * Refresh token rotation: token lama diverifikasi (signature + DB record),
   * lalu langsung di-revoke dan digantikan pasangan access+refresh token baru.
   */
  async refresh(presentedToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(presentedToken);
    } catch {
      throw ApiError.unauthorized("Refresh token tidak valid atau kedaluwarsa");
    }

    const record = await authRepository.findRefreshToken(presentedToken);
    if (!record || record.revoked || record.userId !== payload.sub) {
      throw ApiError.unauthorized("Refresh token tidak valid");
    }
    if (record.expiresAt < new Date()) {
      throw ApiError.unauthorized("Refresh token sudah kedaluwarsa");
    }

    const user = await authRepository.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized("User tidak ditemukan");
    }

    await authRepository.revokeRefreshTokenById(record.id);
    const tokens = await issueTokenPair(user);

    return tokens;
  },

  async logout(presentedToken: string) {
    const record = await authRepository.findRefreshToken(presentedToken);
    if (!record || record.revoked) {
      // Idempotent: token tidak ditemukan / sudah revoked tetap dianggap "berhasil logout"
      return;
    }
    await authRepository.revokeRefreshTokenById(record.id);
  },
};
