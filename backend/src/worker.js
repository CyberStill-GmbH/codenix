import { prisma } from "./db/prisma";
import { createJudgeWorker } from "./modules/judge/queue/worker";
const worker = createJudgeWorker();
worker.on("completed", (job) => console.log(`Judge job ${job.id} completed.`));
worker.on("failed", (job, error) => console.error(`Judge job ${job?.id ?? "unknown"} failed.`, error));
console.log("Judge worker started and listening to the queue...");
async function shutdown(signal) {
    console.log(`${signal} received. Shutting down judge worker...`);
    await worker.close();
    await prisma.$disconnect();
    process.exit(0);
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
//# sourceMappingURL=worker.js.map