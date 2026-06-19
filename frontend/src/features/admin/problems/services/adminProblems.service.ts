import type {
  AdminProblem,
  AdminProblemDetails,
  AdminProblemFormValues,
  AdminTestcase,
  AdminTestcasePayload,
  JsonValue,
  ProblemLanguage,
  ProblemParameter,
  ProblemParameterType,
  StructuredProblemTestcase,
} from '@/features/admin/problems/types/problem.types'
import { toBackendProblemPayload } from '@/features/admin/problems/utils/problemPayload'
import { createDefaultStarterCode } from '@/features/admin/problems/utils/problemFormDefaults'
import { apiRequest } from '@/shared/api/apiClient'

type PaginatedResponse<T> = {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

type ListResponse<T> = {
  data: T[]
}

type BackendStructuredTestcase = {
  id: string
  input: unknown
  expected_output: unknown
  is_sample: boolean
  weight?: number
  createdAt?: string
  updatedAt?: string
}

type BackendAdminProblemDetails = {
  id: string
  title: string
  slug: string
  difficulty: AdminProblem['difficulty']
  tags: string[]
  status: AdminProblem['status']
  testcasesCount: number
  updatedAt: string
  descriptionMarkdown: string
  examples: AdminProblemDetails['examples']
  constraintsList: string[]
  parameters: unknown
  outputType: unknown
  testcases: BackendStructuredTestcase[]
  supportedLanguages: string[]
  starterCode: Record<string, string>
  timeLimitMs: number
  memoryLimitMb: number
}

type StatusUpdateResponse = {
  id: string
  status: AdminProblem['status']
  updatedAt: string
}

export const adminProblemsService = {
  async getProblems(): Promise<AdminProblem[]> {
    const response = await apiRequest<PaginatedResponse<AdminProblem>>(
      '/admin/problems?pageSize=100&sort=updated-desc',
    )
    return response.data.map(cloneProblem)
  },

  async getProblem(problemId: string): Promise<AdminProblem> {
    const details = await getProblemDetails(problemId)
    return cloneProblem(details)
  },

  getProblemDetails,

  async createProblem(values: AdminProblemFormValues): Promise<AdminProblemDetails> {
    const response = await apiRequest<BackendAdminProblemDetails>('/admin/problems', {
      method: 'POST',
      body: toBackendProblemPayload(values),
    })
    return mapBackendProblemDetails(response)
  },

  async updateProblem(
    problemId: string,
    values: AdminProblemFormValues,
  ): Promise<AdminProblemDetails> {
    const response = await apiRequest<BackendAdminProblemDetails>(
      `/admin/problems/${problemId}`,
      {
        method: 'PUT',
        body: toBackendProblemPayload(values),
      },
    )
    return mapBackendProblemDetails(response)
  },

  async getProblemTestcases(problemId: string): Promise<AdminTestcase[]> {
    const response = await apiRequest<ListResponse<AdminTestcase>>(
      `/admin/problems/${problemId}/testcases`,
    )
    return response.data.map((testcase) => ({ ...testcase }))
  },

  createProblemTestcase(problemId: string, payload: AdminTestcasePayload) {
    return apiRequest<AdminTestcase>(`/admin/problems/${problemId}/testcases`, {
      method: 'POST',
      body: payload,
    })
  },

  updateProblemTestcase(
    problemId: string,
    testcaseId: string,
    payload: AdminTestcasePayload,
  ) {
    return apiRequest<AdminTestcase>(
      `/admin/problems/${problemId}/testcases/${testcaseId}`,
      {
        method: 'PUT',
        body: payload,
      },
    )
  },

  deleteProblemTestcase(problemId: string, testcaseId: string) {
    return apiRequest<void>(`/admin/problems/${problemId}/testcases/${testcaseId}`, {
      method: 'DELETE',
    })
  },

  async publishProblem(problemId: string): Promise<AdminProblem> {
    const response = await apiRequest<StatusUpdateResponse>(
      `/admin/problems/${problemId}/publish`,
      { method: 'PATCH' },
    )
    return adminProblemsService.getProblem(response.id)
  },

  async unpublishProblem(problemId: string): Promise<AdminProblem> {
    const response = await apiRequest<StatusUpdateResponse>(
      `/admin/problems/${problemId}/unpublish`,
      { method: 'PATCH' },
    )
    return adminProblemsService.getProblem(response.id)
  },

  async getTopicSuggestions(): Promise<string[]> {
    const response = await apiRequest<ListResponse<{ name: string }>>('/problems/topics')
    return response.data.map((topic) => topic.name)
  },
}

async function getProblemDetails(problemId: string): Promise<AdminProblemDetails> {
  const response = await apiRequest<BackendAdminProblemDetails>(
    `/admin/problems/${problemId}`,
  )
  return mapBackendProblemDetails(response)
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true
  }

  if (Array.isArray(value)) return value.every(isJsonValue)
  if (typeof value === 'object') return Object.values(value).every(isJsonValue)
  return false
}

