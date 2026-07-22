"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spendCoinSchema = exports.createHobbySchema = void 0;
const zod_1 = require("zod");
exports.createHobbySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1).max(100),
        durationMinutes: zod_1.z.number().int().min(1).max(60),
        deepLinkUrl: zod_1.z.string().url().optional(),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.spendCoinSchema = zod_1.z.object({
    body: zod_1.z.object({
        hobbyId: zod_1.z.string().uuid().optional(),
        activityName: zod_1.z.string().trim().min(1).max(100),
        amount: zod_1.z.number().int().positive("Jumlah koin harus lebih dari 0"),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
//# sourceMappingURL=swayen.validation.js.map