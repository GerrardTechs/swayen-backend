"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const system_service_1 = require("./system.service");
exports.systemController = {
    // Publik — quote harian tidak spesifik ke user, tidak butuh auth
    quoteToday: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const quote = await system_service_1.systemService.getTodayQuote();
        return (0, ApiResponse_1.sendSuccess)(res, quote, "Quote hari ini berhasil diambil");
    }),
    // Butuh auth karena status dihitung per-user (dipanggil WorkManager/Cron dgn token user)
    engagementStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const status = await system_service_1.systemService.getEngagementStatus(userId);
        return (0, ApiResponse_1.sendSuccess)(res, status, "Status engagement berhasil diambil");
    }),
};
//# sourceMappingURL=system.controller.js.map