import { PrismaClient, Prisma } from "@prisma/client";
import { env } from "./env";

// Singleton PrismaClient agar tidak membuka koneksi baru tiap hot-reload (dev mode)
declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const basePrisma =
  global.__prisma__ ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma__ = basePrisma;
}

// Kode error Prisma yang berhubungan dengan Neon cold start / connection pool penuh:
// P1001 = server tidak terjangkau (khas banget pas Neon compute lagi "bangun" dari idle)
// P2024 = timeout nunggu koneksi dari connection pool
const RETRYABLE_CODES = new Set(["P1001", "P2024"]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

function isRetryableError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(err.code);
  }
  // Error koneksi awal (server belum reachable sama sekali) juga masuk kategori ini
  if (err instanceof Prisma.PrismaClientInitializationError) return true;
  return false;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Global retry-on-cold-start: dipasang lewat Prisma Client Extension supaya berlaku
 * otomatis di SEMUA model & operation (User, NightPlanner, TimeBoxSession, dst) —
 * tidak perlu ubah tiap repository satu-satu. Exponential backoff: 500ms, 1000ms, 2000ms.
 */
export const prisma = basePrisma.$extends({
  name: "retry-on-cold-start",
  query: {
    $allModels: {
      async $allOperations({ query, args }) {
        let lastError: unknown;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            return await query(args);
          } catch (err) {
            lastError = err;
            if (!isRetryableError(err) || attempt === MAX_RETRIES) throw err;
            const delay = BASE_DELAY_MS * 2 ** attempt;
            // eslint-disable-next-line no-console
            console.warn(
              `[prisma] Retry ${attempt + 1}/${MAX_RETRIES} setelah ${delay}ms (kemungkinan Neon cold start)...`
            );
            await sleep(delay);
          }
        }
        throw lastError;
      },
    },
  },
});
