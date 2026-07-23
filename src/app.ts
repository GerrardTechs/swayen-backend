import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import { apiRouter } from "./routes";

export function createApp(): Application {
  const app = express();

  // --- Security & core middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Rate limiter umum diterapkan di seluruh /api
  app.use(env.API_PREFIX, generalRateLimiter);

  // --- Health check ---
  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Swayen API is healthy" });
  });

  // --- Routes ---
  app.use(env.API_PREFIX, apiRouter);

  // --- 404 & error handler (urutan wajib paling akhir) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
