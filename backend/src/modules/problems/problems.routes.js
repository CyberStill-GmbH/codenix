import { Router } from "express";
import { problemController } from "./problems.controller";
import { problemSlugParamsSchema, problemsQuerySchema, problemsSearchQuerySchema, problemIdentifierParamsSchema, runCodeRequestSchema, createSubmissionRequestSchema } from "./problems.schema";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { optionalAuthMiddleware } from "../../shared/middleware/optional-auth.middleware";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
import { runRateLimiter, submissionRateLimiter } from "../judge/judge.rate-limit";
export const problemsRoutes = Router();
problemsRoutes.get("/", asyncHandler(optionalAuthMiddleware), validate({ query: problemsQuerySchema }), asyncHandler(problemController.list));
problemsRoutes.get("/search", validate({ query: problemsSearchQuerySchema }), asyncHandler(problemController.search));
problemsRoutes.get("/topics", asyncHandler(problemController.listTopics));
problemsRoutes.post("/:problemId/run", asyncHandler(authMiddleware), runRateLimiter, validate({
    params: problemIdentifierParamsSchema,
    body: runCodeRequestSchema
}), asyncHandler(problemController.runCode));
problemsRoutes.post("/:problemId/submissions", asyncHandler(authMiddleware), submissionRateLimiter, validate({
    params: problemIdentifierParamsSchema,
    body: createSubmissionRequestSchema
}), asyncHandler(problemController.submitCode));
problemsRoutes.get("/:slug", asyncHandler(optionalAuthMiddleware), validate({ params: problemSlugParamsSchema }), asyncHandler(problemController.findBySlug));
//# sourceMappingURL=problems.routes.js.map