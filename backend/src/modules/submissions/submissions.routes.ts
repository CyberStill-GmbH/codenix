import { Router } from "express";
import { submissionsController } from "./submissions.controller";
import { submissionsQuerySchema } from "./submissions.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";

export const submissionsRoutes = Router();

submissionsRoutes.get(
  "/",
  asyncHandler(authMiddleware),
  validate({ query: submissionsQuerySchema }),
  asyncHandler(submissionsController.list)
);
