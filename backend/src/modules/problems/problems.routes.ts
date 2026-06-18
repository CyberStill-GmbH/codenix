import { Router } from "express";
import { problemController } from "./problems.controller";
import {
  problemSlugParamsSchema,
  problemsQuerySchema
} from "./problems.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate.middleware";

export const problemsRoutes = Router();

problemsRoutes.get(
  "/",
  validate({ query: problemsQuerySchema }),
  asyncHandler(problemController.list)
);

problemsRoutes.get(
  "/topics",
  asyncHandler(problemController.listTopics)
);

problemsRoutes.get(
  "/:slug",
  validate({ params: problemSlugParamsSchema }),
  asyncHandler(problemController.findBySlug)
);