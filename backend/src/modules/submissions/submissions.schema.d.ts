import { z } from "zod";
export declare const submissionsQuerySchema: z.ZodObject<{
    problemId: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodEnum<{
        accepted: "accepted";
        wrong_answer: "wrong_answer";
        runtime_error: "runtime_error";
        time_limit_exceeded: "time_limit_exceeded";
        compilation_error: "compilation_error";
        pending: "pending";
    }>>;
    difficulty: z.ZodOptional<z.ZodEnum<{
        easy: "easy";
        medium: "medium";
        hard: "hard";
    }>>;
    topic: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    pageSize: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        "submitted-desc": "submitted-desc";
        "submitted-asc": "submitted-asc";
    }>>;
}, z.core.$strict>;
export declare const submissionParamsSchema: z.ZodObject<{
    submissionId: z.ZodString;
}, z.core.$strict>;
export type SubmissionsQueryInput = z.infer<typeof submissionsQuerySchema>;
export type SubmissionParamsInput = z.infer<typeof submissionParamsSchema>;
//# sourceMappingURL=submissions.schema.d.ts.map