import { prisma } from "./db/prisma";
import { createJudgeWorker } from "./modules/judge/queue/worker";

const worker = createJudgeWorker();

worker.on("completed", (job) => console.log(`Judge job ${job.id} completed.`));
worker.on("failed", (job, error) =>
  console.error(`Judge job ${job?.id ?? "unknown"} failed.`, error)
);
worker.on("error", (error) => console.error("Judge worker error.", error));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
});

console.log("Judge worker started and listening to the queue...");

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down judge worker...`);
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
