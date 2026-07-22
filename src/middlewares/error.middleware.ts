import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

// Middleware 404 — diletakkan setelah semua route terdaftar
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} tidak ditemukan`));
};

// Global error handler — satu-satunya tempat format error response ditentukan
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : "Terjadi kesalahan internal pada server";

  if (!isApiError && env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isApiError && err.details ? { details: err.details } : {}),
    ...(env.NODE_ENV === "development" && !isApiError ? { stack: err.stack } : {}),
  });
};
