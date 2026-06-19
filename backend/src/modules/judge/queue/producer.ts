import { Queue } from "bullmq";
import { env } from "../../../config/env";
import type { JudgeJobPayload } from "./types";

export const JUDGE_QUEUE_NAME = "judge-queue";

export const judgeQueue = new Queue<JudgeJobPayload>(JUDGE_QUEUE_NAME, {
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
  async addJob(payload: JudgeJobPayload) {
    const jobId = payload.runId ?? payload.submissionId;
    return await judgeQueue.add("judge-job" as never, payload, { jobId });
  }
};
