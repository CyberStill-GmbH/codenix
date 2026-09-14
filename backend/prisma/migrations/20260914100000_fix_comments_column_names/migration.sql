-- The initial community migration used snake_case column names while the
-- existing Prisma schema uses its default camelCase mapping. Rename in place
-- so production data is preserved and Prisma can address the tables.
ALTER TABLE "comments" RENAME COLUMN "problem_id" TO "problemId";
ALTER TABLE "comments" RENAME COLUMN "author_id" TO "authorId";
ALTER TABLE "comments" RENAME COLUMN "parent_id" TO "parentId";
ALTER TABLE "comments" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "comments" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "comments" RENAME COLUMN "deleted_at" TO "deletedAt";

ALTER TABLE "comment_votes" RENAME COLUMN "comment_id" TO "commentId";
ALTER TABLE "comment_votes" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "comment_votes" RENAME COLUMN "vote_type" TO "voteType";
ALTER TABLE "comment_votes" RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "user_reputation" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "user_reputation" RENAME COLUMN "reputation_score" TO "reputationScore";
ALTER TABLE "user_reputation" RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "user_profile_views" RENAME COLUMN "viewer_id" TO "viewerId";
ALTER TABLE "user_profile_views" RENAME COLUMN "profile_user_id" TO "profileUserId";
ALTER TABLE "user_profile_views" RENAME COLUMN "created_at" TO "createdAt";
