"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../config/prisma");
/** Throttle lastActiveAt agar tidak membanjiri DB (Neon pool limit rendah). */
const lastActiveCache = new Map();
const ACTIVE_UPDATE_INTERVAL_MS = 5 * 60 * 1000;
function scheduleLastActiveUpdate(userId, res) {
    const now = Date.now();
    const last = lastActiveCache.get(userId) ?? 0;
    if (now - last < ACTIVE_UPDATE_INTERVAL_MS)
        return;
    // Jalankan setelah response selesai supaya tidak berebut koneksi dengan handler route.
    res.once("finish", () => {
        lastActiveCache.set(userId, Date.now());
        void prisma_1.prisma.user
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
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError_1.ApiError.unauthorized("Access token tidak ditemukan");
        }
        const token = authHeader.split(" ")[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub, email: payload.email };
        scheduleLastActiveUpdate(payload.sub, res);
        next();
    }
    catch (err) {
        next(ApiError_1.ApiError.unauthorized("Access token tidak valid atau sudah kedaluwarsa"));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map