"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const auth_service_1 = require("./auth.service");
exports.authController = {
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password, name } = req.body;
        const result = await auth_service_1.authService.register(email, password, name);
        return (0, ApiResponse_1.sendSuccess)(res, result, "Registrasi berhasil", 201);
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        const result = await auth_service_1.authService.login(email, password);
        return (0, ApiResponse_1.sendSuccess)(res, result, "Login berhasil");
    }),
    refresh: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await auth_service_1.authService.refresh(refreshToken);
        return (0, ApiResponse_1.sendSuccess)(res, tokens, "Token berhasil diperbarui");
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        await auth_service_1.authService.logout(refreshToken);
        return (0, ApiResponse_1.sendSuccess)(res, null, "Logout berhasil");
    }),
};
//# sourceMappingURL=auth.controller.js.map