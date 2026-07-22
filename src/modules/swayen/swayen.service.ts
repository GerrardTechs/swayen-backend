import { CoinTransactionType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import { swayenRepository } from "./swayen.repository";

export const swayenService = {
  async getBalanceWithHistory(userId: string) {
    const wallet = await swayenRepository.getOrCreateWallet(userId);
    const transactions = await swayenRepository.listTransactions(userId);
    return { balance: wallet.balance, transactions };
  },

  listHobbies(userId: string) {
    return swayenRepository.listHobbies(userId);
  },

  createHobby(userId: string, title: string, durationMinutes: number, deepLinkUrl?: string) {
    return swayenRepository.createHobby(userId, title, durationMinutes, deepLinkUrl);
  },

  /**
   * Menambah koin user (dipanggil modul lain, misal TimeBox saat sesi fokus selesai).
   * Diekspos sebagai fungsi service murni (bukan lewat HTTP) agar bisa dipakai
   * modul TimeBox: `await swayenService.earnCoins(userId, 1, "TimeBox Selesai")`.
   */
  async earnCoins(userId: string, amount: number, activityName: string) {
    await swayenRepository.getOrCreateWallet(userId); // pastikan wallet ada

    const [wallet] = await prisma.$transaction([
      swayenRepository.incrementBalance(userId, amount),
      swayenRepository.createTransaction(userId, CoinTransactionType.EARNED, amount, activityName),
    ]);

    return wallet;
  },

  /**
   * Memotong koin user untuk menjalankan Quick-Start Hobby.
   * Validasi saldo cukup dilakukan di dalam transaksi untuk mencegah race condition
   * sederhana (saldo negatif akibat request paralel).
   */
  async spendCoins(userId: string, amount: number, activityName: string, hobbyId?: string) {
    if (hobbyId) {
      const hobby = await swayenRepository.findHobbyById(hobbyId);
      if (!hobby || hobby.userId !== userId) {
        throw ApiError.notFound("Hobi tidak ditemukan");
      }
    }

    const wallet = await swayenRepository.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      throw ApiError.badRequest("Saldo Swayen Coin tidak cukup");
    }

    const [updatedWallet] = await prisma.$transaction([
      swayenRepository.decrementBalance(userId, amount),
      swayenRepository.createTransaction(userId, CoinTransactionType.SPENT, amount, activityName),
    ]);

    return updatedWallet;
  },
};