function toJsonValue(value: unknown): JsonValue {
  return isJsonValue(value) ? value : String(value)
}

function normalizeParameters(value: unknown): ProblemParameter[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((parameter, index) => {
    if (!parameter || typeof parameter !== 'object') return []
    const candidate = parameter as Partial<ProblemParameter>
    if (!candidate.name || !isParameterType(candidate.type)) return []

    return [{
      id: candidate.id ?? `param-${index}-${candidate.name}`,
      name: candidate.name,
      type: candidate.type,
      description: candidate.description,
    }]
  })
}

function isParameterType(value: unknown): value is ProblemParameterType {
  return (
    value === 'number' ||
    value === 'number[]' ||
    value === 'string' ||
    value === 'string[]' ||
    value === 'boolean' ||
    value === 'object'
  )
}

function normalizeLanguages(value: string[]): ProblemLanguage[] {
  return value.filter((language): language is ProblemLanguage =>
    ['typescript', 'javascript', 'python', 'java', 'cpp'].includes(language),
  )
}

function mapBackendProblemDetails(
  problem: BackendAdminProblemDetails,
): AdminProblemDetails {
  const supportedLanguages = normalizeLanguages(problem.supportedLanguages)
  const starterCode = createDefaultStarterCode()

  supportedLanguages.forEach((language) => {
    starterCode[language] = problem.starterCode[language] ?? ''
  })

  const parameters = normalizeParameters(problem.parameters)
  const outputType = isParameterType(problem.outputType) ? problem.outputType : 'object'

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    tags: [...problem.tags],
    status: problem.status,
    testcasesCount: problem.testcasesCount,
    updatedAt: problem.updatedAt,
    descriptionMarkdown: problem.descriptionMarkdown,
    constraintsList: [...problem.constraintsList],
    parameters,
    outputType,
    testcases: problem.testcases.map(mapBackendStructuredTestcase),
    supportedLanguages,
    starterCode,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb,
    statement: problem.descriptionMarkdown,
    inputFormat: parameters.map(({ name, type }) => `${name}: ${type}`).join('\n'),
    outputFormat: outputType,
    constraints: problem.constraintsList.join('\n'),
    examples: problem.examples.map((example) => ({ ...example })),
    codeTemplates: supportedLanguages.map((language) => ({
      language,
      starterCode: starterCode[language],
    })),
  }
}

function mapBackendStructuredTestcase(
  testcase: BackendStructuredTestcase,
): StructuredProblemTestcase {
  const input =
    testcase.input && typeof testcase.input === 'object' && !Array.isArray(testcase.input)
      ? Object.fromEntries(
          Object.entries(testcase.input).map(([key, value]) => [key, toJsonValue(value)]),
        )
      : {}

  return {
    id: testcase.id,
    input,
    expectedOutput: toJsonValue(testcase.expected_output),
    isSample: testcase.is_sample,
  }
}

function cloneProblem(problem: AdminProblem): AdminProblem {
  return { ...problem, tags: [...problem.tags] }
}
