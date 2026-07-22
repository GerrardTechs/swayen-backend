"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../config/prisma");
/**
 * Memverifikasi Access Token JWT pada header `Authorization: Bearer <token>`.
 * Juga memperbarui `lastActiveAt` user secara best-effort (tidak memblokir request
 * jika update gagal) — dipakai untuk logic re-engagement (H+3, H+7).
 */
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError_1.ApiError.unauthorized("Access token tidak ditemukan");
        }
        const token = authHeader.split(" ")[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub, email: payload.email };
        // Fire-and-forget update lastActiveAt, tidak perlu di-await secara blocking
        prisma_1.prisma.user
            .update({ where: { id: payload.sub }, data: { lastActiveAt: new Date() } })
            .catch(() => undefined);
        next();
    }
    catch (err) {
        next(ApiError_1.ApiError.unauthorized("Access token tidak valid atau sudah kedaluwarsa"));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map