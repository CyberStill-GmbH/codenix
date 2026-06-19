import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'

export function toBackendProblemPayload(values: AdminProblemFormValues) {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    difficulty: values.difficulty.toUpperCase(),
    tags: values.tags,
    description_markdown: values.descriptionMarkdown,
    examples: values.examples.map(({ input, output, explanation }) => ({
      input,
      output,
      explanation,
    })),
    constraints: values.constraintsList,
    parameters: values.parameters.map(({ name, type, description }) => ({
      name,
      type,
      description,
    })),
    output_type: values.outputType,
    testcases: values.testcases.map((testcase) => ({
      id: testcase.id,
      input: testcase.input,
      expected_output: testcase.expectedOutput,
      is_sample: testcase.isSample,
    })),
    supported_languages: values.supportedLanguages,
    starter_code: values.starterCode,
    time_limit_ms: values.timeLimitMs,
    memory_limit_mb: values.memoryLimitMb,
    status: values.status.toUpperCase(),
  }
}
