import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";
import { ensureImagesUploadDir } from "./modules/admin/uploads/admin-uploads.service";
import { judgeProducer } from "./modules/judge/queue/producer";

let server: ReturnType<typeof app.listen>;

async function bootstrap() {
  await ensureImagesUploadDir();

  server = app.listen(env.PORT, () => {
    console.log(`Codenix API running on http://localhost:${env.PORT}`);
  });
}

async function shutdown(signal: string) {
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

bootstrap().catch((error) => {
  console.error("Failed to start Codenix API", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
});

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
