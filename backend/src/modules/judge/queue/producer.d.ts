import { Queue } from "bullmq";
import { type JudgeJobPayload } from "./types";
export declare const judgeQueue: Queue<JudgeJobPayload, any, string, JudgeJobPayload, any, string>;
export declare const judgeProducer: {
    addJob(payload: JudgeJobPayload): Promise<import("bullmq").Job<JudgeJobPayload, any, string>>;
    close(): Promise<void>;
};
//# sourceMappingURL=producer.d.ts.map