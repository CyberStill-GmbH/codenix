import { prisma } from "../../db/prisma";
import { solvedProblemsService } from "../../shared/services/solved-problems.service";
const difficulties = ["easy", "medium", "hard"];
const DISTRIBUTION_BUCKET_SIZE = 5;
function roundPercentage(value) {
    return Math.round(value * 10) / 10;
}
function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}
function toDistributionBucket(solvedProblems) {
    if (solvedProblems === 0) {
        return "0";
    }
    const start = Math.floor((solvedProblems - 1) / DISTRIBUTION_BUCKET_SIZE) *
        DISTRIBUTION_BUCKET_SIZE +
        1;
    const end = start + DISTRIBUTION_BUCKET_SIZE - 1;
    return `${start}-${end}`;
}
function getBucketStart(bucket) {
    if (bucket === "0") {
        return 0;
    }
    return Number(bucket.split("-")[0]);
}
async function getRankingSummary(userId, solvedProblems) {
    const [activeUserIds, solvedCounts] = await Promise.all([
        solvedProblemsService.getActiveUserIds(),
        solvedProblemsService.getSolvedProblemCountsByUser()
    ]);
    const solvedByUser = new Map(solvedCounts.map((item) => [item.userId, item.solvedProblems]));
    const rankingUserIds = new Set(activeUserIds);
    rankingUserIds.add(userId);
    const rankingCounts = [...rankingUserIds].map((rankingUserId) => rankingUserId === userId
        ? solvedProblems
        : solvedByUser.get(rankingUserId) ?? 0);
    const totalUsers = rankingCounts.length;
    const rank = totalUsers === 0
        ? 1
        : rankingCounts.filter((count) => count > solvedProblems).length + 1;
    const percentile = totalUsers === 0
        ? 0
        : roundPercentage((rankingCounts.filter((count) => count <= solvedProblems).length /
            totalUsers) *
            100);
    const distributionByBucket = new Map();
    for (const count of rankingCounts) {
        const bucket = toDistributionBucket(count);
        distributionByBucket.set(bucket, (distributionByBucket.get(bucket) ?? 0) + 1);
    }
    const distribution = [...distributionByBucket.entries()]
        .sort(([bucketA], [bucketB]) => getBucketStart(bucketA) - getBucketStart(bucketB))
        .map(([bucket, count]) => ({
        bucket,
        count
    }));
    return {
        rank,
        percentile,
        totalUsers,
        distribution
    };
}
export const usersService = {
    async getStats(userId) {
        const [totalSubmissions, acceptedSubmissions, attemptedProblems, solvedProblems] = await Promise.all([
            prisma.submission.count({
                where: {
                    userId
                }
            }),
            prisma.submission.count({
                where: {
                    userId,
                    result: "accepted"
                }
            }),
            prisma.submission.findMany({
                where: {
                    userId
                },
                distinct: ["problemId"],
                select: {
                    problemId: true
                }
            }),
            solvedProblemsService.getSolvedProblemCount(userId)
        ]);
        const ranking = await getRankingSummary(userId, solvedProblems);
        const acceptanceRate = totalSubmissions === 0
            ? 0
            : roundPercentage((acceptedSubmissions / totalSubmissions) * 100);
        return {
            totalSubmissions,
            acceptedSubmissions,
            attemptedProblems: attemptedProblems.length,
            solvedProblems,
            acceptanceRate,
            currentStreak: 0,
            rank: ranking.rank,
            percentile: ranking.percentile,
            totalUsers: ranking.totalUsers,
            distribution: ranking.distribution
        };
    },
    async getProgress(userId) {
        const [publishedProblems, solvedRows] = await Promise.all([
            prisma.problem.findMany({
                where: {
                    status: "published"
                },
                select: {
                    id: true,
                    difficulty: true
                }
            }),
            prisma.submission.findMany({
                where: {
                    userId,
                    result: "accepted",
                    problem: {
                        is: {
                            status: "published"
                        }
                    }
                },
                distinct: ["problemId"],
                select: {
                    problemId: true
                }
            })
        ]);
        const solvedProblemIds = new Set(solvedRows.map((row) => row.problemId));
        const data = difficulties.map((difficulty) => {
            const total = publishedProblems.filter((problem) => problem.difficulty === difficulty).length;
            const solved = publishedProblems.filter((problem) => problem.difficulty === difficulty && solvedProblemIds.has(problem.id)).length;
            return {
                difficulty,
                solved,
                total
            };
        });
        const total = data.reduce((sum, item) => sum + item.total, 0);
        const solved = data.reduce((sum, item) => sum + item.solved, 0);
        return {
            data,
            totals: {
                solved,
                total
            }
        };
    },
    async getActivity(userId, query) {
        const startDate = new Date(Date.UTC(query.year, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(query.year + 1, 0, 1, 0, 0, 0));
        const submissions = await prisma.submission.findMany({
            where: {
                userId,
                submittedAt: {
                    gte: startDate,
                    lt: endDate
                }
            },
            select: {
                submittedAt: true,
                result: true
            },
            orderBy: {
                submittedAt: "asc"
            }
        });
        const activityByDate = new Map();
        for (const submission of submissions) {
            const date = toDateKey(submission.submittedAt);
            const current = activityByDate.get(date) ??
                {
                    date,
                    count: 0,
                    accepted: 0
                };
            current.count += 1;
            if (submission.result === "accepted") {
                current.accepted += 1;
            }
            activityByDate.set(date, current);
        }
        return {
            year: query.year,
            data: [...activityByDate.values()]
        };
    }
};
//# sourceMappingURL=users.service.js.map