export declare class RunsService {
    getRunById(runId: string, userId: string): Promise<{
        id: string;
        problemId: string;
        problemTitle: string;
        problemSlug: string;
        language: import("../../generated/prisma/enums").SupportedLanguage;
        status: import("../../generated/prisma/enums").CodeRunStatus;
        stdout: string | null;
        stderr: string | null;
        error: {
            message: string;
            stderr: string | undefined;
        } | undefined;
        executionTimeMs: number | null;
        memoryKb: number | null;
        createdAt: string;
        updatedAt: string;
        testcases: {
            id: string;
            index: number;
            testcaseId: string | null;
            input: string;
            expectedOutput: string | undefined;
            actualOutput: string | undefined;
            stdout: string | undefined;
            stderr: string | undefined;
            error: string | undefined;
            passed: boolean;
            executionTimeMs: number | undefined;
            memoryKb: number | undefined;
        }[];
        testcaseResults: {
            id: string;
            index: number;
            testcaseId: string | null;
            input: string;
            expectedOutput: string | undefined;
            actualOutput: string | undefined;
            stdout: string | undefined;
            stderr: string | undefined;
            error: string | undefined;
            passed: boolean;
            executionTimeMs: number | undefined;
            memoryKb: number | undefined;
        }[];
    }>;
}
export declare const runsService: RunsService;
//# sourceMappingURL=runs.service.d.ts.map