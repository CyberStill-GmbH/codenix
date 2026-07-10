import { prisma } from "../../db/prisma";
import { AppError } from "../../shared/errors/app-error";
import { solvedProblemsService } from "../../shared/services/solved-problems.service";
import { toProblemDetail, toProblemListItem, toProblemSearchItem, toProblemTopicItem } from "./problems.mapper";
import { judgeProducer } from "../judge/queue/producer";
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
function buildOrderBy(sort) {
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
function buildWhere(query) {
    const where = {
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
function buildSearchWhere(query) {
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
    async list(query, userId) {
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
            ? await solvedProblemsService.getSolvedProblemIds(userId, problems.map((problem) => problem.id))
            : new Set();
        return {
            data: problems.map((problem) => toProblemListItem(problem, solvedProblemIds)),
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    },
    async search(query) {
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
    async findBySlug(slug, userId) {
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
            : new Set();
        return toProblemDetail(problem, solvedProblemIds);
    },
    async runCode(identifier, data, userId) {
        const problem = await prisma.problem.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { slug: identifier }
                ],
                status: "published"
            },
            include: {
                codeTemplates: {
                    select: { language: true }
                },
                testcases: {
                    where: data.testcaseIds && data.testcaseIds.length > 0
                        ? { id: { in: data.testcaseIds } }
                        : { visibility: "sample" }
                }
            }
        });
        if (!problem) {
            throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
        }
        if (!problem.codeTemplates.some((template) => template.language === data.language)) {
            throw new AppError(422, "UNSUPPORTED_LANGUAGE", "This language is not enabled for the selected problem.");
        }
        const selectedTestcases = data.testcases?.length
            ? data.testcases.map((testcase) => ({
                input: testcase.input,
                expectedOutput: testcase.expectedOutput
            }))
            : data.stdin !== undefined
                ? [{ input: data.stdin, expectedOutput: null }]
                : problem.testcases.map((testcase) => ({
                    id: testcase.id,
                    input: testcase.input,
                    expectedOutput: testcase.expectedOutput
                }));
        if (selectedTestcases.length === 0) {
            throw new AppError(422, "NO_TESTCASES", "This problem has no sample testcases.");
        }
        const run = await prisma.codeRun.create({
            data: {
                userId,
                problemId: problem.id,
                language: data.language,
                sourceCode: data.sourceCode,
                status: "pending",
            }
        });
        const judgeInput = {
            runId: run.id,
            problemId: problem.id,
            language: data.language,
            sourceCode: data.sourceCode,
            testcases: selectedTestcases,
            timeLimitMs: problem.timeLimitMs,
            memoryLimitMb: problem.memoryLimitMb
        };
        try {
            await judgeProducer.addJob(judgeInput);
        }
        catch {
            await prisma.codeRun.update({
                where: { id: run.id },
                data: { status: "internal_error", error: "Judge queue unavailable." }
            });
            throw new AppError(503, "JUDGE_UNAVAILABLE", "The judge is temporarily unavailable.");
        }
        return {
            id: run.id,
            status: run.status
        };
    },
    async submitCode(identifier, data, userId) {
        const problem = await prisma.problem.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { slug: identifier }
                ],
                status: "published"
            },
            include: {
                codeTemplates: {
                    select: { language: true }
                },
                testcases: true
            }
        });
        if (!problem) {
            throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
        }
        if (!problem.codeTemplates.some((template) => template.language === data.language)) {
            throw new AppError(422, "UNSUPPORTED_LANGUAGE", "This language is not enabled for the selected problem.");
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
                result: "pending",
            }
        });
        const judgeInput = {
            submissionId: submission.id,
            problemId: problem.id,
            language: data.language,
            sourceCode: data.sourceCode,
            testcases: problem.testcases.map(tc => ({
                id: tc.id,
                input: tc.input,
                expectedOutput: tc.expectedOutput
            })),
            timeLimitMs: problem.timeLimitMs,
            memoryLimitMb: problem.memoryLimitMb
        };
        try {
            await judgeProducer.addJob(judgeInput);
        }
        catch {
            await prisma.submission.update({
                where: { id: submission.id },
                data: { result: "internal_error" }
            });
            throw new AppError(503, "JUDGE_UNAVAILABLE", "The judge is temporarily unavailable.");
        }
        return {
            id: submission.id,
            status: submission.result,
            result: submission.result,
            resultCode: submission.result,
            submittedAt: submission.submittedAt.toISOString()
        };
    }
};
//# sourceMappingURL=problems.service.js.map