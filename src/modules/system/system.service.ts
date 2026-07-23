import { ApiError } from "../../utils/ApiError";
import { systemRepository } from "./system.repository";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Ambang batas re-engagement (H+3 / H+7) & batas missed-night sebelum beban rencana diturunkan
const INACTIVITY_TIER_H3_DAYS = 3;
const INACTIVITY_TIER_H7_DAYS = 7;
const MISSED_NIGHT_THRESHOLD = 2;

export type ReengagementTier = "NONE" | "H3" | "H7";

export const systemService = {
  async getTodayQuote() {
    const today = new Date();
    const quote =
      (await systemRepository.findQuoteByDate(today)) ??
      (await systemRepository.findFallbackQuote(today));

    if (!quote) {
      throw ApiError.notFound("Belum ada Daily Quote yang tersedia di database");
    }
    return quote;
  },

  /**
   * Dipanggil oleh Android WorkManager/Cron (per-user, menggunakan access token user tsb)
   * untuk memutuskan apakah perlu memicu notifikasi re-engagement secara lokal di device.
   */
  async getEngagementStatus(userId: string) {
    const [userRow, latestNightPlan] = await Promise.all([
      systemRepository.getUserLastActive(userId),
      systemRepository.getLatestNightPlanner(userId),
    ]);

    if (!userRow) throw ApiError.notFound("User tidak ditemukan");

    const inactiveDays = Math.floor(
      (Date.now() - userRow.lastActiveAt.getTime()) / MS_PER_DAY
    );

    let reengagementTier: ReengagementTier = "NONE";
    if (inactiveDays >= INACTIVITY_TIER_H7_DAYS) reengagementTier = "H7";
    else if (inactiveDays >= INACTIVITY_TIER_H3_DAYS) reengagementTier = "H3";

    const missedNightCount =
      latestNightPlan?.isCompleted ? 0 : (latestNightPlan?.missedCount ?? 0);
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
