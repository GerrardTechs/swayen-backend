"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const users_repository_1 = require("./users.repository");
exports.usersService = {
    async getProfile(userId) {
        const profile = await users_repository_1.usersRepository.findProfileById(userId);
        if (!profile)
            throw ApiError_1.ApiError.notFound("User tidak ditemukan");
        return profile;
    },
};
//# sourceMappingURL=users.service.js.map