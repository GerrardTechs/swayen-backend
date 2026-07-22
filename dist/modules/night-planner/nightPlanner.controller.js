"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightPlannerController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const nightPlanner_service_1 = require("./nightPlanner.service");
exports.nightPlannerController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { tasks } = req.body;
        const plan = await nightPlanner_service_1.nightPlannerService.createOrUpdateToday(userId, tasks);
        return (0, ApiResponse_1.sendSuccess)(res, plan, "Rencana malam berhasil disimpan", 201);
    }),
    getToday: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const result = await nightPlanner_service_1.nightPlannerService.getToday(userId);
        return (0, ApiResponse_1.sendSuccess)(res, result, "Rencana malam hari ini berhasil diambil");
    }),
    complete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;
        const plan = await nightPlanner_service_1.nightPlannerService.complete(userId, id);
        return (0, ApiResponse_1.sendSuccess)(res, plan, "Rencana malam ditandai selesai");
    }),
};
//# sourceMappingURL=nightPlanner.controller.js.map