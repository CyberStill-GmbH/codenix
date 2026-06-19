import { Router } from "express";
import { problemController } from "./problems.controller";
import {
  problemSlugParamsSchema,
  problemsQuerySchema,
  problemsSearchQuerySchema
} from "./problems.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { optionalAuthMiddleware } from "../../shared/middleware/optional-auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";

export const problemsRoutes = Router();

problemsRoutes.get(
  "/",
  asyncHandler(optionalAuthMiddleware),
  validate({ query: problemsQuerySchema }),
  asyncHandler(problemController.list)
);

problemsRoutes.get(
  "/search",
  validate({ query: problemsSearchQuerySchema }),
  asyncHandler(problemController.search)
);

problemsRoutes.get(
  "/topics",
  asyncHandler(problemController.listTopics)
);

problemsRoutes.get(
  "/:slug",
  asyncHandler(optionalAuthMiddleware),
  validate({ params: problemSlugParamsSchema }),
  asyncHandler(problemController.findBySlug)
);
