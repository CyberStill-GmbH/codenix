import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { isSupportedJudgeLanguage, SUPPORTED_JUDGE_LANGUAGES } from "../src/modules/judge/supported-languages";
import { PROBLEM_CATALOG } from "./problem-catalog";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}
const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString })
});
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
async function upsertTopics(names) {
    return Promise.all(names.map((name) => prisma.topic.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) }
    })));
}
async function clearProblemContent(problemId) {
    const testcaseIds = (await prisma.testcase.findMany({
        where: { problemId },
        select: { id: true }
    })).map((testcase) => testcase.id);
    if (testcaseIds.length > 0) {
        await prisma.submissionTestcaseResult.deleteMany({
            where: { testcaseId: { in: testcaseIds } }
        });
        await prisma.codeRunTestcaseResult.deleteMany({
            where: { testcaseId: { in: testcaseIds } }
        });
    }
    await prisma.$transaction([
        prisma.testcase.deleteMany({ where: { problemId } }),
        prisma.problemExample.deleteMany({ where: { problemId } }),
        prisma.problemCodeTemplate.deleteMany({ where: { problemId } }),
        prisma.problemTopic.deleteMany({ where: { problemId } })
    ]);
}
async function seedProblem(seed) {
    const existingByNumber = await prisma.problem.findUnique({
        where: { numericId: seed.numericId }
    });
    if (existingByNumber && existingByNumber.slug !== seed.slug) {
        await prisma.problem.update({
            where: { id: existingByNumber.id },
            data: { numericId: -seed.numericId }
        });
    }
    const problem = await prisma.problem.upsert({
        where: { slug: seed.slug },
        update: {
            numericId: seed.numericId,
            title: seed.title,
            difficulty: seed.difficulty,
            status: "draft",
            statement: seed.statement,
            inputFormat: seed.inputFormat,
            outputFormat: seed.outputFormat,
            constraints: seed.constraints,
            parameters: seed.parameters,
            outputType: seed.outputType,
            timeLimitMs: 3000,
            memoryLimitMb: 256
        },
        create: {
            numericId: seed.numericId,
            title: seed.title,
            slug: seed.slug,
            difficulty: seed.difficulty,
            status: "draft",
            statement: seed.statement,
            inputFormat: seed.inputFormat,
            outputFormat: seed.outputFormat,
            constraints: seed.constraints,
            parameters: seed.parameters,
            outputType: seed.outputType,
            timeLimitMs: 3000,
            memoryLimitMb: 256
        }
    });
    await clearProblemContent(problem.id);
    const topics = await upsertTopics(seed.topics);
    await prisma.$transaction([
        prisma.problemExample.createMany({
            data: seed.examples.map((example, index) => ({
                problemId: problem.id,
                ...example,
                orderIndex: index + 1
            }))
        }),
        prisma.problemCodeTemplate.createMany({
            data: SUPPORTED_JUDGE_LANGUAGES.map((language) => ({
                problemId: problem.id,
                language,
                starterCode: seed.starterCode[language]
            }))
        }),
        prisma.problemTopic.createMany({
            data: topics.map((topic) => ({
                problemId: problem.id,
                topicId: topic.id
            }))
        }),
        prisma.testcase.createMany({
            data: seed.testcases.map((testcase, index) => ({
                problemId: problem.id,
                input: testcase.input,
                expectedOutput: testcase.expectedOutput,
                visibility: testcase.visibility,
                weight: 1,
                orderIndex: index + 1
            }))
        })
    ]);
    await prisma.problem.update({
        where: { id: problem.id },
        data: { status: "published" }
    });
}
async function unpublishInvalidLegacyProblems() {
    const publishedProblems = await prisma.problem.findMany({
        where: { status: "published" },
        include: { testcases: true, codeTemplates: true }
    });
    const invalidIds = publishedProblems
        .filter((problem) => {
        const hasSample = problem.testcases.some((testcase) => testcase.visibility === "sample");
        const validTemplates = problem.codeTemplates.length > 0 &&
            problem.codeTemplates.every((template) => isSupportedJudgeLanguage(template.language) &&
                Boolean(template.starterCode.trim()));
        return !hasSample || problem.testcases.length === 0 || !validTemplates;
    })
        .map((problem) => problem.id);
    if (invalidIds.length > 0) {
        await prisma.problem.updateMany({
            where: { id: { in: invalidIds } },
            data: { status: "draft" }
        });
    }
    return invalidIds.length;
}
async function main() {
    for (const problem of PROBLEM_CATALOG) {
        await seedProblem(problem);
    }
    const unpublishedCount = await unpublishInvalidLegacyProblems();
    console.log(`Seeded ${PROBLEM_CATALOG.length} complete problems; unpublished ${unpublishedCount} invalid legacy problems.`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-problems.js.map