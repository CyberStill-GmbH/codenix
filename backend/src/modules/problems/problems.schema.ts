import { z } from "zod";

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

export type ProblemsQueryInput = z.infer<typeof problemsQuerySchema>;
export type ProblemsSearchQueryInput = z.infer<typeof problemsSearchQuerySchema>;
export type ProblemSlugParamsInput = z.infer<typeof problemSlugParamsSchema>;

export const problemIdentifierParamsSchema = z
  .object({
    problemId: z.string().trim().min(1).max(120)
  })
  .strict();

export const runCodeRequestSchema = z
  .object({
    language: z.string(),
    sourceCode: z.string().min(1),
    stdin: z.string().optional(),
    testcaseIds: z.array(z.string()).optional()
  })
  .strict();

export const createSubmissionRequestSchema = z
  .object({
    language: z.string(),
    sourceCode: z.string().min(1)
  })
  .strict();

export type ProblemIdentifierParamsInput = z.infer<typeof problemIdentifierParamsSchema>;
export type RunCodeRequestInput = z.infer<typeof runCodeRequestSchema>;
export type CreateSubmissionRequestInput = z.infer<typeof createSubmissionRequestSchema>;