"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Format email tidak valid"),
        password: zod_1.z
            .string()
            .min(8, "Password minimal 8 karakter")
            .max(72, "Password maksimal 72 karakter"), // batas aman bcrypt/argon2 input
        name: zod_1.z.string().trim().min(1, "Nama wajib diisi").max(100),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Format email tidak valid"),
        password: zod_1.z.string().min(1, "Password wajib diisi"),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, "refreshToken wajib diisi"),
    }),
    query: zod_1.z.object({}).optional(),
    params: zod_1.z.object({}).optional(),
});
exports.logoutSchema = exports.refreshSchema;
//# sourceMappingURL=auth.validation.js.map