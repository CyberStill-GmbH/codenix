import { Queue } from "bullmq";
import { env } from "../../../config/env";
import { JUDGE_QUEUE_NAME } from "./types";
export const judgeQueue = new Queue(JUDGE_QUEUE_NAME, {
    connection: {
        url: env.REDIS_URL
    },
    defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true,
    }
});
export const judgeProducer = {
    async addJob(payload) {
        const jobId = payload.runId ?? payload.submissionId;
        if (!jobId) {
            throw new Error("Judge jobs require a runId or submissionId.");
        }
        return judgeQueue.add("judge-job", payload, { jobId });
    },
    async close() {
        await judgeQueue.close();
    }
};
//# sourceMappingURL=producer.js.map