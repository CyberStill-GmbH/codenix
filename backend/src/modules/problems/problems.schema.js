import { z } from "zod";
import { SUPPORTED_JUDGE_LANGUAGES } from "../judge/supported-languages";
export const problemsQuerySchema = z
    .object({
    search: z.string().trim().min(1).max(100).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    topic: z.string().trim().min(1).max(80).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(20),
    sort: z
        .enum(["numeric-asc", "numeric-desc", "acceptance-desc", "acceptance-asc"])
        .default("numeric-asc")
})
    .strict();
export const problemsSearchQuerySchema = z
    .object({
    q: z.string().trim().min(1).max(100),
    limit: z.coerce.number().int().positive().max(20).default(8)
})
    .strict();
export const problemSlugParamsSchema = z
    .object({
    slug: z.string().trim().min(1).max(120)
})
    .strict();
export const problemIdentifierParamsSchema = z
    .object({
    problemId: z.string().trim().min(1).max(120)
})
    .strict();
const judgeLanguageSchema = z.enum(SUPPORTED_JUDGE_LANGUAGES);
const customTestcaseSchema = z
    .object({
    input: z.string().max(64 * 1024),
    expectedOutput: z.string().max(64 * 1024)
})
    .strict();
export const runCodeRequestSchema = z
    .object({
    language: judgeLanguageSchema,
    sourceCode: z.string().min(1).max(64 * 1024),
    testcases: z.array(customTestcaseSchema).max(20).optional(),
    stdin: z.string().max(64 * 1024).optional(),
    testcaseIds: z.array(z.string().uuid()).max(20).optional()
})
    .strict();
export const createSubmissionRequestSchema = z
    .object({
    language: judgeLanguageSchema,
    sourceCode: z.string().min(1).max(64 * 1024)
})
    .strict();
//# sourceMappingURL=problems.schema.js.map