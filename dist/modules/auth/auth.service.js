"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const parseDuration_1 = require("../../utils/parseDuration");
const env_1 = require("../../config/env");
const auth_repository_1 = require("./auth.repository");
// Jangan pernah mengembalikan passwordHash ke client
function toPublicUser(user) {
    const { passwordHash: _omit, ...publicUser } = user;
    return publicUser;
}
async function issueTokenPair(user) {
    const accessToken = (0, jwt_1.signAccessToken)({ sub: user.id, email: user.email });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user.id });
    const expiresAt = (0, parseDuration_1.addDuration)(new Date(), env_1.env.JWT_REFRESH_EXPIRES_IN);
    await auth_repository_1.authRepository.createRefreshToken(user.id, refreshToken, expiresAt);
    return { accessToken, refreshToken };
}
exports.authService = {
    async register(email, password, name) {
        const existing = await auth_repository_1.authRepository.findByEmail(email);
        if (existing) {
            throw ApiError_1.ApiError.conflict("Email sudah terdaftar");
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await auth_repository_1.authRepository.createUser(email, passwordHash, name);
        const tokens = await issueTokenPair(user);
        return { user: toPublicUser(user), ...tokens };
    },
    async login(email, password) {
        const user = await auth_repository_1.authRepository.findByEmail(email);
        if (!user) {
            throw ApiError_1.ApiError.unauthorized("Email atau password salah");
        }
        const isValid = await (0, password_1.verifyPassword)(user.passwordHash, password);
        if (!isValid) {
            throw ApiError_1.ApiError.unauthorized("Email atau password salah");
        }
        const tokens = await issueTokenPair(user);
        return { user: toPublicUser(user), ...tokens };
    },
    /**
     * Refresh token rotation: token lama diverifikasi (signature + DB record),
     * lalu langsung di-revoke dan digantikan pasangan access+refresh token baru.
     */
    async refresh(presentedToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(presentedToken);
        }
        catch {
            throw ApiError_1.ApiError.unauthorized("Refresh token tidak valid atau kedaluwarsa");
        }
        const record = await auth_repository_1.authRepository.findRefreshToken(presentedToken);
        if (!record || record.revoked || record.userId !== payload.sub) {
            throw ApiError_1.ApiError.unauthorized("Refresh token tidak valid");
        }
        if (record.expiresAt < new Date()) {
            throw ApiError_1.ApiError.unauthorized("Refresh token sudah kedaluwarsa");
        }
        const user = await auth_repository_1.authRepository.findById(payload.sub);
        if (!user) {
            throw ApiError_1.ApiError.unauthorized("User tidak ditemukan");
        }
        await auth_repository_1.authRepository.revokeRefreshTokenById(record.id);
        const tokens = await issueTokenPair(user);
        return tokens;
    },
    async logout(presentedToken) {
        const record = await auth_repository_1.authRepository.findRefreshToken(presentedToken);
        if (!record || record.revoked) {
            // Idempotent: token tidak ditemukan / sudah revoked tetap dianggap "berhasil logout"
            return;
        }
        await auth_repository_1.authRepository.revokeRefreshTokenById(record.id);
    },
};
//# sourceMappingURL=auth.service.js.map