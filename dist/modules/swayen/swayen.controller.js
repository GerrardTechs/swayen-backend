"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swayenController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const swayen_service_1 = require("./swayen.service");
exports.swayenController = {
    getBalance: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const result = await swayen_service_1.swayenService.getBalanceWithHistory(userId);
        return (0, ApiResponse_1.sendSuccess)(res, result, "Saldo & riwayat Swayen Coin berhasil diambil");
    }),
    listHobbies: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const hobbies = await swayen_service_1.swayenService.listHobbies(userId);
        return (0, ApiResponse_1.sendSuccess)(res, hobbies, "Daftar Quick-Start Hobbies berhasil diambil");
    }),
    createHobby: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { title, durationMinutes, deepLinkUrl } = req.body;
        const hobby = await swayen_service_1.swayenService.createHobby(userId, title, durationMinutes, deepLinkUrl);
        return (0, ApiResponse_1.sendSuccess)(res, hobby, "Hobi baru berhasil ditambahkan", 201);
    }),
    spend: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const { amount, activityName, hobbyId } = req.body;
        const wallet = await swayen_service_1.swayenService.spendCoins(userId, amount, activityName, hobbyId);
        return (0, ApiResponse_1.sendSuccess)(res, wallet, "Koin berhasil digunakan");
    }),
};
//# sourceMappingURL=swayen.controller.js.map