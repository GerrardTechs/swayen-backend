import { createApp } from "./app.js";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const app = createApp();

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Swayen API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// Graceful shutdown agar koneksi Prisma & server ditutup dengan bersih
async function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} diterima, mematikan server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
