import type { Prisma } from "../../../generated/prisma/client";
type AdminProblemListModel = Prisma.ProblemGetPayload<{
    include: {
        topics: {
            include: {
                topic: true;
            };
        };
        _count: {
            select: {
                testcases: true;
            };
        };
    };
}>;
type AdminProblemDetailModel = Prisma.ProblemGetPayload<{
    include: {
        topics: {
            include: {
                topic: true;
            };
        };
        examples: true;
        codeTemplates: true;
        testcases: true;
        _count: {
            select: {
                testcases: true;
            };
        };
    };
}>;
export declare function toAdminProblemListItem(problem: AdminProblemListModel): {
    id: string;
    title: string;
    slug: string;
    difficulty: import("../../../generated/prisma/enums").ProblemDifficulty;
    tags: string[];
    status: import("../../../generated/prisma/enums").ProblemStatus;
    testcasesCount: number;
    updatedAt: string;
};
export declare function toAdminProblemDetails(problem: AdminProblemDetailModel): {
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
};
export declare function toAdminLegacyTestcaseItem(testcase: {
    id: string;
    problemId: string;
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}): {
    id: string;
    problemId: string;
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    weight: number;
    createdAt: string;
    updatedAt: string;
};
export {};
//# sourceMappingURL=admin-problems.mapper.d.ts.map