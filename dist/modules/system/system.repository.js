"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemRepository = void 0;
const prisma_1 = require("../../config/prisma");
function toDateOnly(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000));
}
exports.systemRepository = {
    findQuoteByDate(date) {
        return prisma_1.prisma.dailyQuote.findUnique({ where: { showDate: toDateOnly(date) } });
    },
    /**
     * Fallback deterministic: kalau tidak ada quote yang di-assign eksplisit ke hari ini,
     * pilih quote berdasarkan (dayOfYear % totalQuote) — konsisten sepanjang hari yang sama,
     * dan portable di Postgres maupun MariaDB (tidak bergantung fungsi RANDOM() DB-specific).
     */
    async findFallbackQuote(date) {
        const total = await prisma_1.prisma.dailyQuote.count();
        if (total === 0)
            return null;
        const skip = dayOfYear(date) % total;
        const [quote] = await prisma_1.prisma.dailyQuote.findMany({
            orderBy: { id: "asc" },
            skip,
            take: 1,
        });
        return quote ?? null;
    },
    getUserLastActive(userId) {
        return prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { lastActiveAt: true },
        });
    },
    // Missed-night streak diambil dari record NightPlanner paling baru milik user
    getLatestNightPlanner(userId) {
        return prisma_1.prisma.nightPlanner.findFirst({
            where: { userId },
            orderBy: { date: "desc" },
        });
    },
};
//# sourceMappingURL=system.repository.js.map