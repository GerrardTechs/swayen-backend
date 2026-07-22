"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.usersRepository = {
    findProfileById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                lastActiveAt: true,
                createdAt: true,
                updatedAt: true,
                // passwordHash sengaja tidak di-select
            },
        });
    },
};
//# sourceMappingURL=users.repository.js.map