import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"), // batas aman bcrypt/argon2 input
    name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "refreshToken wajib diisi"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const logoutSchema = refreshSchema;

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
