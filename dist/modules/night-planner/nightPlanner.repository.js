"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightPlannerRepository = void 0;
const prisma_1 = require("../../config/prisma");
// Helper: normalisasi Date ke UTC midnight (00:00:00 UTC) agar konsisten dengan kolom @db.Date
// di MySQL, terlepas dari timezone server (WIB dkk).
function toDateOnly(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
exports.nightPlannerRepository = {
    findByUserAndDate(userId, date) {
        return prisma_1.prisma.nightPlanner.findUnique({
            where: { userId_date: { userId, date: toDateOnly(date) } },
        });
    },
    findById(id) {
        return prisma_1.prisma.nightPlanner.findUnique({ where: { id } });
    },
    upsertToday(userId, date, tasks, missedCount) {
        const dateOnly = toDateOnly(date);
        return prisma_1.prisma.nightPlanner.upsert({
            where: { userId_date: { userId, date: dateOnly } },
            update: { tasks },
            create: { userId, date: dateOnly, tasks, missedCount },
        });
    },
    markCompleted(id) {
        return prisma_1.prisma.nightPlanner.update({
            where: { id },
            data: { isCompleted: true },
        });
    },
    // Ambil N record terakhir (diurutkan turun) untuk kalkulasi streak & missed night
    findRecent(userId, take = 14) {
        return prisma_1.prisma.nightPlanner.findMany({
            where: { userId },
            orderBy: { date: "desc" },
            take,
        });
    },
};
//# sourceMappingURL=nightPlanner.repository.js.map