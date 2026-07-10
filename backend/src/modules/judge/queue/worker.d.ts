import { Worker, type Job } from "bullmq";
import { type JudgeJobPayload } from "./types";
export declare function processJudgeJob(job: Job<JudgeJobPayload>): Promise<void>;
export declare function createJudgeWorker(): Worker<JudgeJobPayload, any, string>;
//# sourceMappingURL=worker.d.ts.map