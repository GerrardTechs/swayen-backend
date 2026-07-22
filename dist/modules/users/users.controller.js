"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiResponse_1 = require("../../utils/ApiResponse");
const users_service_1 = require("./users.service");
exports.usersController = {
    // authenticate middleware sudah otomatis meng-update lastActiveAt sebelum handler ini jalan
    me: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const profile = await users_service_1.usersService.getProfile(req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, profile, "Profil berhasil diambil");
    }),
};
//# sourceMappingURL=users.controller.js.map