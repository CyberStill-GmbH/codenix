import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { optionalAuthMiddleware } from "../../shared/middleware/optional-auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
import { commentsController } from "./comments.controller";
import { commentRateLimiter, commentVoteRateLimiter } from "./community.rate-limit";
import { commentIdParamsSchema, commentListQuerySchema, createCommentSchema, problemCommentsParamsSchema, voteCommentSchema } from "./comments.schema";
import { uploadCommentImage } from "./comment-uploads.middleware";
import { commentUploadsController } from "./comment-uploads.controller";
import { sameOriginMiddleware } from "../../shared/middleware/same-origin.middleware";

export const commentsRoutes = Router();

commentsRoutes.get("/problems/:problemId/comments", asyncHandler(optionalAuthMiddleware), validate({ params: problemCommentsParamsSchema, query: commentListQuerySchema }), asyncHandler(commentsController.list));
commentsRoutes.post("/problems/:problemId/comments", asyncHandler(authMiddleware), sameOriginMiddleware, commentRateLimiter, validate({ params: problemCommentsParamsSchema, body: createCommentSchema }), asyncHandler(commentsController.create));
commentsRoutes.post("/problems/:problemId/comments/images", asyncHandler(authMiddleware), sameOriginMiddleware, commentRateLimiter, validate({ params: problemCommentsParamsSchema }), uploadCommentImage, asyncHandler(commentUploadsController.upload));
commentsRoutes.post("/comments/:commentId/vote", asyncHandler(authMiddleware), sameOriginMiddleware, commentVoteRateLimiter, validate({ params: commentIdParamsSchema, body: voteCommentSchema }), asyncHandler(commentsController.vote));
commentsRoutes.get("/users/:userId/profile", asyncHandler(optionalAuthMiddleware), asyncHandler(commentsController.profile));
