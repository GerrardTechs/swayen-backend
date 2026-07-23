import { TimeBoxStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { timeboxRepository } from "./timebox.repository";
import { swayenService } from "../swayen/swayen.service";

const WUXIU_NAP_DURATION_MINUTES = 20;

export function calculateRewardCoins(durationMinutes: number, isWuxiuNap: boolean): number {
  if (isWuxiuNap) return 0;
  if (durationMinutes >= 90) return 4;
  if (durationMinutes >= 60) return 3;
  if (durationMinutes >= 45) return 2;
  if (durationMinutes >= 25) return 1;
  return 1;
}

export const timeboxService = {
  /**
   * Ambil sesi aktif (jika ada)
   */
  async getActiveSession(userId: string) {
    return timeboxRepository.findActiveSession(userId);
  },

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
   * Reward Swayen Coin diberikan berdasarkan durasi jika status COMPLETED dan bukan Wuxiu Nap:
   * 25m -> 1 coin, 45m -> 2 coins, 60m -> 3 coins, 90m -> 4 coins.
   */
  async finish(userId: string, sessionId: string, status: TimeBoxStatus) {
    const session = await timeboxRepository.findById(sessionId);

    if (!session) throw ApiError.notFound("Sesi TimeBox tidak ditemukan");
    if (session.userId !== userId) throw ApiError.forbidden("Sesi ini bukan milik Anda");
    if (session.endedAt) throw ApiError.conflict("Sesi ini sudah diakhiri sebelumnya");

    const finished = await timeboxRepository.finishSession(sessionId, status);

    let coinsEarned = 0;
    if (status === "COMPLETED" && !session.isWuxiuNap) {
      coinsEarned = calculateRewardCoins(session.durationMinutes, session.isWuxiuNap);
      if (coinsEarned > 0) {
        await swayenService.earnCoins(
          userId,
          coinsEarned,
          `TimeBox ${session.durationMinutes}m Selesai`
        );
      }
    }

    return { session: finished, coinsRewarded: coinsEarned };
  },

  listRecent(userId: string) {
    return timeboxRepository.listRecent(userId);
  },
};
