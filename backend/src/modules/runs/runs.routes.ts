import { Router } from "express";
import { runsController } from "./runs.controller";
import { runIdParamsSchema } from "./runs.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";

export const runsRoutes = Router();

runsRoutes.use(asyncHandler(authMiddleware));

runsRoutes.get(
  "/:runId",
  validate({ params: runIdParamsSchema }),
  asyncHandler(runsController.getRun)
);
