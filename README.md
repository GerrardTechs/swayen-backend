# Swayen Backend API

Backend API untuk aplikasi produktivitas berbasis energi & momentum (5 Langkah / Konsep Swayen).
Stack: Node.js + TypeScript, Express, Prisma ORM, PostgreSQL (Neon).

## Struktur Folder (Layered / Clean Architecture)

```
swayen-backend/
├── prisma/
│   └── schema.prisma          # Semua model: User, RefreshToken, NightPlanner, TimeBoxSession,
│                               # SwayenCoin, CoinTransaction, HobbyShortcut, DailyQuote
├── src/
│   ├── config/
│   │   ├── env.ts              # Validasi & load environment variables (Zod)
│   │   └── prisma.ts           # Singleton PrismaClient
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # Verifikasi JWT access token + update lastActiveAt
│   │   ├── rateLimiter.middleware.ts# authRateLimiter (5/menit) & generalRateLimiter (100/menit)
│   │   ├── validate.middleware.ts   # Wrapper validasi Zod per-route
│   │   └── error.middleware.ts      # 404 handler + global error handler
│   ├── utils/
│   │   ├── ApiError.ts         # Custom error class dengan status code helper
│   │   ├── ApiResponse.ts      # Format response sukses yang konsisten
│   │   ├── asyncHandler.ts     # Wrapper agar controller async tidak perlu try/catch
│   │   ├── jwt.ts              # Sign & verify access/refresh token
│   │   └── password.ts         # Hash & verify password (Argon2id)
│   ├── modules/
│   │   ├── auth/                 # ✅ Selesai (register, login, refresh, logout)
│   │   ├── users/                # ✅ Selesai (GET /users/me)
│   │   ├── night-planner/        # ✅ Selesai (Langkah 1 & 5 - Night Sentinel)
│   │   ├── timebox/              # ✅ Selesai (Langkah 2 & 3 - TimeBox + Wuxiu Nap)
│   │   ├── swayen/               # ✅ Selesai (Langkah 4 - Wallet & Hobbies)
│   │   └── system/               # ✅ Selesai (Daily Quotes + Engagement Status)
│   ├── routes/
│   │   └── index.ts            # Central router, mount tiap modul
│   ├── app.ts                  # Express app: helmet, cors, rate limiter, routes, error handler
│   └── server.ts               # Entry point + graceful shutdown
├── .env.example
├── package.json
└── tsconfig.json
```

Setiap modul mengikuti pola 4 lapis yang sama:
`*.routes.ts → *.controller.ts → *.service.ts → *.repository.ts`, ditambah `*.validation.ts` untuk skema Zod.

## Setup

```bash
npm install
cp .env.example .env      # isi DATABASE_URL & JWT secrets
npx prisma migrate dev --name init
npm run dev
```

## Status Modul

| Modul | Endpoint | Status |
|---|---|---|
| Auth | POST /auth/register, /auth/login, /auth/refresh, /auth/logout | ✅ Selesai |
| Users | GET /users/me | ✅ Selesai |
| Night Planner | POST /night-planner, GET /night-planner/today, PATCH /night-planner/:id/complete | ✅ Selesai |
| Swayen Wallet & Hobbies | GET /swayen/balance, GET/POST /swayen/hobbies, POST /swayen/spend | ✅ Selesai |
| TimeBox & Wuxiu | POST /timebox/start, /timebox/finish, /timebox/wuxiu | ✅ Selesai |
| System & Engagement | GET /system/quotes/today, /system/engagement-status | ✅ Selesai |

Catatan: `timeboxService.finish()` sudah memanggil `swayenService.earnCoins()` langsung (bukan lewat HTTP)
saat status `COMPLETED` dan sesi bukan Wuxiu Nap — reward 1 Swayen Coin otomatis masuk ke wallet user.

**Semua 6 modul dari spesifikasi sudah selesai diimplementasikan.** 🎉

## Seeding Daily Quotes

`prisma/seed.ts` berisi quote placeholder (bukan konten asli Ruangguru — ganti dengan quote
bersumber resmi + atribusi yang benar sebelum production). Jalankan dengan:

```bash
npx prisma db seed
```

`GET /system/quotes/today` akan fallback otomatis (rotasi deterministik berbasis hari-ke-berapa
dalam setahun) kalau tidak ada quote yang di-assign eksplisit ke tanggal hari itu.
