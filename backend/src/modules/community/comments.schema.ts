import { z } from "zod";

export const commentListQuerySchema = z.object({
  sort: z.enum(["newest", "oldest", "best"]).default("best"),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const commentIdParamsSchema = z.object({ commentId: z.string().uuid() });
export const problemCommentsParamsSchema = z.object({ problemId: z.string().uuid() });
export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(10_000),
  parentId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().regex(/^\/uploads\/images\/comments\/[a-f0-9-]+\.(?:jpg|png|webp)$/i, "Invalid comment image.").optional(),
});
export const voteCommentSchema = z.object({ vote: z.enum(["up", "down"]) });

export type CommentListQuery = z.infer<typeof commentListQuerySchema>;
