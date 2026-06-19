import { prisma } from "../../db/prisma";

const ACCEPTED_SUBMISSION_RESULT = "accepted" as const;

export type SolvedProblemCount = {
  userId: string;
  solvedProblems: number;
};

export const solvedProblemsService = {
  async getSolvedProblemIds(userId: string, problemIds?: string[]) {
    if (problemIds && problemIds.length === 0) {
      return new Set<string>();
    }

    const rows = await prisma.submission.findMany({
      where: {
        userId,
        result: ACCEPTED_SUBMISSION_RESULT,
        ...(problemIds
          ? {
              problemId: {
                in: problemIds
              }
            }
          : {})
      },
      distinct: ["problemId"],
      select: {
        problemId: true
      }
    });

    return new Set(rows.map((row) => row.problemId));
  },

  async getSolvedProblemCount(userId: string) {
    const solvedProblemIds = await this.getSolvedProblemIds(userId);

    return solvedProblemIds.size;
  },

  async getSolvedProblemCountsByUser(): Promise<SolvedProblemCount[]> {
    const rows = await prisma.submission.groupBy({
      by: ["userId", "problemId"],
      where: {
        result: ACCEPTED_SUBMISSION_RESULT
      }
    });

    const countsByUser = new Map<string, number>();

    for (const row of rows) {
      countsByUser.set(row.userId, (countsByUser.get(row.userId) ?? 0) + 1);
    }

    return [...countsByUser.entries()].map(([userId, solvedProblems]) => ({
      userId,
      solvedProblems
    }));
  },

  async getActiveUserIds() {
    const rows = await prisma.submission.groupBy({
      by: ["userId"]
    });

    return rows.map((row) => row.userId);
  }
};
