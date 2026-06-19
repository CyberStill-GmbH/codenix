import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { solvedProblemsService } from "../../shared/services/solved-problems.service";
import {
  toProblemDetail,
  toProblemListItem,
  toProblemSearchItem,
  toProblemTopicItem
} from "./problems.mapper";
import type {
  ProblemsQueryInput,
  ProblemsSearchQueryInput
} from "./problems.schema";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildOrderBy(
  sort: ProblemsQueryInput["sort"]
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
    status: "published"
  };

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        slug: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }

  if (query.topic) {
    where.topics = {
      some: {
        topic: {
          slug: slugify(query.topic)
        }
      }
    };
  }

  return where;
}

function buildSearchWhere(
  query: ProblemsSearchQueryInput
): Prisma.ProblemWhereInput {
  return {
    status: "published",
    OR: [
      {
        title: {
          contains: query.q,
          mode: "insensitive"
        }
      },
      {
        slug: {
          contains: query.q,
          mode: "insensitive"
        }
      },
      {
        topics: {
          some: {
            topic: {
              name: {
                contains: query.q,
                mode: "insensitive"
              }
            }
          }
        }
      }
    ]
  };
}

export const problemService = {
  async list(query: ProblemsQueryInput, userId?: string) {
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
              topic: true
            }
          }
        }
      }),

      prisma.problem.count({
        where
      })
    ]);

    const solvedProblemIds = userId
      ? await solvedProblemsService.getSolvedProblemIds(
          userId,
          problems.map((problem) => problem.id)
        )
      : new Set<string>();

    return {
      data: problems.map((problem) =>
        toProblemListItem(problem, solvedProblemIds)
      ),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  },

  async search(query: ProblemsSearchQueryInput) {
    const problems = await prisma.problem.findMany({
      where: buildSearchWhere(query),
      orderBy: {
        numericId: "asc"
      },
      take: query.limit,
      include: {
        topics: {
          include: {
            topic: true
          }
        }
      }
    });

    return {
      data: problems.map(toProblemSearchItem)
    };
  },

  async listTopics() {
    const topics = await prisma.topic.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    return {
      data: topics.map(toProblemTopicItem)
    };
  },

  async findBySlug(slug: string, userId?: string) {
    const problem = await prisma.problem.findUnique({
      where: {
        slug
      },
      include: {
        topics: {
          include: {
            topic: true
          }
        },
        examples: true,
        codeTemplates: true
      }
    });

    if (!problem || problem.status !== "published") {
      throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    }

    const solvedProblemIds = userId
      ? await solvedProblemsService.getSolvedProblemIds(userId, [problem.id])
      : new Set<string>();

    return toProblemDetail(problem, solvedProblemIds);
  }
};
