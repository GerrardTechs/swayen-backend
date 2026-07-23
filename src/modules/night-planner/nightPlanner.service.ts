import { ApiError } from "../../utils/ApiError";
import { nightPlannerRepository } from "./nightPlanner.repository";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toUTCDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function getNightCycleDate(now = new Date()): Date {
  const d = new Date(now);
  if (d.getHours() < 18) {
    d.setDate(d.getDate() - 1);
  }
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
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
   * Siklus malam di-reset setiap jam 6 sore (18:00).
   */
  async createOrUpdateToday(userId: string, tasks: string[]) {
    const today = getNightCycleDate();
    const yesterday = new Date(today.getTime() - ONE_DAY_MS);

    const existingToday = await nightPlannerRepository.findByUserAndDate(userId, today);
    let missedCount = existingToday?.missedCount ?? 0;

    if (!existingToday) {
      const yesterdayRecord = await nightPlannerRepository.findByUserAndDate(userId, yesterday);
      if (yesterdayRecord && isYesterday(yesterdayRecord.date, today)) {
        if (yesterdayRecord.isCompleted) {
          missedCount = 0;
        } else if (yesterdayRecord.tasks.length > 0) {
          missedCount = yesterdayRecord.missedCount + 1;
        } else {
          missedCount = 0;
        }
      } else {
        missedCount = 0;
      }
    }

    return nightPlannerRepository.upsertToday(userId, today, tasks, missedCount);
  },

  /**
   * Ambil rencana hari ini (siklus bergeser pada jam 18:00)
   */
  async getToday(userId: string) {
    const today = getNightCycleDate();
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
      missedNightCount: plan?.isCompleted ? 0 : (plan?.missedCount ?? 0),
      streak,
    };
  },

  async complete(userId: string, planId: string) {
    const plan = await nightPlannerRepository.findById(planId);

    if (!plan) throw ApiError.notFound("Rencana malam tidak ditemukan");
    if (plan.userId !== userId) throw ApiError.forbidden("Rencana ini bukan milik Anda");

    const completedTasks = plan.tasks.map(() => true);
    return nightPlannerRepository.markCompletedWithTasks(planId, completedTasks);
  },

  async toggleTask(userId: string, planId: string, taskIndex: number, completed: boolean) {
    const plan = await nightPlannerRepository.findById(planId);

    if (!plan) throw ApiError.notFound("Rencana malam tidak ditemukan");
    if (plan.userId !== userId) throw ApiError.forbidden("Rencana ini bukan milik Anda");
    if (taskIndex < 0 || taskIndex >= plan.tasks.length) {
      throw ApiError.badRequest("Indeks task tidak valid");
    }

    const updated = await nightPlannerRepository.toggleTaskCompletion(planId, taskIndex, completed);
    if (!updated) throw ApiError.notFound("Rencana malam tidak ditemukan");
    return updated;
  },
};
