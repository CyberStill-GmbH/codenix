import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { solvedProblemsService } from "../../shared/services/solved-problems.service";
import {
  toProblemDetail,
  toProblemListItem,
  toProblemSearchItem,
  toProblemTopicItem,
} from "./problems.mapper";
import type {
  ProblemsQueryInput,
  ProblemsSearchQueryInput,
  RunCodeRequestInput,
  CreateSubmissionRequestInput,
} from "./problems.schema";
import { judgeProducer } from "../judge/queue/producer";
import {
  validateSolutionSource,
  wrapSolutionSource,
} from "../judge/solution-wrapper";
import { redisCache } from "../../shared/cache/redis-cache";

type ProblemListResponse = {
  data: Array<ReturnType<typeof toProblemListItem>>;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

function cacheKey(scope: string, value: unknown) {
  return `codenix:${scope}:${JSON.stringify(value)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildOrderBy(
  sort: ProblemsQueryInput["sort"],
): Prisma.ProblemOrderByWithRelationInput {
  if (sort === "numeric-desc") {
    return { numericId: "desc" };
  }

  if (sort === "acceptance-desc") {
    return { acceptance: "desc" };
  }

  if (sort === "acceptance-asc") {
    return { acceptance: "asc" };
  }

  return { numericId: "asc" };
}

function buildWhere(query: ProblemsQueryInput): Prisma.ProblemWhereInput {
  const where: Prisma.ProblemWhereInput = {
    status: "published",
  };

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.topic) {
    where.topics = {
      some: {
        topic: {
          slug: slugify(query.topic),
        },
      },
    };
  }

  return where;
}

function buildSearchWhere(
  query: ProblemsSearchQueryInput,
): Prisma.ProblemWhereInput {
  return {
    status: "published",
    OR: [
      {
        title: {
          contains: query.q,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: query.q,
          mode: "insensitive",
        },
      },
      {
        topics: {
          some: {
            topic: {
              name: {
                contains: query.q,
                mode: "insensitive",
              },
            },
          },
        },
      },
    ],
  };
}

export const problemService = {
  async list(query: ProblemsQueryInput, userId?: string) {
    const key = cacheKey("problems:list", { query, userId: userId ?? "public" });
    const cached = await redisCache.get<ProblemListResponse>(key);
    if (cached) return cached;

    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);

    const [problems, total] = await prisma.$transaction([
      prisma.problem.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          topics: {
            include: {
              topic: true,
            },
          },
        },
      }),

      prisma.problem.count({
        where,
      }),
    ]);

    const solvedProblemIds = userId
      ? await solvedProblemsService.getSolvedProblemIds(
          userId,
          problems.map((problem) => problem.id),
        )
      : new Set<string>();

    const response: ProblemListResponse = {
      data: problems.map((problem) =>
        toProblemListItem(problem, solvedProblemIds),
      ),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    await redisCache.set(key, response, userId ? 8 : 60);
    return response;
  },

  async search(query: ProblemsSearchQueryInput) {
    const key = cacheKey("problems:search", query);
    const cached = await redisCache.get<{ data: Array<ReturnType<typeof toProblemSearchItem>> }>(key);
    if (cached) return cached;

    const problems = await prisma.problem.findMany({
      where: buildSearchWhere(query),
      orderBy: {
        numericId: "asc",
      },
      take: query.limit,
      include: {
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    const response = {
      data: problems.map(toProblemSearchItem),
    };

    await redisCache.set(key, response, 60);
    return response;
  },

  async listTopics() {
    const key = "codenix:problems:topics";
    const cached = await redisCache.get<{ data: Array<ReturnType<typeof toProblemTopicItem>> }>(key);
    if (cached) return cached;

    const topics = await prisma.topic.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const response = {
      data: topics.map(toProblemTopicItem),
    };

    await redisCache.set(key, response, 3_600);
    return response;
  },

  async findBySlug(slug: string, userId?: string) {
    const key = cacheKey("problems:detail", { slug, userId: userId ?? "public" });
    const cached = await redisCache.get<ReturnType<typeof toProblemDetail>>(key);
    if (cached) return cached;

    const problem = await prisma.problem.findUnique({
      where: {
        slug,
      },
      include: {
        topics: {
          include: {
            topic: true,
          },
        },
        examples: true,
        codeTemplates: true,
      },
    });

    if (!problem || problem.status !== "published") {
      throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    }

    const solvedProblemIds = userId
      ? await solvedProblemsService.getSolvedProblemIds(userId, [problem.id])
      : new Set<string>();

    const response = toProblemDetail(problem, solvedProblemIds);
    await redisCache.set(key, response, userId ? 10 : 60);
    return response;
  },

  async runCode(identifier: string, data: RunCodeRequestInput, userId: string) {
    const sourceError = validateSolutionSource(data.language, data.sourceCode);
    if (sourceError) {
      throw new AppError(422, "INVALID_SOLUTION_SHAPE", sourceError);
    }

    const problem = await prisma.problem.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        status: "published",
      },
      include: {
        codeTemplates: {
          select: { language: true },
        },
        parameters: true,
        testcases: {
          where: {
            visibility: "sample",
          },
        },
      },
    });

    if (!problem) {
      throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    }

    if (
      !problem.codeTemplates.some(
        (template) => template.language === data.language,
      )
    ) {
      throw new AppError(
        422,
        "UNSUPPORTED_LANGUAGE",
        "This language is not enabled for the selected problem.",
      );
    }

    const selectedTestcases = data.testcases?.length
      ? data.testcases.map((testcase) => ({
          input: testcase.input,
          expectedOutput: testcase.expectedOutput,
        }))
      : data.stdin !== undefined
        ? [{ input: data.stdin, expectedOutput: null }]
        : problem.testcases.map((testcase) => ({
            id: testcase.id,
            input: testcase.input,
            expectedOutput: testcase.expectedOutput,
          }));

    if (selectedTestcases.length === 0) {
      throw new AppError(
        422,
        "NO_TESTCASES",
        "This problem has no sample testcases.",
      );
    }

    const run = await prisma.codeRun.create({
      data: {
        userId,
        problemId: problem.id,
        language: data.language,
        sourceCode: data.sourceCode,
        status: "pending" as const,
      },
    });

    const judgeInput = {
      runId: run.id,
      problemId: problem.id,
      language: data.language,
      sourceCode: wrapSolutionSource(data.language, data.sourceCode, problem.parameters),
      testcases: selectedTestcases,
      timeLimitMs: problem.timeLimitMs,
      memoryLimitMb: problem.memoryLimitMb,
    };

    try {
      await judgeProducer.addJob(judgeInput);
    } catch {
      await prisma.codeRun.update({
        where: { id: run.id },
        data: { status: "internal_error", error: "Judge queue unavailable." },
      });
      throw new AppError(
        503,
        "JUDGE_UNAVAILABLE",
        "The judge is temporarily unavailable.",
      );
    }

    return {
      id: run.id,
      status: run.status,
    };
  },

  async submitCode(
    identifier: string,
    data: CreateSubmissionRequestInput,
    userId: string,
  ) {
    const sourceError = validateSolutionSource(data.language, data.sourceCode);
    if (sourceError) {
      throw new AppError(422, "INVALID_SOLUTION_SHAPE", sourceError);
    }

    const problem = await prisma.problem.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        status: "published",
      },
      include: {
        codeTemplates: {
          select: { language: true },
        },
        parameters: true,
        testcases: true,
      },
    });

    if (!problem) {
      throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    }

    if (
      !problem.codeTemplates.some(
        (template) => template.language === data.language,
      )
    ) {
      throw new AppError(
        422,
        "UNSUPPORTED_LANGUAGE",
        "This language is not enabled for the selected problem.",
      );
    }

    if (problem.testcases.length === 0) {
      throw new AppError(422, "NO_TESTCASES", "This problem has no testcases.");
    }

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId: problem.id,
        language: data.language,
        sourceCode: data.sourceCode,
        result: "pending" as const,
      },
    });

    const judgeInput = {
      submissionId: submission.id,
      problemId: problem.id,
      language: data.language,
      sourceCode: wrapSolutionSource(data.language, data.sourceCode, problem.parameters),
      testcases: problem.testcases.map((tc) => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
      timeLimitMs: problem.timeLimitMs,
      memoryLimitMb: problem.memoryLimitMb,
    };

    try {
      await judgeProducer.addJob(judgeInput);
    } catch {
      await prisma.submission.update({
        where: { id: submission.id },
        data: { result: "internal_error" },
      });
      throw new AppError(
        503,
        "JUDGE_UNAVAILABLE",
        "The judge is temporarily unavailable.",
      );
    }

    await redisCache.invalidate(`codenix:submissions:list:${userId}:`);

    return {
      id: submission.id,
      status: submission.result,
      result: submission.result,
      resultCode: submission.result,
      submittedAt: submission.submittedAt.toISOString(),
    };
  },
};
