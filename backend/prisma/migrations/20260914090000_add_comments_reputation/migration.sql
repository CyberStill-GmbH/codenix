CREATE TYPE "CommentVoteType" AS ENUM ('up', 'down');

CREATE TABLE "comments" (
  "id" TEXT NOT NULL,
  "problem_id" TEXT NOT NULL,
  "author_id" TEXT NOT NULL,
  "parent_id" TEXT,
  "content" TEXT NOT NULL,
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "downvotes" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "comment_votes" (
  "id" TEXT NOT NULL,
  "comment_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "vote_type" "CommentVoteType" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "comment_votes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_reputation" (
  "user_id" TEXT NOT NULL,
  "reputation_score" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_reputation_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "user_profile_views" (
  "id" TEXT NOT NULL,
  "viewer_id" TEXT,
  "profile_user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_profile_views_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "comment_votes_comment_id_user_id_key" ON "comment_votes"("comment_id", "user_id");
CREATE INDEX "comments_problem_id_created_at_idx" ON "comments"("problem_id", "created_at");
CREATE INDEX "comments_problem_id_parent_id_created_at_idx" ON "comments"("problem_id", "parent_id", "created_at");
CREATE INDEX "comments_author_id_created_at_idx" ON "comments"("author_id", "created_at");
CREATE INDEX "comment_votes_comment_id_vote_type_idx" ON "comment_votes"("comment_id", "vote_type");
CREATE INDEX "comment_votes_user_id_idx" ON "comment_votes"("user_id");
CREATE INDEX "user_profile_views_profile_user_id_created_at_idx" ON "user_profile_views"("profile_user_id", "created_at");
CREATE INDEX "user_profile_views_viewer_id_profile_user_id_created_at_idx" ON "user_profile_views"("viewer_id", "profile_user_id", "created_at");

ALTER TABLE "comments" ADD CONSTRAINT "comments_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_reputation" ADD CONSTRAINT "user_reputation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_profile_views" ADD CONSTRAINT "user_profile_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "user_profile_views" ADD CONSTRAINT "user_profile_views_profile_user_id_fkey" FOREIGN KEY ("profile_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
