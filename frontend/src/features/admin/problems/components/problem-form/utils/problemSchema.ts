import { nanoid } from 'nanoid'
import { z } from 'zod'

import type {
  AdminProblemFormValues,
  JsonValue,
  ProblemLanguage,
  ProblemParameter,
  ProblemParameterType,
  StructuredProblemTestcase,
} from '@/features/admin/problems/types/problem.types'
import { starterCodeTemplates } from '@/features/admin/problems/utils/problemFormDefaults'

export type ProblemFormErrors = Partial<Record<keyof AdminProblemFormValues, string>>

export const availableLanguages: Array<{ value: ProblemLanguage; label: string }> = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
]

export const defaultStarterCode: Record<ProblemLanguage, string> = starterCodeTemplates

export const markdownPlaceholder =
  '## Descripcion\n\nEscribe el enunciado del problema aqui...\n\n## Ejemplos\n\n...'

export function createId(prefix: string) {
  return `${prefix}-${nanoid(8)}`
}

const problemParameterTypeSchema = z.enum([
  'number',
  'number[]',
  'string',
  'string[]',
  'boolean',
  'object',
])

const problemLanguageSchema = z.enum([
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
])

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
)

const problemFormBaseSchema = z.object({
  title: z.string().trim().min(1, 'El titulo es requerido.').max(100, 'Maximo 100 caracteres.'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Usa solo minusculas, numeros y guiones.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()).max(5, 'Maximo 5 tags.'),
  descriptionMarkdown: z.string().trim().min(1, 'La descripcion Markdown es requerida.'),
  constraintsList: z.array(z.string()),
  parameters: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1, 'Cada parametro necesita nombre.'),
        type: problemParameterTypeSchema,
        description: z.string().optional(),
      }),
    )
    .min(1, 'Define al menos un parametro.'),
  outputType: problemParameterTypeSchema,
  testcases: z
    .array(
      z.object({
        id: z.string(),
        input: z.record(z.string(), jsonValueSchema),
        expectedOutput: jsonValueSchema,
        isSample: z.boolean(),
      }),
    )
    .min(1, 'Agrega al menos un testcase.'),
  supportedLanguages: z
    .array(problemLanguageSchema)
    .min(1, 'Selecciona al menos un lenguaje.'),
  starterCode: z.record(problemLanguageSchema, z.string()),
  timeLimitMs: z
    .number()
    .min(500, 'El limite debe estar entre 500 y 10000 ms.')
    .max(10000, 'El limite debe estar entre 500 y 10000 ms.'),
  memoryLimitMb: z
    .number()
    .min(64, 'La memoria debe estar entre 64 y 512 MB.')
    .max(512, 'La memoria debe estar entre 64 y 512 MB.'),
  status: z.enum(['draft', 'published']),
  statement: z.string(),
  inputFormat: z.string(),
  outputFormat: z.string(),
  constraints: z.string(),
  examples: z
    .array(
      z.object({
        id: z.string(),
        input: z.string().trim().min(1, 'El input del ejemplo es requerido.'),
        output: z.string().trim().min(1, 'El output del ejemplo es requerido.'),
        explanation: z.string().optional(),
      }),
    )
    .min(1, 'Agrega al menos un ejemplo.'),
  codeTemplates: z.array(
    z.object({
      language: z.string(),
      starterCode: z.string(),
    }),
  ),
})

export const problemFormSchema = problemFormBaseSchema
  .superRefine((values, context) => {
    if (!values.testcases.some((testcase) => testcase.isSample)) {
      context.addIssue({
        code: 'custom',
        path: ['testcases'],
        message: 'Agrega al menos un testcase sample.',
      })
    }

    if (!values.testcases.some((testcase) => !testcase.isSample)) {
      context.addIssue({
        code: 'custom',
        path: ['testcases'],
        message: 'Agrega al menos un testcase hidden.',
      })
    }
  })

export function createEmptyParameter(): ProblemParameter {
  return {
    id: createId('param'),
    name: '',
    type: 'number',
    description: '',
  }
}

export function createEmptyTestcase(
  parameters: ProblemParameter[],
): StructuredProblemTestcase {
  return {
    id: createId('case'),
    input: Object.fromEntries(parameters.map((parameter) => [parameter.name, ''])),
    expectedOutput: '',
    isSample: false,
  }
}

export function parseJsonValue(value: string): JsonValue {
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''

  try {
    return JSON.parse(trimmedValue) as JsonValue
  } catch {
    return trimmedValue
  }
}

export function formatJsonValue(value: JsonValue) {
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

export function validateValueAgainstType(value: JsonValue, type: ProblemParameterType) {
  if (type === 'number') return typeof value === 'number'
  if (type === 'number[]') {
    return Array.isArray(value) && value.every((item) => typeof item === 'number')
  }
  if (type === 'string') return typeof value === 'string'
  if (type === 'string[]') {
    return Array.isArray(value) && value.every((item) => typeof item === 'string')
  }
  if (type === 'boolean') return typeof value === 'boolean'
  return typeof value === 'object' && value !== null
}

export function validateProblemForm(values: AdminProblemFormValues, strict: boolean) {
  const errors: ProblemFormErrors = {}

  const baseResult = problemFormBaseSchema
    .pick({ title: true, slug: true })
    .safeParse({ title: values.title, slug: values.slug })

  if (!baseResult.success) {
    baseResult.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof AdminProblemFormValues
      errors[key] = issue.message
    })
  }

  if (!strict) return errors

  const result = problemFormSchema.safeParse(values)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof AdminProblemFormValues
      if (!errors[key]) errors[key] = issue.message
    })
  }

  return errors
}
