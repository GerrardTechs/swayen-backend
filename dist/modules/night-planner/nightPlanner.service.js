"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightPlannerService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const nightPlanner_repository_1 = require("./nightPlanner.repository");
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
function toUTCDateOnly(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function isYesterday(recordDate, today) {
    const diff = Math.round((toUTCDateOnly(today).getTime() - toUTCDateOnly(recordDate).getTime()) / ONE_DAY_MS);
    return diff === 1;
}
exports.nightPlannerService = {
    /**
     * Buat / update rencana malam hari ini (max 5 baris, divalidasi di layer validation).
     * Sekaligus menghitung missedCount: jika record kemarin tidak ada / belum completed,
     * missedCount kemarin + 1 dibawa ke record hari ini. Jika kemarin completed, reset ke 0.
     */
    async createOrUpdateToday(userId, tasks) {
        const today = new Date();
        const yesterday = new Date(today.getTime() - ONE_DAY_MS);
        const existingToday = await nightPlanner_repository_1.nightPlannerRepository.findByUserAndDate(userId, today);
        let missedCount = existingToday?.missedCount ?? 0;
        if (!existingToday) {
            const yesterdayRecord = await nightPlanner_repository_1.nightPlannerRepository.findByUserAndDate(userId, yesterday);
            if (yesterdayRecord && isYesterday(yesterdayRecord.date, today)) {
                missedCount = yesterdayRecord.isCompleted ? 0 : yesterdayRecord.missedCount + 1;
            }
            else {
                // Tidak ada record kemarin sama sekali → dianggap 1 malam terlewat
                missedCount = 1;
            }
        }
        return nightPlanner_repository_1.nightPlannerRepository.upsertToday(userId, today, tasks, missedCount);
    },
    /**
     * Ambil rencana hari ini beserta status missedCount dan streak (jumlah hari
     * berturut-turut isCompleted = true, dihitung mundur dari kemarin/hari ini).
     */
    async getToday(userId) {
        const today = new Date();
        const plan = await nightPlanner_repository_1.nightPlannerRepository.findByUserAndDate(userId, today);
        const recent = await nightPlanner_repository_1.nightPlannerRepository.findRecent(userId, 30);
        let streak = 0;
        for (const record of recent) {
            if (record.isCompleted) {
                streak += 1;
            }
            else {
                break;
            }
        }
        return {
            plan,
            missedNightCount: plan?.missedCount ?? 0,
            streak,
        };
    },
    async complete(userId, planId) {
        const plan = await nightPlanner_repository_1.nightPlannerRepository.findById(planId);
        if (!plan)
            throw ApiError_1.ApiError.notFound("Rencana malam tidak ditemukan");
        if (plan.userId !== userId)
            throw ApiError_1.ApiError.forbidden("Rencana ini bukan milik Anda");
        if (plan.isCompleted)
            throw ApiError_1.ApiError.conflict("Rencana sudah ditandai selesai");
        return nightPlanner_repository_1.nightPlannerRepository.markCompleted(planId);
    },
};
//# sourceMappingURL=nightPlanner.service.js.map