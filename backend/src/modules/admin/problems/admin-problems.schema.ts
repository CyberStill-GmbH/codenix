import { z } from "zod";

const difficultyInputSchema = z
  .enum(["EASY", "MEDIUM", "HARD"])
  .transform((value) => value.toLowerCase() as "easy" | "medium" | "hard");

const statusInputSchema = z
  .enum(["DRAFT", "PUBLISHED"])
  .transform((value) => value.toLowerCase() as "draft" | "published");

const outputTypeSchema = z.enum([
  "number",
  "number[]",
  "string",
  "string[]",
  "boolean",
  "object"
]);

const parameterSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    type: outputTypeSchema,
    description: z.string().trim().max(500).optional()
  })
  .strict();

const exampleSchema = z
  .object({
    input: z.string().max(10_000),
    output: z.string().max(10_000),
    explanation: z.string().max(10_000).optional()
  })
  .strict();

const testcaseSchema = z
  .object({
    id: z.string().optional(),
    input: z.unknown(),
    expected_output: z.unknown().nullable(),
    is_sample: z.boolean(),
    weight: z.coerce.number().int().positive().default(1)
  })
  .strict();

export const adminProblemsQuerySchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    status: z.enum(["draft", "published"]).optional(),
    tag: z.string().trim().min(1).max(80).optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(50),
    sort: z
      .enum(["updated-desc", "updated-asc", "title-asc"])
      .default("updated-desc")
  })
  .strict();

export const adminProblemIdentifierParamsSchema = z
  .object({
    problemId: z.string().trim().min(1).max(120)
  })
  .strict();

export const adminProblemBodySchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    slug: z
      .string()
      .trim()
      .min(1)
      .max(140)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug."),
    difficulty: difficultyInputSchema,
    tags: z.array(z.string().trim().min(1).max(80)).max(20),
    description_markdown: z.string().min(1).max(50_000),
    examples: z.array(exampleSchema).max(20),
    constraints: z.array(z.string().trim().min(1).max(500)).max(100),
    parameters: z.array(parameterSchema).max(20),
    output_type: outputTypeSchema,
    testcases: z.array(testcaseSchema).max(200),
    supported_languages: z
      .array(
        z.enum([
          "typescript",
          "javascript",
          "python",
          "java",
          "cpp",
          "c",
          "rust"
        ])
      )
      .max(10),
    starter_code: z.record(z.string(), z.string().max(50_000)),
    time_limit_ms: z.coerce.number().int().min(100).max(30_000).default(2000),
    memory_limit_mb: z.coerce.number().int().min(16).max(2048).default(256),
    status: statusInputSchema
  })
  .strict();

export type AdminProblemsQueryInput = z.infer<
  typeof adminProblemsQuerySchema
>;

export type AdminProblemIdentifierParamsInput = z.infer<
  typeof adminProblemIdentifierParamsSchema
>;

export type AdminProblemBodyInput = z.infer<typeof adminProblemBodySchema>;

function toJsonString(value: unknown) {
  return JSON.stringify(value) ?? "null";
}

const legacyAdminTestcaseBodySchema = z
  .object({
    input: z.string().max(50_000),
    expectedOutput: z.string().max(50_000),
    visibility: z.enum(["sample", "hidden"]),
    weight: z.coerce.number().int().positive().default(1)
  })
  .strict()
  .transform((value) => ({
    input: value.input,
    expectedOutput: value.expectedOutput,
    visibility: value.visibility,
    weight: value.weight
  }));

const modernAdminTestcaseBodySchema = z
  .object({
    input: z.unknown(),
    expected_output: z.unknown().nullable(),
    is_sample: z.boolean(),
    weight: z.coerce.number().int().positive().default(1)
  })
  .strict()
  .transform((value) => ({
    input: toJsonString(value.input),
    expectedOutput: toJsonString(value.expected_output),
    visibility: value.is_sample ? ("sample" as const) : ("hidden" as const),
    weight: value.weight
  }));

export const adminTestcaseBodySchema = z.union([
  legacyAdminTestcaseBodySchema,
  modernAdminTestcaseBodySchema
]);

export const adminProblemTestcaseParamsSchema = z
  .object({
    problemId: z.string().trim().min(1).max(120),
    testcaseId: z.string().uuid()
  })
  .strict();

export type AdminTestcaseBodyInput = z.infer<typeof adminTestcaseBodySchema>;

export type AdminProblemTestcaseParamsInput = z.infer<
  typeof adminProblemTestcaseParamsSchema
>;
