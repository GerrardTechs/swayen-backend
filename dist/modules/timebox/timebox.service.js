"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeboxService = void 0;
const ApiError_1 = require("../../utils/ApiError");
const timebox_repository_1 = require("./timebox.repository");
const swayen_service_1 = require("../swayen/swayen.service");
const WUXIU_NAP_DURATION_MINUTES = 20;
const REWARD_COIN_PER_TIMEBOX = 1;
exports.timeboxService = {
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
     * Reward 1 Swayen Coin HANYA diberikan jika: status COMPLETED dan bukan Wuxiu Nap
     * (nap adalah pemulihan energi, bukan aktivitas produktif yang diganjar koin).
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
        let rewarded = false;
        if (status === "COMPLETED" && !session.isWuxiuNap) {
            await swayen_service_1.swayenService.earnCoins(userId, REWARD_COIN_PER_TIMEBOX, "TimeBox Selesai");
            rewarded = true;
        }
        return { session: finished, coinsRewarded: rewarded ? REWARD_COIN_PER_TIMEBOX : 0 };
    },
    listRecent(userId) {
        return timebox_repository_1.timeboxRepository.listRecent(userId);
    },
};
//# sourceMappingURL=timebox.service.js.map