import { z } from "zod";

export const startTimeBoxSchema = z.object({
  body: z.object({
    // Default 45 menit sesuai contoh spesifikasi, bisa disesuaikan user
    durationMinutes: z.number().int().min(5, "Minimal 5 menit").max(180, "Maksimal 180 menit").default(45),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const finishTimeBoxSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid("sessionId tidak valid"),
    status: z.enum(["COMPLETED", "INTERRUPTED"]).default("COMPLETED"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Wuxiu Nap: durasi tetap 20 menit (Low Battery mode), tidak butuh input tambahan
export const startWuxiuSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
