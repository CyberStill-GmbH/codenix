import { prisma } from "../../db/prisma";
import { redisCache } from "../../shared/cache/redis-cache";
import { AppError } from "../../shared/errors/app-error";
import { usersService } from "../users/users.service";
import { submissionsService } from "../submissions/submissions.service";
import { calculateReputation, canVoteOnComment, toggleVote, type VoteType } from "./comments.domain";
import type { CommentListQuery } from "./comments.schema";

const profileCacheTtl = 30;

function serializeComment(comment: any, viewerVote: VoteType | null = null) {
  return {
    id: comment.id,
    problemId: comment.problemId,
    parentId: comment.parentId,
    content: comment.deletedAt ? "Este comentario fue eliminado." : comment.content,
    isDeleted: Boolean(comment.deletedAt),
    score: comment.upvotes - comment.downvotes,
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    viewerVote,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: comment.author,
    replies: comment.replies?.map((reply: any) => serializeComment(reply)) ?? [],
  };
}

export const commentsService = {
  async list(problemId: string, viewerId: string | undefined, query: CommentListQuery) {
    const orderBy = query.sort === "oldest"
      ? { createdAt: "asc" as const }
      : query.sort === "best"
        ? [{ upvotes: "desc" as const }, { createdAt: "desc" as const }]
        : { createdAt: "desc" as const };
    const comments = await prisma.comment.findMany({
      where: { problemId, parentId: null },
      orderBy,
      take: query.limit + 1,
      ...(query.cursor ? { skip: 1, cursor: { id: query.cursor } } : {}),
      include: {
        author: { select: { id: true, username: true, name: true, avatarUrl: true } },
        replies: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
          take: 20,
          include: { author: { select: { id: true, username: true, name: true, avatarUrl: true } } },
        },
      },
    });
    const hasMore = comments.length > query.limit;
    const page = hasMore ? comments.slice(0, query.limit) : comments;
    const nextCursor = hasMore ? page.at(-1)?.id ?? null : null;
    const viewerVotes = viewerId
      ? await prisma.commentVote.findMany({ where: { userId: viewerId, commentId: { in: page.flatMap((comment) => [comment.id, ...comment.replies.map((reply) => reply.id)]) } } })
      : [];
    const voteMap = new Map(viewerVotes.map((vote) => [vote.commentId, vote.voteType as VoteType]));
    return { data: page.map((comment) => serializeComment(comment, voteMap.get(comment.id) ?? null)), nextCursor, hasMore };
  },

  async create(problemId: string, authorId: string, content: string, parentId?: string | null) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId }, select: { id: true } });
    if (!problem) throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    if (parentId) {
      const parent = await prisma.comment.findFirst({ where: { id: parentId, problemId, deletedAt: null }, select: { id: true } });
      if (!parent) throw new AppError(404, "PARENT_COMMENT_NOT_FOUND", "Parent comment not found.");
    }
    const comment = await prisma.comment.create({
      data: { problemId, authorId, content, parentId: parentId ?? null },
      include: { author: { select: { id: true, username: true, name: true, avatarUrl: true } } },
    });
    await redisCache.invalidate(`codenix:comments:${problemId}:`);
    return serializeComment(comment);
  },

  async vote(commentId: string, userId: string, vote: VoteType) {
    return prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({ where: { id: commentId }, select: { id: true, authorId: true, problemId: true, upvotes: true, downvotes: true } });
      if (!comment) throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found.");
      if (!canVoteOnComment(comment.authorId, userId)) {
        throw new AppError(403, "SELF_VOTE_NOT_ALLOWED", "You cannot vote on your own comment.");
      }
      const current = await tx.commentVote.findUnique({ where: { commentId_userId: { commentId, userId } } });
      const nextVote = toggleVote((current?.voteType as VoteType | undefined) ?? null, vote);
      if (current && nextVote === null) await tx.commentVote.delete({ where: { id: current.id } });
      else if (current) await tx.commentVote.update({ where: { id: current.id }, data: { voteType: nextVote as "up" | "down" } });
      else await tx.commentVote.create({ data: { commentId, userId, voteType: nextVote! } });
      const delta = current?.voteType === "up" ? { upvotes: -1 } : current?.voteType === "down" ? { downvotes: -1 } : {};
      const added = nextVote === "up" ? { upvotes: 1 } : nextVote === "down" ? { downvotes: 1 } : {};
      const updated = await tx.comment.update({ where: { id: commentId }, data: { upvotes: { increment: (delta.upvotes ?? 0) + (added.upvotes ?? 0) }, downvotes: { increment: (delta.downvotes ?? 0) + (added.downvotes ?? 0) } } });
      const reputation = await tx.commentVote.groupBy({ by: ["voteType"], where: { comment: { authorId: comment.authorId } }, _count: { _all: true } });
      const up = reputation.find((item) => item.voteType === "up")?._count._all ?? 0;
      const down = reputation.find((item) => item.voteType === "down")?._count._all ?? 0;
      await tx.userReputation.upsert({ where: { userId: comment.authorId }, create: { userId: comment.authorId, reputationScore: calculateReputation(up, down) }, update: { reputationScore: calculateReputation(up, down) } });
      return { commentId: updated.id, score: updated.upvotes - updated.downvotes, upvotes: updated.upvotes, downvotes: updated.downvotes, viewerVote: nextVote };
    }).then(async (result) => { await redisCache.invalidate(`codenix:comments:${commentId}:`); return result; });
  },

  async getPublicProfile(profileUserIdOrUsername: string, viewerId?: string) {
    const user = await prisma.user.findFirst({ where: { OR: [{ id: profileUserIdOrUsername }, { username: profileUserIdOrUsername }] }, select: { id: true, username: true, name: true, avatarUrl: true, degree: true, createdAt: true, reputation: { select: { reputationScore: true } }, _count: { select: { submissions: true } } } });
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    const profileUserId = user.id;
    const viewerKey = viewerId ?? "anonymous";
    const shouldCountView = viewerId !== profileUserId && await redisCache.setIfAbsent(`codenix:profile-view:${viewerKey}:${profileUserId}`, "1", 900);
    if (shouldCountView) {
      await prisma.profileView.create({ data: { profileUserId, viewerId: viewerId ?? null } });
      await redisCache.invalidate(`codenix:profile:public:${profileUserId}`);
    }
    const key = `codenix:profile:public:${profileUserId}`;
    const cached = await redisCache.get<any>(key);
    if (cached) return cached;
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [views, weeklyViews, weeklyVotes] = await Promise.all([
      prisma.profileView.count({ where: { profileUserId } }),
      prisma.profileView.count({ where: { profileUserId, createdAt: { gte: weekStart } } }),
      prisma.commentVote.findMany({
        where: { createdAt: { gte: weekStart }, comment: { authorId: profileUserId } },
        select: { voteType: true },
      }),
    ]);
    const reputationChange = weeklyVotes.reduce((total, vote) => total + (vote.voteType === "up" ? 1 : -1), 0);
    const year = new Date().getFullYear();
    const [stats, progress, activity, recentSubmissions] = await Promise.all([
      usersService.getStats(profileUserId),
      usersService.getProgress(profileUserId),
      usersService.getActivity(profileUserId, { year }),
      submissionsService.listByUser(profileUserId, { page: 1, pageSize: 10, sort: "submitted-desc" }),
    ]);
    const profile = { ...user, reputation: user.reputation?.reputationScore ?? 0, solvedSubmissions: user._count.submissions, profileViews: views, reputationChange, profileViewsChange: weeklyViews, stats, progress, activityDays: activity.data, recentSubmissions: recentSubmissions.data };
    await redisCache.set(key, profile, profileCacheTtl);
    return profile;
  },
};
