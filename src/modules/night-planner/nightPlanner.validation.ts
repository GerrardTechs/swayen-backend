import { z } from "zod";

export const createNightPlanSchema = z.object({
  body: z.object({
    tasks: z
      .array(z.string().trim().min(1, "Task tidak boleh kosong").max(200))
      .min(1, "Minimal 1 rencana")
      .max(5, "Maksimal 5 baris rencana malam hari"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const completeNightPlanSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid("ID rencana tidak valid"),
  }),
});

export const toggleNightTaskSchema = z.object({
  body: z.object({
    completed: z.boolean(),
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid("ID rencana tidak valid"),
    taskIndex: z.coerce.number().int().min(0).max(4),
  }),
});

export type CreateNightPlanInput = z.infer<typeof createNightPlanSchema>["body"];
