"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeboxService = void 0;
exports.calculateRewardCoins = calculateRewardCoins;
const ApiError_1 = require("../../utils/ApiError");
const timebox_repository_1 = require("./timebox.repository");
const swayen_service_1 = require("../swayen/swayen.service");
const WUXIU_NAP_DURATION_MINUTES = 20;
function calculateRewardCoins(durationMinutes, isWuxiuNap) {
    if (isWuxiuNap)
        return 0;
    if (durationMinutes >= 90)
        return 4;
    if (durationMinutes >= 60)
        return 3;
    if (durationMinutes >= 45)
        return 2;
    if (durationMinutes >= 25)
        return 1;
    return 1;
}
exports.timeboxService = {
    /**
     * Ambil sesi aktif (jika ada)
     */
    async getActiveSession(userId) {
        return timebox_repository_1.timeboxRepository.findActiveSession(userId);
    },
    /**
     * Mulai sesi fokus (TimeBox). Hanya boleh ada 1 sesi aktif per user —
     * ini yang jadi dasar "mengunci pemicu koin lain" selama timer berjalan,
     * karena selama endedAt masih null, sesi dianggap masih berlangsung.
     */
    async startFocus(userId, durationMinutes) {
        const active = await timebox_repository_1.timeboxRepository.findActiveSession(userId);
        if (active) {
            throw ApiError_1.ApiError.conflict("Masih ada sesi TimeBox/Wuxiu Nap yang berjalan, selesaikan dahulu");
        }
        return timebox_repository_1.timeboxRepository.createSession(userId, durationMinutes, false);
    },
    /**
     * Mulai sesi Wuxiu Nap (Low Battery mode) — durasi tetap 20 menit, ditandai isWuxiuNap.
     */
    async startWuxiuNap(userId) {
        const active = await timebox_repository_1.timeboxRepository.findActiveSession(userId);
        if (active) {
            throw ApiError_1.ApiError.conflict("Masih ada sesi TimeBox/Wuxiu Nap yang berjalan, selesaikan dahulu");
        }
        return timebox_repository_1.timeboxRepository.createSession(userId, WUXIU_NAP_DURATION_MINUTES, true);
    },
    /**
     * Akhiri sesi (TimeBox biasa maupun Wuxiu Nap).
     * Reward Swayen Coin diberikan berdasarkan durasi jika status COMPLETED dan bukan Wuxiu Nap:
     * 25m -> 1 coin, 45m -> 2 coins, 60m -> 3 coins, 90m -> 4 coins.
     */
    async finish(userId, sessionId, status) {
        const session = await timebox_repository_1.timeboxRepository.findById(sessionId);
        if (!session)
            throw ApiError_1.ApiError.notFound("Sesi TimeBox tidak ditemukan");
        if (session.userId !== userId)
            throw ApiError_1.ApiError.forbidden("Sesi ini bukan milik Anda");
        if (session.endedAt)
            throw ApiError_1.ApiError.conflict("Sesi ini sudah diakhiri sebelumnya");
        const finished = await timebox_repository_1.timeboxRepository.finishSession(sessionId, status);
        let coinsEarned = 0;
        if (status === "COMPLETED" && !session.isWuxiuNap) {
            coinsEarned = calculateRewardCoins(session.durationMinutes, session.isWuxiuNap);
            if (coinsEarned > 0) {
                await swayen_service_1.swayenService.earnCoins(userId, coinsEarned, `TimeBox ${session.durationMinutes}m Selesai`);
            }
        }
        return { session: finished, coinsRewarded: coinsEarned };
    },
    listRecent(userId) {
        return timebox_repository_1.timeboxRepository.listRecent(userId);
    },
};
//# sourceMappingURL=timebox.service.js.map