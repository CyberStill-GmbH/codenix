import rateLimit from "express-rate-limit";

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      code: "RATE_LIMITED",
      message: "Too many password reset requests. Try again later."
    });
  }
});

export const resetPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      code: "RATE_LIMITED",
      message: "Too many password reset attempts. Try again later."
    });
  }
});