"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeNightPlanSchema = exports.createNightPlanSchema = void 0;
const zod_1 = require("zod");
exports.createNightPlanSchema = zod_1.z.object({
    body: zod_1.z.object({
        tasks: zod_1.z
            .array(zod_1.z.string().trim().min(1, "Task tidak boleh kosong").max(200))
            .min(1, "Minimal 1 rencana")
            .max(5, "Maksimal 5 baris rencana malam hari"),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.completeNightPlanSchema = zod_1.z.object({
    body: zod_1.z.object({}).optional(),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("ID rencana tidak valid"),
    }),
});
//# sourceMappingURL=nightPlanner.validation.js.map