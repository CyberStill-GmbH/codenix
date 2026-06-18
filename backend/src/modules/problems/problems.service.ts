import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { 
  toProblemDetail, 
  toProblemListItem,
  toProblemTopicItem 
} from "./problems.mapper";
import type { ProblemsQueryInput } from "./problems.schema";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildOrderBy(sort: ProblemsQueryInput["sort"]): Prisma.ProblemOrderByWithRelationInput {
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

export const problemService = {
  async list(query: ProblemsQueryInput) {
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

    return {
      data: problems.map(toProblemListItem),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
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

  async findBySlug(slug: string) {
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

    return toProblemDetail(problem);
  }
};