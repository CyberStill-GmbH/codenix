import { z } from "zod";

export const submissionsQuerySchema = z
  .object({
    problemId: z.string().uuid().optional(),
    result: z
      .enum([
        "accepted",
        "wrong_answer",
        "runtime_error",
        "time_limit_exceeded",
        "compilation_error",
        "pending"
      ])
      .optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    topic: z.string().trim().min(1).max(80).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(20),
    sort: z.enum(["submitted-desc", "submitted-asc"]).default("submitted-desc")
  })
  .strict();

export type SubmissionsQueryInput = z.infer<typeof submissionsQuerySchema>;