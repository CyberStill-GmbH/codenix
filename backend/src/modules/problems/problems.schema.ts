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

export const problemSlugParamsSchema = z
  .object({
    slug: z.string().trim().min(1).max(120)
  })
  .strict();

export type ProblemsQueryInput = z.infer<typeof problemsQuerySchema>;
export type ProblemSlugParamsInput = z.infer<typeof problemSlugParamsSchema>;