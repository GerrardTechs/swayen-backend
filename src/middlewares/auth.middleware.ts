import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/prisma";

// Extend Express Request agar req.user tersedia & type-safe di seluruh app
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * Memverifikasi Access Token JWT pada header `Authorization: Bearer <token>`.
 * Juga memperbarui `lastActiveAt` user secara best-effort (tidak memblokir request
 * jika update gagal) — dipakai untuk logic re-engagement (H+3, H+7).
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = { id: payload.sub, email: payload.email };

    // Fire-and-forget update lastActiveAt, tidak perlu di-await secara blocking
    prisma.user
      .update({ where: { id: payload.sub }, data: { lastActiveAt: new Date() } })
      .catch(() => undefined);

    next();
  } catch (err) {
    next(ApiError.unauthorized("Access token tidak valid atau sudah kedaluwarsa"));
  }
};
