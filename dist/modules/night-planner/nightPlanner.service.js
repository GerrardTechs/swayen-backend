"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightPlannerService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const nightPlanner_repository_1 = require("./nightPlanner.repository");
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
function toUTCDateOnly(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function getNightCycleDate(now = new Date()) {
    const d = new Date(now);
    if (d.getHours() < 18) {
        d.setDate(d.getDate() - 1);
    }
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
function isYesterday(recordDate, today) {
    const diff = Math.round((toUTCDateOnly(today).getTime() - toUTCDateOnly(recordDate).getTime()) / ONE_DAY_MS);
    return diff === 1;
}
exports.nightPlannerService = {
    /**
     * Buat / update rencana malam hari ini (max 5 baris, divalidasi di layer validation).
     * Siklus malam di-reset setiap jam 6 sore (18:00).
     */
    async createOrUpdateToday(userId, tasks) {
        const today = getNightCycleDate();
        const yesterday = new Date(today.getTime() - ONE_DAY_MS);
        const existingToday = await nightPlanner_repository_1.nightPlannerRepository.findByUserAndDate(userId, today);
        let missedCount = existingToday?.missedCount ?? 0;
        if (!existingToday) {
            const yesterdayRecord = await nightPlanner_repository_1.nightPlannerRepository.findByUserAndDate(userId, yesterday);
            if (yesterdayRecord && isYesterday(yesterdayRecord.date, today)) {
                if (yesterdayRecord.isCompleted) {
                    missedCount = 0;
                }
                else if (yesterdayRecord.tasks.length > 0) {
                    missedCount = yesterdayRecord.missedCount + 1;
                }
                else {
                    missedCount = 0;
                }
            }
            else {
                missedCount = 0;
            }
        }
        return nightPlanner_repository_1.nightPlannerRepository.upsertToday(userId, today, tasks, missedCount);
    },
    /**
     * Ambil rencana hari ini (siklus bergeser pada jam 18:00)
     */
    async getToday(userId) {
        const today = getNightCycleDate();
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
            missedNightCount: plan?.isCompleted ? 0 : (plan?.missedCount ?? 0),
            streak,
        };
    },
    async complete(userId, planId) {
        const plan = await nightPlanner_repository_1.nightPlannerRepository.findById(planId);
        if (!plan)
            throw ApiError_1.ApiError.notFound("Rencana malam tidak ditemukan");
        if (plan.userId !== userId)
            throw ApiError_1.ApiError.forbidden("Rencana ini bukan milik Anda");
        const completedTasks = plan.tasks.map(() => true);
        return nightPlanner_repository_1.nightPlannerRepository.markCompletedWithTasks(planId, completedTasks);
    },
    async toggleTask(userId, planId, taskIndex, completed) {
        const plan = await nightPlanner_repository_1.nightPlannerRepository.findById(planId);
        if (!plan)
            throw ApiError_1.ApiError.notFound("Rencana malam tidak ditemukan");
        if (plan.userId !== userId)
            throw ApiError_1.ApiError.forbidden("Rencana ini bukan milik Anda");
        if (taskIndex < 0 || taskIndex >= plan.tasks.length) {
            throw ApiError_1.ApiError.badRequest("Indeks task tidak valid");
        }
        const updated = await nightPlanner_repository_1.nightPlannerRepository.toggleTaskCompletion(planId, taskIndex, completed);
        if (!updated)
            throw ApiError_1.ApiError.notFound("Rencana malam tidak ditemukan");
        return updated;
    },
};
//# sourceMappingURL=nightPlanner.service.js.map