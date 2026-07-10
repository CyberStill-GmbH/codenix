import type { AdminTestcaseBodyInput, AdminProblemBodyInput, AdminProblemsQueryInput } from "./admin-problems.schema";
export declare const adminProblemsService: {
    list(query: AdminProblemsQueryInput): Promise<{
        data: {
            id: string;
            title: string;
            slug: string;
            difficulty: import("../../../generated/prisma/enums").ProblemDifficulty;
            tags: string[];
            status: import("../../../generated/prisma/enums").ProblemStatus;
            testcasesCount: number;
            updatedAt: string;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByIdentifier(identifier: string): Promise<{
        id: string;
        title: string;
        slug: string;
        difficulty: import("../../../generated/prisma/enums").ProblemDifficulty;
        tags: string[];
        status: import("../../../generated/prisma/enums").ProblemStatus;
        testcasesCount: number;
        updatedAt: string;
        descriptionMarkdown: string;
        examples: {
            explanation?: string;
            id: string;
            input: string;
            output: string;
        }[];
        constraintsList: string[];
        parameters: import("@prisma/client/runtime/client").JsonArray;
        outputType: string;
        testcases: {
            id: string;
            input: unknown;
            expected_output: unknown;
            is_sample: boolean;
            weight: number;
            createdAt: string;
            updatedAt: string;
        }[];
        supportedLanguages: import("../../../generated/prisma/enums").SupportedLanguage[];
        starterCode: Record<string, string>;
        timeLimitMs: number;
        memoryLimitMb: number;
    }>;
    create(input: AdminProblemBodyInput): Promise<{
        id: string;
        title: string;
        slug: string;
        difficulty: import("../../../generated/prisma/enums").ProblemDifficulty;
        tags: string[];
        status: import("../../../generated/prisma/enums").ProblemStatus;
        testcasesCount: number;
        updatedAt: string;
        descriptionMarkdown: string;
        examples: {
            explanation?: string;
            id: string;
            input: string;
            output: string;
        }[];
        constraintsList: string[];
        parameters: import("@prisma/client/runtime/client").JsonArray;
        outputType: string;
        testcases: {
            id: string;
            input: unknown;
            expected_output: unknown;
            is_sample: boolean;
            weight: number;
            createdAt: string;
            updatedAt: string;
        }[];
        supportedLanguages: import("../../../generated/prisma/enums").SupportedLanguage[];
        starterCode: Record<string, string>;
        timeLimitMs: number;
        memoryLimitMb: number;
    }>;
    update(identifier: string, input: AdminProblemBodyInput): Promise<{
        id: string;
        title: string;
        slug: string;
        difficulty: import("../../../generated/prisma/enums").ProblemDifficulty;
        tags: string[];
        status: import("../../../generated/prisma/enums").ProblemStatus;
        testcasesCount: number;
        updatedAt: string;
        descriptionMarkdown: string;
        examples: {
            explanation?: string;
            id: string;
            input: string;
            output: string;
        }[];
        constraintsList: string[];
        parameters: import("@prisma/client/runtime/client").JsonArray;
        outputType: string;
        testcases: {
            id: string;
            input: unknown;
            expected_output: unknown;
            is_sample: boolean;
            weight: number;
            createdAt: string;
            updatedAt: string;
        }[];
        supportedLanguages: import("../../../generated/prisma/enums").SupportedLanguage[];
        starterCode: Record<string, string>;
        timeLimitMs: number;
        memoryLimitMb: number;
    }>;
    publish(identifier: string): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums").ProblemStatus;
        updatedAt: string;
    }>;
    unpublish(identifier: string): Promise<{
        id: string;
        status: import("../../../generated/prisma/enums").ProblemStatus;
        updatedAt: string;
    }>;
    listTestcases(identifier: string): Promise<{
        data: {
            id: string;
            problemId: string;
            input: string;
            expectedOutput: string;
            visibility: "sample" | "hidden";
            weight: number;
            createdAt: string;
            updatedAt: string;
        }[];
    }>;
    createTestcase(identifier: string, input: AdminTestcaseBodyInput): Promise<{
        id: string;
        problemId: string;
        input: string;
        expectedOutput: string;
        visibility: "sample" | "hidden";
        weight: number;
        createdAt: string;
        updatedAt: string;
    }>;
    updateTestcase(identifier: string, testcaseId: string, input: AdminTestcaseBodyInput): Promise<{
        id: string;
        problemId: string;
        input: string;
        expectedOutput: string;
        visibility: "sample" | "hidden";
        weight: number;
        createdAt: string;
        updatedAt: string;
    }>;
    deleteTestcase(identifier: string, testcaseId: string): Promise<void>;
};
//# sourceMappingURL=admin-problems.service.d.ts.map