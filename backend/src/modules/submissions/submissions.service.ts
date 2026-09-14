import type { Prisma, SupportedLanguage } from "../../generated/prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import {
  toSubmissionDetail,
  toSubmissionListItem
} from "./submissions.mapper";
import type { SubmissionsQueryInput } from "./submissions.schema";
import { redisCache } from "../../shared/cache/redis-cache";

function cacheKey(userId: string, query: SubmissionsQueryInput) {
  return `codenix:submissions:list:${userId}:${JSON.stringify(query)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildWhere(
  userId: string,
  query: SubmissionsQueryInput
): Prisma.SubmissionWhereInput {
  const where: Prisma.SubmissionWhereInput = {
    userId
  };

  if (query.problemId) {
    where.problemId = query.problemId;
  }

  if (query.result) {
    where.result = query.result;
  }

  const problemWhere: Prisma.ProblemWhereInput = {};

  if (query.difficulty) {
    problemWhere.difficulty = query.difficulty;
  }

  if (query.topic) {
    problemWhere.topics = {
      some: {
        topic: {
          slug: slugify(query.topic)
        }
      }
    };
  }

  if (query.difficulty || query.topic) {
    where.problem = {
      is: problemWhere
    };
  }

  return where;
}

function buildOrderBy(
  sort: SubmissionsQueryInput["sort"]
): Prisma.SubmissionOrderByWithRelationInput {
  if (sort === "submitted-asc") {
    return {
      submittedAt: "asc"
    };
  }

  return {
    submittedAt: "desc"
  };
}

function percentileBeats(values: number[], current: number | null | undefined) {
  if (current == null || values.length === 0) return undefined;
  const slower = values.filter((value) => value > current).length;
  return Math.round((slower / values.length) * 1000) / 10;
}

function buildDistribution(values: number[], current: number | null | undefined) {
  if (values.length === 0) return undefined;

  const unique = [...new Set(values)].sort((a, b) => a - b);
  if (unique.length <= 12) {
    return unique.map((value) => ({
      value,
      submissions: values.filter((item) => item === value).length,
    }));
  }

  const min = unique[0]!;
  const max = unique.at(-1)!;
  const width = Math.max(1, (max - min) / 10);
  const buckets = Array.from({ length: 10 }, (_, index) => ({
    value: Math.round(min + width * index),
    submissions: 0,
  }));

  for (const value of values) {
    const index = Math.min(9, Math.floor((value - min) / width));
    buckets[index]!.submissions += 1;
  }

  if (current != null && !buckets.some((bucket) => bucket.value === current)) {
    const index = Math.min(9, Math.floor((current - min) / width));
    buckets[index]!.value = current;
  }

  return buckets.filter((bucket) => bucket.submissions > 0);
}

async function getSubmissionPerformance(submission: {
  problemId: string;
  language: SupportedLanguage;
  executionTimeMs: number | null;
  memoryKb: number | null;
}) {
  const performanceKey = `codenix:submissions:performance:${submission.problemId}:${submission.language}`;
  const cached = await redisCache.get<{
    runtimes: number[];
    memories: number[];
  }>(performanceKey);

  if (cached) {
    return {
      runtimePercentile: percentileBeats(cached.runtimes, submission.executionTimeMs),
      memoryPercentile: percentileBeats(cached.memories, submission.memoryKb),
      runtimeDistribution: buildDistribution(cached.runtimes, submission.executionTimeMs),
      memoryDistribution: buildDistribution(cached.memories, submission.memoryKb),
    };
  }

  const comparable = await prisma.submission.findMany({
    where: {
      problemId: submission.problemId,
      language: submission.language,
      result: "accepted",
    },
    select: { executionTimeMs: true, memoryKb: true },
    orderBy: { submittedAt: "asc" },
  });

  const runtimes = comparable.flatMap((item) =>
    item.executionTimeMs == null ? [] : [item.executionTimeMs],
  );
  const memories = comparable.flatMap((item) =>
    item.memoryKb == null ? [] : [item.memoryKb],
  );

  await redisCache.set(performanceKey, { runtimes, memories }, 15);

  return {
    runtimePercentile: percentileBeats(runtimes, submission.executionTimeMs),
    memoryPercentile: percentileBeats(memories, submission.memoryKb),
    runtimeDistribution: buildDistribution(runtimes, submission.executionTimeMs),
    memoryDistribution: buildDistribution(memories, submission.memoryKb),
  };
}

export const submissionsService = {
  async listByUser(userId: string, query: SubmissionsQueryInput) {
    const key = cacheKey(userId, query);
    const cached = await redisCache.get<{
      data: Array<ReturnType<typeof toSubmissionListItem>>;
      meta: { page: number; pageSize: number; total: number; totalPages: number };
    }>(key);
    if (cached) return cached;

    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const where = buildWhere(userId, query);
    const orderBy = buildOrderBy(query.sort);

    const [submissions, total] = await prisma.$transaction([
      prisma.submission.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          problem: {
            include: {
              topics: {
                include: {
                  topic: true
                }
              }
            }
          }
        }
      }),

      prisma.submission.count({
        where
      })
    ]);

    const response = {
      data: submissions.map(toSubmissionListItem),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };

    await redisCache.set(key, response, 8);
    return response;
  },

  async findByIdForUser(userId: string, submissionId: string) {
    const key = `codenix:submissions:detail:${userId}:${submissionId}`;
    const cached = await redisCache.get<ReturnType<typeof toSubmissionDetail>>(key);
    if (cached) return cached;

    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId
      },
      include: {
        problem: {
          include: {
            topics: {
              include: {
                topic: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      throw new AppError(404, "SUBMISSION_NOT_FOUND", "Submission not found.");
    }

    const testcaseResults = await prisma.submissionTestcaseResult.findMany({
      where: {
        submissionId: submission.id
      },
      orderBy: {
        testcase: {
          orderIndex: "asc"
        }
      },
      include: {
        testcase: true
      }
    });

    const performance = submission.result === "accepted"
      ? await getSubmissionPerformance(submission)
      : {};
    const response = toSubmissionDetail(submission, testcaseResults, performance);
    await redisCache.set(key, response, 15);
    return response;
  }
};
