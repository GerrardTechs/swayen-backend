import { prisma } from "../../config/prisma";

// Helper: normalisasi Date ke UTC midnight (00:00:00 UTC) agar konsisten dengan kolom @db.Date
// di MySQL, terlepas dari timezone server (WIB dkk).
function toDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export const nightPlannerRepository = {
  findByUserAndDate(userId: string, date: Date) {
    return prisma.nightPlanner.findUnique({
      where: { userId_date: { userId, date: toDateOnly(date) } },
    });
  },

  findById(id: string) {
    return prisma.nightPlanner.findUnique({ where: { id } });
  },

  async upsertToday(userId: string, date: Date, tasks: string[], missedCount: number) {
    const dateOnly = toDateOnly(date);
    const existing = await prisma.nightPlanner.findUnique({
      where: { userId_date: { userId, date: dateOnly } },
    });

    const completedTasks = tasks.map((_, i) => existing?.completedTasks[i] ?? false);
    const allDone = tasks.length > 0 && completedTasks.every((done, i) => !tasks[i]?.trim() || done);

    return prisma.nightPlanner.upsert({
      where: { userId_date: { userId, date: dateOnly } },
      update: { tasks, completedTasks, isCompleted: allDone },
      create: { userId, date: dateOnly, tasks, completedTasks, isCompleted: allDone, missedCount },
    });
  },

  markCompleted(id: string) {
    return prisma.nightPlanner.update({
      where: { id },
      data: { isCompleted: true, missedCount: 0 },
    });
  },

  markCompletedWithTasks(id: string, completedTasks: boolean[]) {
    return prisma.nightPlanner.update({
      where: { id },
      data: { isCompleted: true, missedCount: 0, completedTasks },
    });
  },

  toggleTaskCompletion(id: string, taskIndex: number, completed: boolean) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.nightPlanner.findUnique({ where: { id } });
      if (!plan) return null;

      const completedTasks = plan.tasks.map((_, i) => {
        const prev = plan.completedTasks[i] ?? false;
        return i === taskIndex ? completed : prev;
      });

      const allDone =
        plan.tasks.length > 0 && completedTasks.every((done, i) => !plan.tasks[i]?.trim() || done);

      return tx.nightPlanner.update({
        where: { id },
        data: {
          completedTasks,
          isCompleted: allDone,
          ...(allDone ? { missedCount: 0 } : {}),
        },
      });
    });
  },

  // Ambil N record terakhir (diurutkan turun) untuk kalkulasi streak & missed night
  findRecent(userId: string, take = 14) {
    return prisma.nightPlanner.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take,
    });
  },
};
