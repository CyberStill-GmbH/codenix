import type { Prisma, SubmissionResult, SubmissionTestcaseResult, Testcase } from "../../generated/prisma/client";
type SubmissionListItemModel = Prisma.SubmissionGetPayload<{
    include: {
        problem: {
            include: {
                topics: {
                    include: {
                        topic: true;
                    };
                };
            };
        };
    };
}>;
type SubmissionDetailModel = Prisma.SubmissionGetPayload<{
    include: {
        problem: {
            include: {
                topics: {
                    include: {
                        topic: true;
                    };
                };
            };
        };
    };
}>;
type TestcaseResultWithTestcase = SubmissionTestcaseResult & {
    testcase: Testcase;
};
export declare function toSubmissionListItem(submission: SubmissionListItemModel): {
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
};
export declare function toSubmissionDetail(submission: SubmissionDetailModel, testcaseResults: TestcaseResultWithTestcase[]): {
    id: string;
    problemId: string;
    problemTitle: string;
    problemSlug: string;
    difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
    topics: string[];
    result: string;
    resultCode: SubmissionResult;
    status: SubmissionResult;
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
};
export {};
//# sourceMappingURL=submissions.mapper.d.ts.map