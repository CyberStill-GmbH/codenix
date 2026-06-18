import { Router } from "express";
import { adminProblemsController } from "./admin-problems.controller";
import {
  adminProblemBodySchema,
  adminProblemIdentifierParamsSchema,
  adminProblemTestcaseParamsSchema,
  adminProblemsQuerySchema,
  adminTestcaseBodySchema
} from "./admin-problems.schema";
import { asyncHandler } from "../../../shared/middleware/async-handler";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { adminMiddleware } from "../../../shared/middleware/admin.middleware";
import { validate } from "../../../shared/middleware/validate.middleware";

export const adminProblemsRoutes = Router();

adminProblemsRoutes.use(asyncHandler(authMiddleware));
adminProblemsRoutes.use(asyncHandler(adminMiddleware));

adminProblemsRoutes.get(
  "/",
  validate({ query: adminProblemsQuerySchema }),
  asyncHandler(adminProblemsController.list)
);

adminProblemsRoutes.post(
  "/",
  validate({ body: adminProblemBodySchema }),
  asyncHandler(adminProblemsController.create)
);

adminProblemsRoutes.get(
  "/:problemId/testcases",
  validate({ params: adminProblemIdentifierParamsSchema }),
  asyncHandler(adminProblemsController.listTestcases)
);

adminProblemsRoutes.post(
  "/:problemId/testcases",
  validate({
    params: adminProblemIdentifierParamsSchema,
    body: adminTestcaseBodySchema
  }),
  asyncHandler(adminProblemsController.createTestcase)
);

adminProblemsRoutes.put(
  "/:problemId/testcases/:testcaseId",
  validate({
    params: adminProblemTestcaseParamsSchema,
    body: adminTestcaseBodySchema
  }),
  asyncHandler(adminProblemsController.updateTestcase)
);

adminProblemsRoutes.delete(
  "/:problemId/testcases/:testcaseId",
  validate({ params: adminProblemTestcaseParamsSchema }),
  asyncHandler(adminProblemsController.deleteTestcase)
);

adminProblemsRoutes.get(
  "/:problemId",
  validate({ params: adminProblemIdentifierParamsSchema }),
  asyncHandler(adminProblemsController.findByIdentifier)
);

adminProblemsRoutes.put(
  "/:problemId",
  validate({
    params: adminProblemIdentifierParamsSchema,
    body: adminProblemBodySchema
  }),
  asyncHandler(adminProblemsController.update)
);

adminProblemsRoutes.patch(
  "/:problemId/publish",
  validate({ params: adminProblemIdentifierParamsSchema }),
  asyncHandler(adminProblemsController.publish)
);

adminProblemsRoutes.patch(
  "/:problemId/unpublish",
  validate({ params: adminProblemIdentifierParamsSchema }),
  asyncHandler(adminProblemsController.unpublish)
);