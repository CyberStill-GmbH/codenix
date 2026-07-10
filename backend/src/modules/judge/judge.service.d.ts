import type { SupportedLanguage } from "../../generated/prisma/client";
export interface JudgeRunInput {
    language: SupportedLanguage;
    sourceCode: string;
    testcases: Array<{
        id: string;
        input: string;
        expectedOutput: string;
    }>;
    timeLimitMs: number;
    memoryLimitMb: number;
}
export type JudgeStatus = "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "compilation_error" | "internal_error";
export interface JudgeTestcaseResult {
    testcaseId: string;
    passed: boolean;
    actualOutput?: string;
    error?: string;
    executionTimeMs?: number;
    memoryKb?: number;
}
export interface JudgeRunResult {
    status: JudgeStatus;
    stdout?: string;
    stderr?: string;
    error?: string;
    executionTimeMs?: number;
    memoryKb?: number;
    testcaseResults: JudgeTestcaseResult[];
}
export interface JudgeService {
    run(input: JudgeRunInput): Promise<JudgeRunResult>;
}
export declare class MockJudgeService implements JudgeService {
    run(input: JudgeRunInput): Promise<JudgeRunResult>;
}
export declare const judgeService: MockJudgeService;
//# sourceMappingURL=judge.service.d.ts.map