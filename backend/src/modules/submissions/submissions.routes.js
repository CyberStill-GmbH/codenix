import { Router } from "express";
import { submissionsController } from "./submissions.controller";
import { submissionParamsSchema, submissionsQuerySchema } from "./submissions.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
export const submissionsRoutes = Router();
submissionsRoutes.use(asyncHandler(authMiddleware));
submissionsRoutes.get("/", validate({ query: submissionsQuerySchema }), asyncHandler(submissionsController.list));
submissionsRoutes.get("/:submissionId", validate({ params: submissionParamsSchema }), asyncHandler(submissionsController.findById));
//# sourceMappingURL=submissions.routes.js.map