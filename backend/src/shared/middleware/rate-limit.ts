import rateLimit from "express-rate-limit";

type RateLimiterOptions = {
  windowMs: number;
  limit: number;
  message: string;
};

export function createRateLimiter({
  windowMs,
  limit,
  message
}: RateLimiterOptions) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) =>
      res.status(429).json({
        code: "RATE_LIMITED",
        message
      })
  });
}
