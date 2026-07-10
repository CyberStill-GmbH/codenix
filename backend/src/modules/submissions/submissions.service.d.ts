import type { SubmissionsQueryInput } from "./submissions.schema";
export declare const submissionsService: {
    listByUser(userId: string, query: SubmissionsQueryInput): Promise<{
        data: {
            id: string;
            problemId: string;
            problemTitle: string;
            problemSlug: string;
            difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
            result: string;
            language: import("../../generated/prisma/enums").SupportedLanguage;
            submittedAt: string;
            executionTimeMs: number | null;
            memoryKb: number | null;
            submissionsCount: number;
            acceptance: number;
            topics: string[];
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByIdForUser(userId: string, submissionId: string): Promise<{
        id: string;
        problemId: string;
        problemTitle: string;
        problemSlug: string;
        difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
        topics: string[];
        result: string;
        resultCode: import("../../generated/prisma/enums").SubmissionResult;
        status: import("../../generated/prisma/enums").SubmissionResult;
        language: import("../../generated/prisma/enums").SupportedLanguage;
        submittedAt: string;
        sourceCode: string;
        stdout: string | null;
        stderr: string | null;
        error: {
            message: string;
        } | null;
        stackTrace: string | null;
        executionTimeMs: number | null;
        memoryKb: number | null;
        passedCases: number;
        totalCases: number;
        failedCase: {
            id: string;
            index: number;
            testcaseId: string;
            visibility: import("../../generated/prisma/enums").TestcaseVisibility;
            input: string | null;
            expectedOutput: string | null;
            actualOutput: string | null;
            error: string | null;
            passed: boolean;
            executionTimeMs: number | null;
            memoryKb: number | null;
        } | undefined;
        testcaseResults: {
            id: string;
            index: number;
            testcaseId: string;
            visibility: import("../../generated/prisma/enums").TestcaseVisibility;
            input: string | null;
            expectedOutput: string | null;
            actualOutput: string | null;
            error: string | null;
            passed: boolean;
            executionTimeMs: number | null;
            memoryKb: number | null;
        }[];
    }>;
};
//# sourceMappingURL=submissions.service.d.ts.map