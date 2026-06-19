import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

export function getJudgeRateLimitKey(req: Request) {
  if (req.user?.id) return req.user.id;
  return ipKeyGenerator(req.ip ?? "anonymous");
}

function judgeRateLimiter(limit: number) {
  return rateLimit({
    windowMs: 60_000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getJudgeRateLimitKey,
    validate: { xForwardedForHeader: false },
    handler: (_req, res) =>
      res.status(429).json({
        code: "JUDGE_RATE_LIMITED",
        message: "Too many code executions. Try again in a minute."
      })
  });
}

export const runRateLimiter = judgeRateLimiter(15);
export const submissionRateLimiter = judgeRateLimiter(6);
