import { Router } from "express";
import { authController } from "./auth.controller";
import { oauthController } from "./oauth.controller";
import { loginSchema, registerSchema } from "./auth.schema";
import {
  oauthCallbackQuerySchema,
  oauthRedirectQuerySchema
} from "./oauth.schema";
import { loginRateLimiter, registerRateLimiter } from "./auth.rate-limit";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
import { passwordResetController } from "./password-reset.controller";
import {
  forgotPasswordSchema,
  resetPasswordSchemaBody
} from "./password-reset.schema";
import {
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter
} from "./password-reset.rate-limit";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  registerRateLimiter,
  validate({ body: registerSchema }),
  asyncHandler(authController.register)
);

authRoutes.post(
  "/login",
  loginRateLimiter,
  validate({ body: loginSchema }),
  asyncHandler(authController.login)
);

authRoutes.get(
  "/me",
  asyncHandler(authMiddleware),
  asyncHandler(authController.me)
);

authRoutes.post(
  "/logout",
  asyncHandler(authMiddleware),
  asyncHandler(authController.logout)
);

authRoutes.get(
  "/google/redirect",
  validate({ query: oauthRedirectQuerySchema }),
  asyncHandler(oauthController.redirectGoogle)
);

authRoutes.get(
  "/github/redirect",
  validate({ query: oauthRedirectQuerySchema }),
  asyncHandler(oauthController.redirectGitHub)
);

authRoutes.get(
  "/google/callback",
  validate({ query: oauthCallbackQuerySchema }),
  asyncHandler(oauthController.callbackGoogle)
);

authRoutes.get(
  "/github/callback",
  validate({ query: oauthCallbackQuerySchema }),
  asyncHandler(oauthController.callbackGitHub)
);

authRoutes.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  validate({ body: forgotPasswordSchema }),
  asyncHandler(passwordResetController.forgotPassword)
);

authRoutes.post(
  "/reset-password",
  resetPasswordRateLimiter,
  validate({ body: resetPasswordSchemaBody }),
  asyncHandler(passwordResetController.resetPassword)
);