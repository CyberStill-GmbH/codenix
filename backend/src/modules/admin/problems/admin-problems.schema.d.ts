import { z } from "zod";
export declare const adminProblemsQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<{
        easy: "easy";
        medium: "medium";
        hard: "hard";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
    }>>;
    tag: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        "updated-desc": "updated-desc";
        "updated-asc": "updated-asc";
        "title-asc": "title-asc";
    }>>;
}, z.core.$strict>;
export declare const adminProblemIdentifierParamsSchema: z.ZodObject<{
    problemId: z.ZodString;
}, z.core.$strict>;
export declare const adminProblemBodySchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    difficulty: z.ZodPipe<z.ZodEnum<{
        EASY: "EASY";
        MEDIUM: "MEDIUM";
        HARD: "HARD";
    }>, z.ZodTransform<"easy" | "medium" | "hard", "EASY" | "MEDIUM" | "HARD">>;
    tags: z.ZodArray<z.ZodString>;
    description_markdown: z.ZodString;
    examples: z.ZodArray<z.ZodObject<{
        input: z.ZodString;
        output: z.ZodString;
        explanation: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    constraints: z.ZodArray<z.ZodString>;
    parameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<{
            string: "string";
            number: "number";
            boolean: "boolean";
            object: "object";
            "number[]": "number[]";
            "string[]": "string[]";
        }>;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    output_type: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        object: "object";
        "number[]": "number[]";
        "string[]": "string[]";
    }>;
    testcases: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        input: z.ZodUnknown;
        expected_output: z.ZodNullable<z.ZodUnknown>;
        is_sample: z.ZodBoolean;
        weight: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strict>>;
    supported_languages: z.ZodArray<z.ZodEnum<{
        python: "python";
        java: "java";
        cpp: "cpp";
        c: "c";
        rust: "rust";
        typescript: "typescript";
        javascript: "javascript";
    }>>;
    starter_code: z.ZodRecord<z.ZodString, z.ZodString>;
    time_limit_ms: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    memory_limit_mb: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    status: z.ZodPipe<z.ZodEnum<{
        DRAFT: "DRAFT";
        PUBLISHED: "PUBLISHED";
    }>, z.ZodTransform<"draft" | "published", "DRAFT" | "PUBLISHED">>;
}, z.core.$strict>;
export type AdminProblemsQueryInput = z.infer<typeof adminProblemsQuerySchema>;
export type AdminProblemIdentifierParamsInput = z.infer<typeof adminProblemIdentifierParamsSchema>;
export type AdminProblemBodyInput = z.infer<typeof adminProblemBodySchema>;
export declare const adminTestcaseBodySchema: z.ZodUnion<readonly [z.ZodPipe<z.ZodObject<{
    input: z.ZodString;
    expectedOutput: z.ZodString;
    visibility: z.ZodEnum<{
        sample: "sample";
        hidden: "hidden";
    }>;
    weight: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>, z.ZodTransform<{
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    weight: number;
}, {
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    weight: number;
}>>, z.ZodPipe<z.ZodObject<{
    input: z.ZodUnknown;
    expected_output: z.ZodNullable<z.ZodUnknown>;
    is_sample: z.ZodBoolean;
    weight: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>, z.ZodTransform<{
    input: string;
    expectedOutput: string;
    visibility: "sample" | "hidden";
    weight: number;
}, {
    input: unknown;
    expected_output: unknown;
    is_sample: boolean;
    weight: number;
}>>]>;
export declare const adminProblemTestcaseParamsSchema: z.ZodObject<{
    problemId: z.ZodString;
    testcaseId: z.ZodString;
}, z.core.$strict>;
export type AdminTestcaseBodyInput = z.infer<typeof adminTestcaseBodySchema>;
export type AdminProblemTestcaseParamsInput = z.infer<typeof adminProblemTestcaseParamsSchema>;
//# sourceMappingURL=admin-problems.schema.d.ts.map