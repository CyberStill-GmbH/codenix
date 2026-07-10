import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { toSubmissionDetail, toSubmissionListItem } from "./submissions.mapper";
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function buildWhere(userId, query) {
    const where = {
        userId
    };
    if (query.problemId) {
        where.problemId = query.problemId;
    }
    if (query.result) {
        where.result = query.result;
    }
    const problemWhere = {};
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
function buildOrderBy(sort) {
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
    async listByUser(userId, query) {
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
    },
    async findByIdForUser(userId, submissionId) {
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
        return toSubmissionDetail(submission, testcaseResults);
    }
};
//# sourceMappingURL=submissions.service.js.map