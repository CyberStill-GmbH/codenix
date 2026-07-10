import type { Request } from "express";
export declare function getJudgeRateLimitKey(req: Request): string;
export declare const runRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const submissionRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=judge.rate-limit.d.ts.map