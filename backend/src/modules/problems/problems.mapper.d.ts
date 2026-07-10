import type { Prisma } from "../../generated/prisma/client";
type ProblemListItemModel = Prisma.ProblemGetPayload<{
    include: {
        topics: {
            include: {
                topic: true;
            };
        };
    };
}>;
type ProblemDetailModel = Prisma.ProblemGetPayload<{
    include: {
        topics: {
            include: {
                topic: true;
            };
        };
        examples: true;
        codeTemplates: true;
    };
}>;
export declare function toProblemListItem(problem: ProblemListItemModel, solvedProblemIds?: Set<string>): {
    id: string;
    numericId: number;
    title: string;
    slug: string;
    difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
    acceptance: number;
    solved: boolean;
    topics: string[];
};
export declare function toProblemSearchItem(problem: ProblemListItemModel): {
    id: string;
    numericId: number;
    title: string;
    slug: string;
    difficulty: import("../../generated/prisma/enums").ProblemDifficulty;
    topics: string[];
};
export declare function toProblemDetail(problem: ProblemDetailModel, solvedProblemIds?: Set<string>): {
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
};
export declare function toProblemTopicItem(topic: {
    id: string;
    name: string;
    slug: string;
}): {
    id: string;
    name: string;
    slug: string;
};
export {};
//# sourceMappingURL=problems.mapper.d.ts.map