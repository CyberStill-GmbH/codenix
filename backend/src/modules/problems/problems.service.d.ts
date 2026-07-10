import type { ProblemsQueryInput, ProblemsSearchQueryInput, RunCodeRequestInput, CreateSubmissionRequestInput } from "./problems.schema";
export declare const problemService: {
    list(query: ProblemsQueryInput, userId?: string): Promise<{
        data: {
            id: string;
            numericId: number;
            title: string;
            slug: string;
            difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
            acceptance: number;
            solved: boolean;
            topics: string[];
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    search(query: ProblemsSearchQueryInput): Promise<{
        data: {
            id: string;
            numericId: number;
            title: string;
            slug: string;
            difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
            topics: string[];
        }[];
    }>;
    listTopics(): Promise<{
        data: {
            id: string;
            name: string;
            slug: string;
        }[];
    }>;
    findBySlug(slug: string, userId?: string): Promise<{
        id: string;
        numericId: number;
        title: string;
        slug: string;
        difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
        acceptance: number;
        solved: boolean;
        topics: string[];
        statement: string;
        inputFormat: string;
        outputFormat: string;
        constraints: string;
        examples: {
            id: string;
            input: string;
            output: string;
            explanation: string | null;
        }[];
        codeTemplates: {
            language: import("../../generated/prisma/enums").SupportedLanguage;
            starterCode: string;
        }[];
    }>;
    runCode(identifier: string, data: RunCodeRequestInput, userId: string): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").CodeRunStatus;
    }>;
    submitCode(identifier: string, data: CreateSubmissionRequestInput, userId: string): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").SubmissionResult;
        result: import("../../generated/prisma/enums").SubmissionResult;
        resultCode: import("../../generated/prisma/enums").SubmissionResult;
        submittedAt: string;
    }>;
};
//# sourceMappingURL=problems.service.d.ts.map