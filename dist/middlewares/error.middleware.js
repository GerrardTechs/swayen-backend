"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
// Middleware 404 — diletakkan setelah semua route terdaftar
const notFoundHandler = (req, _res, next) => {
    next(ApiError_1.ApiError.notFound(`Route ${req.method} ${req.originalUrl} tidak ditemukan`));
};
exports.notFoundHandler = notFoundHandler;
// Global error handler — satu-satunya tempat format error response ditentukan
const errorHandler = (err, _req, res, _next) => {
    const isApiError = err instanceof ApiError_1.ApiError;
    const statusCode = isApiError ? err.statusCode : 500;
    const message = isApiError ? err.message : "Terjadi kesalahan internal pada server";
    if (!isApiError && env_1.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(isApiError && err.details ? { details: err.details } : {}),
        ...(env_1.env.NODE_ENV === "development" && !isApiError ? { stack: err.stack } : {}),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map