import { prisma } from "../../db/prisma";
const ACCEPTED_SUBMISSION_RESULT = "accepted";
export const solvedProblemsService = {
    async getSolvedProblemIds(userId, problemIds) {
        if (problemIds && problemIds.length === 0) {
            return new Set();
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
    async getSolvedProblemCount(userId) {
        const solvedProblemIds = await this.getSolvedProblemIds(userId);
        return solvedProblemIds.size;
    },
    async getSolvedProblemCountsByUser() {
        const rows = await prisma.submission.groupBy({
            by: ["userId", "problemId"],
            where: {
                result: ACCEPTED_SUBMISSION_RESULT
            }
        });
        const countsByUser = new Map();
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
//# sourceMappingURL=solved-problems.service.js.map