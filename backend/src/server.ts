import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Codenix API running on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
