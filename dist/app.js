"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    // --- Security & core middleware ---
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // Rate limiter umum diterapkan di seluruh /api
    app.use(env_1.env.API_PREFIX, rateLimiter_middleware_1.generalRateLimiter);
    // --- Health check ---
    app.get("/health", (_req, res) => {
        res.status(200).json({ success: true, message: "Swayen API is healthy" });
    });
    // --- Routes ---
    app.use(env_1.env.API_PREFIX, routes_1.apiRouter);
    // --- 404 & error handler (urutan wajib paling akhir) ---
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map