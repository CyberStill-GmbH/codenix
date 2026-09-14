import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

function userOrIp(req: Request) {
  return req.user?.id ?? ipKeyGenerator(req.ip ?? "anonymous");
}

export const commentRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIp,
  validate: { xForwardedForHeader: false },
});

export const commentVoteRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIp,
  validate: { xForwardedForHeader: false },
});
