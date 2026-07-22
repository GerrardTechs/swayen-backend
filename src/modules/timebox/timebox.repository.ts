import { TimeBoxStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const timeboxRepository = {
  // Sesi aktif = belum punya endedAt. Dipakai untuk mencegah user membuka 2 sesi sekaligus,
  // sekaligus dasar untuk "mengunci/membisukan pemicu koin selama timer berjalan".
  findActiveSession(userId: string) {
    return prisma.timeBoxSession.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.timeBoxSession.findUnique({ where: { id } });
  },

  createSession(userId: string, durationMinutes: number, isWuxiuNap: boolean) {
    return prisma.timeBoxSession.create({
      data: { userId, durationMinutes, isWuxiuNap },
    });
  },

  finishSession(id: string, status: TimeBoxStatus) {
    return prisma.timeBoxSession.update({
      where: { id },
      data: { status, endedAt: new Date() },
    });
  },

  listRecent(userId: string, take = 20) {
    return prisma.timeBoxSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take,
    });
  },
};
