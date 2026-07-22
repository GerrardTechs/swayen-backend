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

  upsertToday(userId: string, date: Date, tasks: string[], missedCount: number) {
    const dateOnly = toDateOnly(date);
    return prisma.nightPlanner.upsert({
      where: { userId_date: { userId, date: dateOnly } },
      update: { tasks },
      create: { userId, date: dateOnly, tasks, missedCount },
    });
  },

  markCompleted(id: string) {
    return prisma.nightPlanner.update({
      where: { id },
      data: { isCompleted: true },
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
