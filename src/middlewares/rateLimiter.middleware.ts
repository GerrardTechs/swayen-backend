import rateLimit from "express-rate-limit";

// Endpoint auth dibatasi lebih ketat untuk mencegah brute-force / credential stuffing
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak percobaan, coba lagi dalam 1 menit",
  },
});

// Rate limit umum untuk seluruh API
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi sebentar lagi",
  },
});
