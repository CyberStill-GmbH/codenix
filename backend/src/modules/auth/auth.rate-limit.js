import rateLimit from "express-rate-limit";
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        return res.status(429).json({
            code: "RATE_LIMITED",
            message: "Too many login attempts. Try again later."
        });
    }
});
export const registerRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        return res.status(429).json({
            code: "RATE_LIMITED",
            message: "Too many registration attempts. Try again later."
        });
    }
});
//# sourceMappingURL=auth.rate-limit.js.map