function mapTopics(problem) {
    return problem.topics.map((item) => item.topic.name);
}
export function toProblemListItem(problem, solvedProblemIds = new Set()) {
    return {
        id: problem.id,
        numericId: problem.numericId,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        acceptance: problem.acceptance,
        solved: solvedProblemIds.has(problem.id),
        topics: mapTopics(problem)
    };
}
export function toProblemSearchItem(problem) {
    return {
        id: problem.id,
        numericId: problem.numericId,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        topics: mapTopics(problem)
    };
}
export function toProblemDetail(problem, solvedProblemIds = new Set()) {
    return {
        id: problem.id,
        numericId: problem.numericId,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        acceptance: problem.acceptance,
        solved: solvedProblemIds.has(problem.id),
        topics: mapTopics(problem),
        statement: problem.statement,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        examples: problem.examples.map((example) => ({
            id: example.id,
            input: example.input,
            output: example.output,
            explanation: example.explanation
        })),
        codeTemplates: problem.codeTemplates.map((template) => ({
            language: template.language,
            starterCode: template.starterCode
        }))
    };
}
export function toProblemTopicItem(topic) {
    return {
        id: topic.id,
        name: topic.name,
        slug: topic.slug
    };
}
//# sourceMappingURL=problems.mapper.js.map