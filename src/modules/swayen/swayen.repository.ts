import { prisma } from "../../config/prisma";
import { CoinTransactionType } from "@prisma/client";

export const swayenRepository = {
  // Memastikan setiap user punya 1 row SwayenCoin (dibuat lazy saat pertama diakses)
  async getOrCreateWallet(userId: string) {
    const existing = await prisma.swayenCoin.findUnique({ where: { userId } });
    if (existing) return existing;
    return prisma.swayenCoin.create({ data: { userId, balance: 0 } });
  },

  listTransactions(userId: string, take = 20) {
    return prisma.coinTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
    });
  },

  createTransaction(
    userId: string,
    type: CoinTransactionType,
    amount: number,
    activityName: string
  ) {
    return prisma.coinTransaction.create({
      data: { userId, type, amount, activityName },
    });
  },

  incrementBalance(userId: string, amount: number) {
    return prisma.swayenCoin.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });
  },

  decrementBalance(userId: string, amount: number) {
    return prisma.swayenCoin.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });
  },

  listHobbies(userId: string) {
    return prisma.hobbyShortcut.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  createHobby(userId: string, title: string, durationMinutes: number, deepLinkUrl?: string) {
    return prisma.hobbyShortcut.create({
      data: { userId, title, durationMinutes, deepLinkUrl },
    });
  },

  findHobbyById(id: string) {
    return prisma.hobbyShortcut.findUnique({ where: { id } });
  },
};
