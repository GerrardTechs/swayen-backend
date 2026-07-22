import { TimeBoxStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { timeboxRepository } from "./timebox.repository";
import { swayenService } from "../swayen/swayen.service";

const WUXIU_NAP_DURATION_MINUTES = 20;
const REWARD_COIN_PER_TIMEBOX = 1;

export const timeboxService = {
  /**
   * Mulai sesi fokus (TimeBox). Hanya boleh ada 1 sesi aktif per user —
   * ini yang jadi dasar "mengunci pemicu koin lain" selama timer berjalan,
   * karena selama endedAt masih null, sesi dianggap masih berlangsung.
   */
  async startFocus(userId: string, durationMinutes: number) {
    const active = await timeboxRepository.findActiveSession(userId);
    if (active) {
      throw ApiError.conflict("Masih ada sesi TimeBox/Wuxiu Nap yang berjalan, selesaikan dahulu");
    }
    return timeboxRepository.createSession(userId, durationMinutes, false);
  },

  /**
   * Mulai sesi Wuxiu Nap (Low Battery mode) — durasi tetap 20 menit, ditandai isWuxiuNap.
   */
  async startWuxiuNap(userId: string) {
    const active = await timeboxRepository.findActiveSession(userId);
    if (active) {
      throw ApiError.conflict("Masih ada sesi TimeBox/Wuxiu Nap yang berjalan, selesaikan dahulu");
    }
    return timeboxRepository.createSession(userId, WUXIU_NAP_DURATION_MINUTES, true);
  },

  /**
   * Akhiri sesi (TimeBox biasa maupun Wuxiu Nap).
   * Reward 1 Swayen Coin HANYA diberikan jika: status COMPLETED dan bukan Wuxiu Nap
   * (nap adalah pemulihan energi, bukan aktivitas produktif yang diganjar koin).
   */
  async finish(userId: string, sessionId: string, status: TimeBoxStatus) {
    const session = await timeboxRepository.findById(sessionId);

    if (!session) throw ApiError.notFound("Sesi TimeBox tidak ditemukan");
    if (session.userId !== userId) throw ApiError.forbidden("Sesi ini bukan milik Anda");
    if (session.endedAt) throw ApiError.conflict("Sesi ini sudah diakhiri sebelumnya");

    const finished = await timeboxRepository.finishSession(sessionId, status);

    let rewarded = false;
    if (status === "COMPLETED" && !session.isWuxiuNap) {
      await swayenService.earnCoins(userId, REWARD_COIN_PER_TIMEBOX, "TimeBox Selesai");
      rewarded = true;
    }

    return { session: finished, coinsRewarded: rewarded ? REWARD_COIN_PER_TIMEBOX : 0 };
  },

  listRecent(userId: string) {
    return timeboxRepository.listRecent(userId);
  },
};
