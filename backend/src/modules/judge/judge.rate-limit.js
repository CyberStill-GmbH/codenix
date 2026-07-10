import rateLimit, { ipKeyGenerator } from "express-rate-limit";
export function getJudgeRateLimitKey(req) {
    if (req.user?.id)
        return req.user.id;
    return ipKeyGenerator(req.ip ?? "anonymous");
}
function judgeRateLimiter(limit) {
    return rateLimit({
        windowMs: 60_000,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: getJudgeRateLimitKey,
        validate: { xForwardedForHeader: false },
        handler: (_req, res) => res.status(429).json({
            code: "JUDGE_RATE_LIMITED",
            message: "Too many code executions. Try again in a minute."
        })
    });
}
export const runRateLimiter = judgeRateLimiter(15);
export const submissionRateLimiter = judgeRateLimiter(6);
//# sourceMappingURL=judge.rate-limit.js.map