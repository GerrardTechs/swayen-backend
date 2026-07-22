"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.authRepository = {
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    },
    findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
    },
    createUser(email, passwordHash, name) {
        return prisma_1.prisma.user.create({ data: { email, passwordHash, name } });
    },
    createRefreshToken(userId, token, expiresAt) {
        return prisma_1.prisma.refreshToken.create({ data: { userId, token, expiresAt } });
    },
    findRefreshToken(token) {
        return prisma_1.prisma.refreshToken.findUnique({ where: { token } });
    },
    revokeRefreshTokenById(id) {
        return prisma_1.prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
    },
};
//# sourceMappingURL=auth.repository.js.map