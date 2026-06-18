import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../db/prisma";
import { toSubmissionListItem } from "./submissions.mapper";
import type { SubmissionsQueryInput } from "./submissions.schema";

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

export const submissionsService = {
  async listByUser(userId: string, query: SubmissionsQueryInput) {
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

    return {
      data: submissions.map(toSubmissionListItem),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
};