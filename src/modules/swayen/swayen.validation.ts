import { z } from "zod";

export const createHobbySchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(100),
    durationMinutes: z.number().int().min(1).max(60),
    deepLinkUrl: z.string().url().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const spendCoinSchema = z.object({
  body: z.object({
    hobbyId: z.string().uuid().optional(),
    activityName: z.string().trim().min(1).max(100),
    amount: z.number().int().positive("Jumlah koin harus lebih dari 0"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type CreateHobbyInput = z.infer<typeof createHobbySchema>["body"];
export type SpendCoinInput = z.infer<typeof spendCoinSchema>["body"];
