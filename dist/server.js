"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const app = (0, app_1.createApp)();
const server = app.listen(env_1.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Swayen API running on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
});
// Graceful shutdown agar koneksi Prisma & server ditutup dengan bersih
async function shutdown(signal) {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} diterima, mematikan server...`);
    server.close(async () => {
        await prisma_1.prisma.$disconnect();
        process.exit(0);
    });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
//# sourceMappingURL=server.js.map