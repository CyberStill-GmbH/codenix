import { z } from "zod";
export declare const problemsQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<{
        easy: "easy";
        medium: "medium";
        hard: "hard";
    }>>;
    topic: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        "numeric-asc": "numeric-asc";
        "numeric-desc": "numeric-desc";
        "acceptance-desc": "acceptance-desc";
        "acceptance-asc": "acceptance-asc";
    }>>;
}, z.core.$strict>;
export declare const problemsSearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>;
export declare const problemSlugParamsSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strict>;
export type ProblemsQueryInput = z.infer<typeof problemsQuerySchema>;
export type ProblemsSearchQueryInput = z.infer<typeof problemsSearchQuerySchema>;
export type ProblemSlugParamsInput = z.infer<typeof problemSlugParamsSchema>;
export declare const problemIdentifierParamsSchema: z.ZodObject<{
    problemId: z.ZodString;
}, z.core.$strict>;
export declare const runCodeRequestSchema: z.ZodObject<{
    language: z.ZodEnum<{
        python: "python";
        c: "c";
        rust: "rust";
        typescript: "typescript";
        javascript: "javascript";
    }>;
    sourceCode: z.ZodString;
    testcases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        input: z.ZodString;
        expectedOutput: z.ZodString;
    }, z.core.$strict>>>;
    stdin: z.ZodOptional<z.ZodString>;
    testcaseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const createSubmissionRequestSchema: z.ZodObject<{
    language: z.ZodEnum<{
        python: "python";
        c: "c";
        rust: "rust";
        typescript: "typescript";
        javascript: "javascript";
    }>;
    sourceCode: z.ZodString;
}, z.core.$strict>;
export type ProblemIdentifierParamsInput = z.infer<typeof problemIdentifierParamsSchema>;
export type RunCodeRequestInput = z.infer<typeof runCodeRequestSchema>;
export type CreateSubmissionRequestInput = z.infer<typeof createSubmissionRequestSchema>;
//# sourceMappingURL=problems.schema.d.ts.map