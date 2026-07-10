export class MockJudgeService {
    async run(input) {
        const { sourceCode, testcases } = input;
        if (sourceCode.includes("__CE_FAIL_COMPILE__")) {
            return {
                status: "compilation_error",
                error: "Compilation failed simulated",
                testcaseResults: testcases.map((tc) => ({
                    testcaseId: tc.id,
                    passed: false,
                    error: "Compilation failed",
                })),
            };
        }
        if (sourceCode.includes("__CE_RUNTIME_ERROR__")) {
            return {
                status: "runtime_error",
                error: "Runtime error simulated",
                testcaseResults: testcases.map((tc) => ({
                    testcaseId: tc.id,
                    passed: false,
                    error: "Runtime error simulated",
                })),
            };
        }
        if (sourceCode.includes("__CE_TLE__")) {
            return {
                status: "time_limit_exceeded",
                error: "Time limit exceeded simulated",
                testcaseResults: testcases.map((tc) => ({
                    testcaseId: tc.id,
                    passed: false,
                    error: "Time limit exceeded simulated",
                })),
            };
        }
        if (sourceCode.includes("__CE_WA__")) {
            return {
                status: "wrong_answer",
                testcaseResults: testcases.map((tc, index) => ({
                    testcaseId: tc.id,
                    passed: index === 0,
                    actualOutput: index === 0 ? tc.expectedOutput : "wrong output",
                })),
            };
        }
        // Default to accepted
        return {
            status: "accepted",
            executionTimeMs: 15,
            memoryKb: 1024,
            testcaseResults: testcases.map((tc) => ({
                testcaseId: tc.id,
                passed: true,
                actualOutput: tc.expectedOutput,
                executionTimeMs: 15,
                memoryKb: 1024,
            })),
        };
    }
}
export const judgeService = new MockJudgeService();
//# sourceMappingURL=judge.service.js.map