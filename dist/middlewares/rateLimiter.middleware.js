"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalRateLimiter = exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Endpoint auth dibatasi lebih ketat untuk mencegah brute-force / credential stuffing
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 menit
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak percobaan, coba lagi dalam 1 menit",
    },
});
// Rate limit umum untuk seluruh API
exports.generalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 menit
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak request, coba lagi sebentar lagi",
    },
});
//# sourceMappingURL=rateLimiter.middleware.js.map