"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const system_repository_1 = require("./system.repository");
const MS_PER_DAY = 24 * 60 * 60 * 1000;
// Ambang batas re-engagement (H+3 / H+7) & batas missed-night sebelum beban rencana diturunkan
const INACTIVITY_TIER_H3_DAYS = 3;
const INACTIVITY_TIER_H7_DAYS = 7;
const MISSED_NIGHT_THRESHOLD = 2;
exports.systemService = {
    async getTodayQuote() {
        const today = new Date();
        const quote = (await system_repository_1.systemRepository.findQuoteByDate(today)) ??
            (await system_repository_1.systemRepository.findFallbackQuote(today));
        if (!quote) {
            throw ApiError_1.ApiError.notFound("Belum ada Daily Quote yang tersedia di database");
        }
        return quote;
    },
    /**
     * Dipanggil oleh Android WorkManager/Cron (per-user, menggunakan access token user tsb)
     * untuk memutuskan apakah perlu memicu notifikasi re-engagement secara lokal di device.
     */
    async getEngagementStatus(userId) {
        const [userRow, latestNightPlan] = await Promise.all([
            system_repository_1.systemRepository.getUserLastActive(userId),
            system_repository_1.systemRepository.getLatestNightPlanner(userId),
        ]);
        if (!userRow)
            throw ApiError_1.ApiError.notFound("User tidak ditemukan");
        const inactiveDays = Math.floor((Date.now() - userRow.lastActiveAt.getTime()) / MS_PER_DAY);
        let reengagementTier = "NONE";
        if (inactiveDays >= INACTIVITY_TIER_H7_DAYS)
            reengagementTier = "H7";
        else if (inactiveDays >= INACTIVITY_TIER_H3_DAYS)
            reengagementTier = "H3";
        const missedNightCount = latestNightPlan?.isCompleted ? 0 : (latestNightPlan?.missedCount ?? 0);
        const shouldReduceNightPlanLoad = missedNightCount >= MISSED_NIGHT_THRESHOLD;
        return {
            isInactive: reengagementTier !== "NONE",
            inactiveDays,
            reengagementTier,
            missedNightCount,
            shouldReduceNightPlanLoad,
            // Saran jumlah baris rencana malam berikutnya: turun ke 3 kalau sedang sering kelewat
            suggestedNightPlanSlots: shouldReduceNightPlanLoad ? 3 : 5,
        };
    },
};
//# sourceMappingURL=system.service.js.map