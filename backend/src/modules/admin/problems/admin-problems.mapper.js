const allowedOutputTypes = new Set([
    "number",
    "number[]",
    "string",
    "string[]",
    "boolean",
    "object"
]);
function mapTags(problem) {
    return problem.topics.map((item) => item.topic.name);
}
function splitConstraints(constraints) {
    return constraints
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}
function parseJsonOrRaw(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return {
            raw: value
        };
    }
}
function normalizeParameters(value) {
    return Array.isArray(value) ? value : [];
}
function normalizeOutputType(value) {
    return allowedOutputTypes.has(value) ? value : "object";
}
function buildStarterCode(problem) {
    const starterCode = {};
    for (const template of problem.codeTemplates) {
        starterCode[template.language] = template.starterCode;
    }
    return starterCode;
}
export function toAdminProblemListItem(problem) {
    return {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: mapTags(problem),
        status: problem.status,
        testcasesCount: problem._count.testcases,
        updatedAt: problem.updatedAt.toISOString()
    };
}
export function toAdminProblemDetails(problem) {
    const supportedLanguages = problem.codeTemplates.map((template) => template.language);
    return {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: mapTags(problem),
        status: problem.status,
        testcasesCount: problem._count.testcases,
        updatedAt: problem.updatedAt.toISOString(),
        descriptionMarkdown: problem.statement,
        examples: problem.examples.map((example) => ({
            id: example.id,
            input: example.input,
            output: example.output,
            ...(example.explanation ? { explanation: example.explanation } : {})
        })),
        constraintsList: splitConstraints(problem.constraints),
        parameters: normalizeParameters(problem.parameters),
        outputType: normalizeOutputType(problem.outputType),
        testcases: problem.testcases.map((testcase) => ({
            id: testcase.id,
            input: parseJsonOrRaw(testcase.input),
            expected_output: parseJsonOrRaw(testcase.expectedOutput),
            is_sample: testcase.visibility === "sample",
            weight: testcase.weight,
            createdAt: testcase.createdAt.toISOString(),
            updatedAt: testcase.updatedAt.toISOString()
        })),
        supportedLanguages,
        starterCode: buildStarterCode(problem),
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb
    };
}
export function toAdminLegacyTestcaseItem(testcase) {
    return {
        id: testcase.id,
        problemId: testcase.problemId,
        input: testcase.input,
        expectedOutput: testcase.expectedOutput,
        visibility: testcase.visibility,
        weight: testcase.weight,
        createdAt: testcase.createdAt.toISOString(),
        updatedAt: testcase.updatedAt.toISOString()
    };
}
//# sourceMappingURL=admin-problems.mapper.js.map