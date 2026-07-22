"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeboxController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const timebox_service_1 = require("./timebox.service");
exports.timeboxController = {
    start: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { durationMinutes } = req.body;
        const session = await timebox_service_1.timeboxService.startFocus(userId, durationMinutes);
        return (0, ApiResponse_1.sendSuccess)(res, session, "Sesi TimeBox dimulai", 201);
    }),
    wuxiu: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const session = await timebox_service_1.timeboxService.startWuxiuNap(userId);
        return (0, ApiResponse_1.sendSuccess)(res, session, "Sesi Wuxiu Nap (Low Battery) dimulai", 201);
    }),
    finish: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { sessionId, status } = req.body;
        const result = await timebox_service_1.timeboxService.finish(userId, sessionId, status);
        return (0, ApiResponse_1.sendSuccess)(res, result, "Sesi berhasil diakhiri");
    }),
};
//# sourceMappingURL=timebox.controller.js.map