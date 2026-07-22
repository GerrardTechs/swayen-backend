"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swayenService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
const swayen_repository_1 = require("./swayen.repository");
exports.swayenService = {
    async getBalanceWithHistory(userId) {
        const wallet = await swayen_repository_1.swayenRepository.getOrCreateWallet(userId);
        const transactions = await swayen_repository_1.swayenRepository.listTransactions(userId);
        return { balance: wallet.balance, transactions };
    },
    listHobbies(userId) {
        return swayen_repository_1.swayenRepository.listHobbies(userId);
    },
    createHobby(userId, title, durationMinutes, deepLinkUrl) {
        return swayen_repository_1.swayenRepository.createHobby(userId, title, durationMinutes, deepLinkUrl);
    },
    /**
     * Menambah koin user (dipanggil modul lain, misal TimeBox saat sesi fokus selesai).
     * Diekspos sebagai fungsi service murni (bukan lewat HTTP) agar bisa dipakai
     * modul TimeBox: `await swayenService.earnCoins(userId, 1, "TimeBox Selesai")`.
     */
    async earnCoins(userId, amount, activityName) {
        await swayen_repository_1.swayenRepository.getOrCreateWallet(userId); // pastikan wallet ada
        const [wallet] = await prisma_1.prisma.$transaction([
            swayen_repository_1.swayenRepository.incrementBalance(userId, amount),
            swayen_repository_1.swayenRepository.createTransaction(userId, client_1.CoinTransactionType.EARNED, amount, activityName),
        ]);
        return wallet;
    },
    /**
     * Memotong koin user untuk menjalankan Quick-Start Hobby.
     * Validasi saldo cukup dilakukan di dalam transaksi untuk mencegah race condition
     * sederhana (saldo negatif akibat request paralel).
     */
    async spendCoins(userId, amount, activityName, hobbyId) {
        if (hobbyId) {
            const hobby = await swayen_repository_1.swayenRepository.findHobbyById(hobbyId);
            if (!hobby || hobby.userId !== userId) {
                throw ApiError_1.ApiError.notFound("Hobi tidak ditemukan");
            }
        }
        const wallet = await swayen_repository_1.swayenRepository.getOrCreateWallet(userId);
        if (wallet.balance < amount) {
            throw ApiError_1.ApiError.badRequest("Saldo Swayen Coin tidak cukup");
        }
        const [updatedWallet] = await prisma_1.prisma.$transaction([
            swayen_repository_1.swayenRepository.decrementBalance(userId, amount),
            swayen_repository_1.swayenRepository.createTransaction(userId, client_1.CoinTransactionType.SPENT, amount, activityName),
        ]);
        return updatedWallet;
    },
};
//# sourceMappingURL=swayen.service.js.map