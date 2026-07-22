"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swayenRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.swayenRepository = {
    // Memastikan setiap user punya 1 row SwayenCoin (dibuat lazy saat pertama diakses)
    async getOrCreateWallet(userId) {
        const existing = await prisma_1.prisma.swayenCoin.findUnique({ where: { userId } });
        if (existing)
            return existing;
        return prisma_1.prisma.swayenCoin.create({ data: { userId, balance: 0 } });
    },
    listTransactions(userId, take = 20) {
        return prisma_1.prisma.coinTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take,
        });
    },
    createTransaction(userId, type, amount, activityName) {
        return prisma_1.prisma.coinTransaction.create({
            data: { userId, type, amount, activityName },
        });
    },
    incrementBalance(userId, amount) {
        return prisma_1.prisma.swayenCoin.update({
            where: { userId },
            data: { balance: { increment: amount } },
        });
    },
    decrementBalance(userId, amount) {
        return prisma_1.prisma.swayenCoin.update({
            where: { userId },
            data: { balance: { decrement: amount } },
        });
    },
    listHobbies(userId) {
        return prisma_1.prisma.hobbyShortcut.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    createHobby(userId, title, durationMinutes, deepLinkUrl) {
        return prisma_1.prisma.hobbyShortcut.create({
            data: { userId, title, durationMinutes, deepLinkUrl },
        });
    },
    findHobbyById(id) {
        return prisma_1.prisma.hobbyShortcut.findUnique({ where: { id } });
    },
};
//# sourceMappingURL=swayen.repository.js.map