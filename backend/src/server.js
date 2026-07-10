import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";
import { ensureImagesUploadDir } from "./modules/admin/uploads/admin-uploads.service";
import { judgeProducer } from "./modules/judge/queue/producer";
let server;
async function bootstrap() {
    await ensureImagesUploadDir();
    server = app.listen(env.PORT, () => {
        console.log(`Codenix API running on http://localhost:${env.PORT}`);
    });
}
async function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);
    if (!server) {
        await judgeProducer.close();
        await prisma.$disconnect();
        process.exit(0);
    }
    server.close(async () => {
        await judgeProducer.close();
        await prisma.$disconnect();
        process.exit(0);
    });
}
void bootstrap();
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
//# sourceMappingURL=server.js.map