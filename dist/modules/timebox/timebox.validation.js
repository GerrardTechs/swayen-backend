"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWuxiuSchema = exports.finishTimeBoxSchema = exports.startTimeBoxSchema = void 0;
const zod_1 = require("zod");
exports.startTimeBoxSchema = zod_1.z.object({
    body: zod_1.z.object({
        // Default 45 menit sesuai contoh spesifikasi, bisa disesuaikan user
        durationMinutes: zod_1.z.number().int().min(5, "Minimal 5 menit").max(180, "Maksimal 180 menit").default(45),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.finishTimeBoxSchema = zod_1.z.object({
    body: zod_1.z.object({
        sessionId: zod_1.z.string().uuid("sessionId tidak valid"),
        status: zod_1.z.enum(["COMPLETED", "INTERRUPTED"]).default("COMPLETED"),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
// Wuxiu Nap: durasi tetap 20 menit (Low Battery mode), tidak butuh input tambahan
exports.startWuxiuSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
//# sourceMappingURL=timebox.validation.js.map