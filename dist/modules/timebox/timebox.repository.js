"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeboxRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.timeboxRepository = {
    // Sesi aktif = belum punya endedAt. Dipakai untuk mencegah user membuka 2 sesi sekaligus,
    // sekaligus dasar untuk "mengunci/membisukan pemicu koin selama timer berjalan".
    findActiveSession(userId) {
        return prisma_1.prisma.timeBoxSession.findFirst({
            where: { userId, endedAt: null },
            orderBy: { startedAt: "desc" },
        });
    },
    findById(id) {
        return prisma_1.prisma.timeBoxSession.findUnique({ where: { id } });
    },
    createSession(userId, durationMinutes, isWuxiuNap) {
        return prisma_1.prisma.timeBoxSession.create({
            data: { userId, durationMinutes, isWuxiuNap },
        });
    },
    finishSession(id, status) {
        return prisma_1.prisma.timeBoxSession.update({
            where: { id },
            data: { status, endedAt: new Date() },
        });
    },
    listRecent(userId, take = 20) {
        return prisma_1.prisma.timeBoxSession.findMany({
            where: { userId },
            orderBy: { startedAt: "desc" },
            take,
        });
    },
};
//# sourceMappingURL=timebox.repository.js.map