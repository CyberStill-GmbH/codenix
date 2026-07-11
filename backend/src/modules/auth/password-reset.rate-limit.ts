import { createRateLimiter } from "../../shared/middleware/rate-limit";

export const forgotPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many password reset requests. Try again later."
});

export const resetPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many password reset attempts. Try again later."
});