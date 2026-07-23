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

/** Throttle lastActiveAt agar tidak membanjiri DB (Neon pool limit rendah). */
const lastActiveCache = new Map<string, number>();
const ACTIVE_UPDATE_INTERVAL_MS = 5 * 60 * 1000;

function scheduleLastActiveUpdate(userId: string, res: Response) {
  const now = Date.now();
  const last = lastActiveCache.get(userId) ?? 0;
  if (now - last < ACTIVE_UPDATE_INTERVAL_MS) return;

  // Jalankan setelah response selesai supaya tidak berebut koneksi dengan handler route.
  res.once("finish", () => {
    lastActiveCache.set(userId, Date.now());
    void prisma.user
      .update({ where: { id: userId }, data: { lastActiveAt: new Date() } })
      .catch(() => {
        lastActiveCache.delete(userId);
      });
  });
}

/**
 * Memverifikasi Access Token JWT pada header `Authorization: Bearer <token>`.
 * Juga memperbarui `lastActiveAt` user secara best-effort (tidak memblokir request
 * jika update gagal) — dipakai untuk logic re-engagement (H+3, H+7).
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Access token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    req.user = { id: payload.sub, email: payload.email };
    scheduleLastActiveUpdate(payload.sub, res);

    next();
  } catch (err) {
    next(ApiError.unauthorized("Access token tidak valid atau sudah kedaluwarsa"));
  }
};
