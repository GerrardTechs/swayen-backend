import { ApiError } from "../../utils/ApiError";
import { nightPlannerRepository } from "./nightPlanner.repository";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toUTCDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function isYesterday(recordDate: Date, today: Date): boolean {
  const diff = Math.round(
    (toUTCDateOnly(today).getTime() - toUTCDateOnly(recordDate).getTime()) / ONE_DAY_MS
  );
  return diff === 1;
}

export const nightPlannerService = {
  /**
   * Buat / update rencana malam hari ini (max 5 baris, divalidasi di layer validation).
   * Sekaligus menghitung missedCount: jika record kemarin tidak ada / belum completed,
   * missedCount kemarin + 1 dibawa ke record hari ini. Jika kemarin completed, reset ke 0.
   */
  async createOrUpdateToday(userId: string, tasks: string[]) {
    const today = new Date();
    const yesterday = new Date(today.getTime() - ONE_DAY_MS);

    const existingToday = await nightPlannerRepository.findByUserAndDate(userId, today);
    let missedCount = existingToday?.missedCount ?? 0;

    if (!existingToday) {
      const yesterdayRecord = await nightPlannerRepository.findByUserAndDate(userId, yesterday);
      if (yesterdayRecord && isYesterday(yesterdayRecord.date, today)) {
        missedCount = yesterdayRecord.isCompleted ? 0 : yesterdayRecord.missedCount + 1;
      } else {
        // Tidak ada record kemarin sama sekali → dianggap 1 malam terlewat
        missedCount = 1;
      }
    }

    return nightPlannerRepository.upsertToday(userId, today, tasks, missedCount);
  },

  /**
   * Ambil rencana hari ini beserta status missedCount dan streak (jumlah hari
   * berturut-turut isCompleted = true, dihitung mundur dari kemarin/hari ini).
   */
  async getToday(userId: string) {
    const today = new Date();
    const plan = await nightPlannerRepository.findByUserAndDate(userId, today);
    const recent = await nightPlannerRepository.findRecent(userId, 30);

    let streak = 0;
    for (const record of recent) {
      if (record.isCompleted) {
        streak += 1;
      } else {
        break;
      }
    }

    return {
      plan,
      missedNightCount: plan?.missedCount ?? 0,
      streak,
    };
  },

  async complete(userId: string, planId: string) {
    const plan = await nightPlannerRepository.findById(planId);

    if (!plan) throw ApiError.notFound("Rencana malam tidak ditemukan");
    if (plan.userId !== userId) throw ApiError.forbidden("Rencana ini bukan milik Anda");
    if (plan.isCompleted) throw ApiError.conflict("Rencana sudah ditandai selesai");

    return nightPlannerRepository.markCompleted(planId);
  },
};
