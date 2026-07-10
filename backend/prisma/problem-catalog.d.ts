import type { SupportedJudgeLanguage } from "../src/modules/judge/supported-languages";
type ProblemExampleSeed = {
    input: string;
    output: string;
    explanation: string;
};
type ProblemTestcaseSeed = {
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
};
export type ProblemSeed = {
    numericId: number;
    title: string;
    slug: "two-sum" | "valid-parentheses";
    difficulty: "easy";
    statement: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string;
    parameters: Array<{
        name: string;
        type: string;
        description: string;
    }>;
    outputType: string;
    topics: string[];
    examples: ProblemExampleSeed[];
    testcases: ProblemTestcaseSeed[];
    starterCode: Record<SupportedJudgeLanguage, string>;
};
export declare const PROBLEM_CATALOG: ProblemSeed[];
export {};
//# sourceMappingURL=problem-catalog.d.ts.map