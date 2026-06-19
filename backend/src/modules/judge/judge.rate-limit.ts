import rateLimit from "express-rate-limit";
import type { Request } from "express";

// Express 5 / express-rate-limit v7: keyGenerator must use ipKeyGenerator
// for IPv6 compliance. We prefer userId when authenticated, fall back to IP.
function judgeRateLimiter(limit: number) {
  return rateLimit({
    windowMs: 60_000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    // Use authenticated userId when available; for unauthenticated requests
    // fall back to IP (normalised to prevent IPv6 bypass).
    keyGenerator: (req: Request) => {
      if (req.user?.id) return req.user.id;
      // Normalise IPv6-mapped IPv4 e.g. "::ffff:127.0.0.1" -> "127.0.0.1"
      const ip = (req.ip ?? "anonymous").replace(/^::ffff:/, "");
      return ip;
    },
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
