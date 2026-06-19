import { adminProblemsMock } from '@/features/admin/problems/data/adminProblems.mock'
import {
  adminProblemDetailsMock,
  createDefaultCodeTemplates,
  createDefaultProblemParameters,
  createDefaultStarterCode,
  createDefaultStructuredTestcases,
} from '@/features/admin/problems/data/adminProblemDetails.mock'
import { adminTestcasesMock } from '@/features/admin/problems/data/adminTestcases.mock'
import type {
  AdminProblemDetails,
  AdminProblemFormValues,
  AdminProblem,
  AdminTestcase,
  AdminTestcasePayload,
  JsonValue,
  ProblemLanguage,
  ProblemParameter,
  ProblemParameterType,
  StructuredProblemTestcase,
} from '@/features/admin/problems/types/problem.types'
import { toBackendProblemPayload } from '@/features/admin/problems/utils/problemPayload'
import { apiRequest, ApiError } from '@/shared/api/apiClient'

const REQUEST_DELAY_MS = 320

let problemsStore: AdminProblem[] = [...adminProblemsMock]
let problemDetailsStore: AdminProblemDetails[] = [...adminProblemDetailsMock]
let testcasesStore: AdminTestcase[] = [...adminTestcasesMock]

const wait = (delay = REQUEST_DELAY_MS) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, delay)
  })

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

type BackendAdminProblemDetails = Omit<
  AdminProblemDetails,
  'testcases' | 'starterCode' | 'supportedLanguages' | 'codeTemplates'
> & {
  testcases: BackendStructuredTestcase[]
  starterCode: Record<string, string>
  supportedLanguages: string[]
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

type StatusUpdateResponse = {
  id: string
  status: AdminProblem['status']
  updatedAt: string
}

export const adminProblemsService = {
  async getProblems(): Promise<AdminProblem[]> {
    try {
      const response = await apiRequest<PaginatedResponse<AdminProblem>>(
        '/admin/problems?pageSize=100&sort=updated-desc',
      )
      return response.data.map(cloneProblem)
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      return syncProblemTestcaseCounts().map(cloneProblem)
    }
  },

  async getProblem(problemId: string): Promise<AdminProblem> {
    try {
      const problem = await apiRequest<BackendAdminProblemDetails>(
        `/admin/problems/${problemId}`,
      )
      return cloneProblem(mapBackendProblemDetails(problem))
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      const problem = findProblemByIdOrSlug(problemId)

      if (!problem) {
        throw new Error('Problem not found', { cause: error })
      }

      return cloneProblem(problem)
    }
  },

  async getProblemDetails(problemId: string): Promise<AdminProblemDetails> {
    try {
      const problem = await apiRequest<BackendAdminProblemDetails>(
        `/admin/problems/${problemId}`,
      )
      return cloneProblemDetails(mapBackendProblemDetails(problem))
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      const problem = findProblemByIdOrSlug(problemId)

      if (!problem) {
        throw new Error('Problem not found', { cause: error })
      }

      return cloneProblemDetails(findOrCreateProblemDetails(problem))
    }
  },

  async createProblem(values: AdminProblemFormValues): Promise<AdminProblemDetails> {
    try {
      const problem = await apiRequest<BackendAdminProblemDetails>('/admin/problems', {
        method: 'POST',
        body: toBackendProblemPayload(values),
      })
      return cloneProblemDetails(mapBackendProblemDetails(problem))
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      return createProblemInMemory(values)
    }
  },

  async updateProblem(
    problemId: string,
    values: AdminProblemFormValues,
  ): Promise<AdminProblemDetails> {
    try {
      const problem = await apiRequest<BackendAdminProblemDetails>(
        `/admin/problems/${problemId}`,
        {
          method: 'PUT',
          body: toBackendProblemPayload(values),
        },
      )
      return cloneProblemDetails(mapBackendProblemDetails(problem))
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      return updateProblemInMemory(problemId, values)
    }
  },

  async getProblemTestcases(problemId: string): Promise<AdminTestcase[]> {
    try {
      const response = await apiRequest<ListResponse<AdminTestcase>>(
        `/admin/problems/${problemId}/testcases`,
      )
      return response.data.map(cloneTestcase)
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      const problem = findProblemByIdOrSlug(problemId)

      if (!problem) {
        throw new Error('Problem not found', { cause: error })
      }

      return testcasesStore
        .filter((testcase) => testcase.problemId === problem.id)
        .map(cloneTestcase)
    }
  },

  async createProblemTestcase(
    problemId: string,
    payload: AdminTestcasePayload,
  ): Promise<AdminTestcase> {
    try {
      return await apiRequest<AdminTestcase>(`/admin/problems/${problemId}/testcases`, {
        method: 'POST',
        body: payload,
      })
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      return createProblemTestcaseInMemory(problemId, payload)
    }
  },

  async updateProblemTestcase(
    problemId: string,
    testcaseId: string,
    payload: AdminTestcasePayload,
  ): Promise<AdminTestcase> {
    try {
      return await apiRequest<AdminTestcase>(
        `/admin/problems/${problemId}/testcases/${testcaseId}`,
        {
          method: 'PUT',
          body: payload,
        },
      )
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      return updateProblemTestcaseInMemory(problemId, testcaseId, payload)
    }
  },

  async deleteProblemTestcase(problemId: string, testcaseId: string): Promise<void> {
    try {
      await apiRequest<void>(`/admin/problems/${problemId}/testcases/${testcaseId}`, {
        method: 'DELETE',
      })
      return
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      deleteProblemTestcaseInMemory(problemId, testcaseId)
    }
  },

  async publishProblem(problemId: string): Promise<AdminProblem> {
    try {
      const response = await apiRequest<StatusUpdateResponse>(
        `/admin/problems/${problemId}/publish`,
        { method: 'PATCH' },
      )
      return mergeStatusUpdate(response)
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      const problem = findProblemByIdOrSlug(problemId)

      if (!problem) {
        throw new Error('Problem not found', { cause: error })
      }

      const validation = getPublishValidation(problem.id)

      if (!validation.canPublish) {
        throw new Error(validation.message, { cause: error })
      }

      return updateProblemStatus(problem.id, 'published')
    }
  },

  async unpublishProblem(problemId: string): Promise<AdminProblem> {
    try {
      const response = await apiRequest<StatusUpdateResponse>(
        `/admin/problems/${problemId}/unpublish`,
        { method: 'PATCH' },
      )
      return mergeStatusUpdate(response)
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      await wait()
      const problem = findProblemByIdOrSlug(problemId)

      if (!problem) {
        throw new Error('Problem not found', { cause: error })
      }

      return updateProblemStatus(problem.id, 'draft')
    }
  },

  canPublishProblem(problemId: string) {
    const problem = findProblemByIdOrSlug(problemId)

    if (!problem) {
      return { canPublish: false, message: 'Problem not found.' }
    }

    return getPublishValidation(problem.id)
  },

  async getTopicSuggestions(): Promise<string[]> {
    try {
      const response = await apiRequest<ListResponse<{ name: string }>>('/problems/topics')
      return response.data.map((topic) => topic.name)
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error
      return Array.from(new Set(problemsStore.flatMap((problem) => problem.tags))).sort(
        (firstTag, secondTag) => firstTag.localeCompare(secondTag),
      )
    }
  },
}

function shouldFallbackToMock(error: unknown) {
  if (error instanceof ApiError) {
    return [404, 405, 501].includes(error.status)
  }

  return error instanceof TypeError
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

  if (Array.isArray(value)) {
    return value.every(isJsonValue)
  }

  if (typeof value === 'object') {
    return Object.values(value).every(isJsonValue)
  }

  return false
}

function toJsonValue(value: unknown): JsonValue {
  return isJsonValue(value) ? value : String(value)
}

function normalizeParameters(value: unknown): AdminProblemDetails['parameters'] {
  if (!Array.isArray(value)) return createDefaultProblemParameters()

  return value
    .filter((parameter): parameter is ProblemParameter => {
      if (!parameter || typeof parameter !== 'object') return false
      const candidate = parameter as Partial<ProblemParameter>
      return Boolean(candidate.name && candidate.type)
    })
    .map((parameter) => ({
      id: parameter.id ?? `param-${parameter.name}`,
      name: parameter.name,
      type: parameter.type,
      description: parameter.description,
    }))
}

function normalizeOutputType(value: unknown): ProblemParameterType {
  if (
    value === 'number' ||
    value === 'number[]' ||
    value === 'string' ||
    value === 'string[]' ||
    value === 'boolean' ||
    value === 'object'
  ) {
    return value
  }

  return 'object'
}

function normalizeLanguages(value: string[]): ProblemLanguage[] {
  const languages = value.filter((language): language is ProblemLanguage =>
    ['typescript', 'javascript', 'python', 'java', 'cpp'].includes(language),
  )

  return languages.length > 0
    ? languages
    : ['typescript', 'javascript', 'python', 'java']
}

function mapBackendProblemDetails(
  problem: BackendAdminProblemDetails,
): AdminProblemDetails {
  const supportedLanguages = normalizeLanguages(problem.supportedLanguages)
  const starterCode = createDefaultStarterCode()

  supportedLanguages.forEach((language) => {
    starterCode[language] = problem.starterCode[language] ?? starterCode[language]
  })

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
    parameters: normalizeParameters(problem.parameters),
    outputType: normalizeOutputType(problem.outputType),
    testcases: problem.testcases.map(mapBackendStructuredTestcase),
    supportedLanguages,
    starterCode,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb,
    statement: problem.descriptionMarkdown,
    inputFormat: problem.parameters
      .map((parameter) => `${parameter.name}: ${parameter.type}`)
      .join('\n'),
    outputFormat: problem.outputType,
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
  return {
    id: testcase.id,
    input:
      testcase.input && typeof testcase.input === 'object' && !Array.isArray(testcase.input)
        ? Object.fromEntries(
            Object.entries(testcase.input).map(([key, value]) => [key, toJsonValue(value)]),
          )
        : {},
    expectedOutput: toJsonValue(testcase.expected_output),
    isSample: testcase.is_sample,
  }
}

function mergeStatusUpdate(response: StatusUpdateResponse): AdminProblem {
  const problem = findProblemByIdOrSlug(response.id)
  if (!problem) {
    return {
      id: response.id,
      title: '',
      slug: response.id,
      difficulty: 'easy',
      tags: [],
      status: response.status,
      testcasesCount: 0,
      updatedAt: response.updatedAt,
    }
  }

  const updatedProblem = {
    ...problem,
    status: response.status,
    updatedAt: response.updatedAt,
  }

  problemsStore = problemsStore.map((currentProblem) =>
    currentProblem.id === updatedProblem.id ? updatedProblem : currentProblem,
  )

  return cloneProblem(updatedProblem)
}

async function createProblemInMemory(
  values: AdminProblemFormValues,
): Promise<AdminProblemDetails> {
  await wait(260)
  assertUniqueSlug(values.slug)

  const now = new Date().toISOString()
  const problem: AdminProblem = {
    id: `prob-${Date.now()}`,
    title: values.title,
    slug: values.slug,
    difficulty: values.difficulty,
    tags: [...values.tags],
    status: values.status,
    testcasesCount: values.testcases.length,
    updatedAt: now,
  }
  const details: AdminProblemDetails = {
    ...problem,
    ...cloneProblemFormValues(values),
  }

  problemsStore = [problem, ...problemsStore]
  problemDetailsStore = [details, ...problemDetailsStore]

  return cloneProblemDetails(details)
}

async function updateProblemInMemory(
  problemId: string,
  values: AdminProblemFormValues,
): Promise<AdminProblemDetails> {
  await wait(260)
  const problem = findProblemByIdOrSlug(problemId)

  if (!problem) {
    throw new Error('Problem not found')
  }

  assertUniqueSlug(values.slug, problem.id)

  const updatedProblem: AdminProblem = {
    ...problem,
    title: values.title,
    slug: values.slug,
    difficulty: values.difficulty,
    tags: [...values.tags],
    status: values.status,
    testcasesCount: values.testcases.length,
    updatedAt: new Date().toISOString(),
  }
  const updatedDetails: AdminProblemDetails = {
    ...findOrCreateProblemDetails(problem),
    ...updatedProblem,
    ...cloneProblemFormValues(values),
  }

  problemsStore = problemsStore.map((currentProblem) =>
    currentProblem.id === problem.id ? updatedProblem : currentProblem,
  )
  problemDetailsStore = problemDetailsStore.map((currentDetails) =>
    currentDetails.id === problem.id ? updatedDetails : currentDetails,
  )

  return cloneProblemDetails(updatedDetails)
}

async function createProblemTestcaseInMemory(
  problemId: string,
  payload: AdminTestcasePayload,
): Promise<AdminTestcase> {
  await wait(220)
  const problem = findProblemByIdOrSlug(problemId)

  if (!problem) {
    throw new Error('Problem not found')
  }

  const now = new Date().toISOString()
  const testcase: AdminTestcase = {
    ...payload,
    id: `tc-${Date.now()}`,
    problemId: problem.id,
    createdAt: now,
    updatedAt: now,
  }

  testcasesStore = [testcase, ...testcasesStore]
  touchProblem(problem.id)

  return cloneTestcase(testcase)
}

async function updateProblemTestcaseInMemory(
  problemId: string,
  testcaseId: string,
  payload: AdminTestcasePayload,
): Promise<AdminTestcase> {
  await wait(220)
  const problem = findProblemByIdOrSlug(problemId)

  if (!problem) {
    throw new Error('Problem not found')
  }

  const testcaseIndex = testcasesStore.findIndex(
    (testcase) => testcase.problemId === problem.id && testcase.id === testcaseId,
  )

  if (testcaseIndex === -1) {
    throw new Error('Testcase not found')
  }

  const updatedTestcase: AdminTestcase = {
    ...testcasesStore[testcaseIndex],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  testcasesStore = testcasesStore.map((testcase) =>
    testcase.id === testcaseId ? updatedTestcase : testcase,
  )
  touchProblem(problem.id)

  return cloneTestcase(updatedTestcase)
}

function deleteProblemTestcaseInMemory(problemId: string, testcaseId: string): void {
  const problem = findProblemByIdOrSlug(problemId)

  if (!problem) {
    throw new Error('Problem not found')
  }

  const testcaseExists = testcasesStore.some(
    (testcase) => testcase.problemId === problem.id && testcase.id === testcaseId,
  )

  if (!testcaseExists) {
    throw new Error('Testcase not found')
  }

  testcasesStore = testcasesStore.filter((testcase) => testcase.id !== testcaseId)
  touchProblem(problem.id)
}

function updateProblemStatus(
  problemId: string,
  status: AdminProblem['status'],
): AdminProblem {
  const problemIndex = problemsStore.findIndex((problem) => problem.id === problemId)

  if (problemIndex === -1) {
    throw new Error('Problem not found')
  }

  const updatedProblem: AdminProblem = {
    ...problemsStore[problemIndex],
    status,
    updatedAt: new Date().toISOString(),
  }

  problemsStore = problemsStore.map((problem) =>
    problem.id === problemId ? updatedProblem : problem,
  )
  problemDetailsStore = problemDetailsStore.map((problemDetails) =>
    problemDetails.id === problemId
      ? { ...problemDetails, status, updatedAt: updatedProblem.updatedAt }
      : problemDetails,
  )

  return { ...updatedProblem, tags: [...updatedProblem.tags] }
}

function findProblemByIdOrSlug(problemId: string) {
  return syncProblemTestcaseCounts().find(
    (problem) => problem.id === problemId || problem.slug === problemId,
  )
}

function syncProblemTestcaseCounts() {
  problemsStore = problemsStore.map((problem) => ({
    ...problem,
    testcasesCount:
      problemDetailsStore.find((details) => details.id === problem.id)?.testcases.length ??
      testcasesStore.filter((testcase) => testcase.problemId === problem.id).length,
  }))

  return problemsStore
}

function getPublishValidation(problemId: string) {
  const details = problemDetailsStore.find((problem) => problem.id === problemId)
  const structuredTestcases = details?.testcases ?? []
  const legacyTestcases = testcasesStore.filter((testcase) => testcase.problemId === problemId)
  const hasSample =
    structuredTestcases.some((testcase) => testcase.isSample) ||
    legacyTestcases.some((testcase) => testcase.visibility === 'sample')
  const hasHidden =
    structuredTestcases.some((testcase) => !testcase.isSample) ||
    legacyTestcases.some((testcase) => testcase.visibility === 'hidden')

  if (hasSample && hasHidden) {
    return { canPublish: true, message: 'Problem is ready to publish.' }
  }

  if (!hasSample && !hasHidden) {
    return {
      canPublish: false,
      message: 'Add at least 1 sample testcase and 1 hidden testcase before publishing.',
    }
  }

  if (!hasSample) {
    return {
      canPublish: false,
      message: 'Add at least 1 sample testcase before publishing.',
    }
  }

  return {
    canPublish: false,
    message: 'Add at least 1 hidden testcase before publishing.',
  }
}

function touchProblem(problemId: string) {
  const updatedAt = new Date().toISOString()

  problemsStore = problemsStore.map((problem) =>
    problem.id === problemId
      ? {
          ...problem,
          updatedAt,
          testcasesCount: testcasesStore.filter((testcase) => testcase.problemId === problem.id)
            .length,
        }
      : problem,
  )
  problemDetailsStore = problemDetailsStore.map((problemDetails) =>
    problemDetails.id === problemId ? { ...problemDetails, updatedAt } : problemDetails,
  )
}

function cloneProblem(problem: AdminProblem): AdminProblem {
  return { ...problem, tags: [...problem.tags] }
}

function cloneTestcase(testcase: AdminTestcase): AdminTestcase {
  return { ...testcase }
}

function findOrCreateProblemDetails(problem: AdminProblem): AdminProblemDetails {
  const problemDetails = problemDetailsStore.find((details) => details.id === problem.id)

  if (problemDetails) {
    const syncedDetails = {
      ...problemDetails,
      status: problem.status,
      testcasesCount: problem.testcasesCount,
      updatedAt: problem.updatedAt,
    }

    problemDetailsStore = problemDetailsStore.map((details) =>
      details.id === problem.id ? syncedDetails : details,
    )

    return syncedDetails
  }

  const newProblemDetails: AdminProblemDetails = {
    ...problem,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    tags: [...problem.tags],
    statement: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    examples: [],
    codeTemplates: createDefaultCodeTemplates(),
    descriptionMarkdown: '',
    constraintsList: [],
    parameters: createDefaultProblemParameters(),
    outputType: 'object',
    testcases: createDefaultStructuredTestcases(),
    supportedLanguages: ['typescript', 'javascript', 'python', 'java'],
    starterCode: createDefaultStarterCode(),
    timeLimitMs: 2000,
    memoryLimitMb: 256,
  }

  problemDetailsStore = [...problemDetailsStore, newProblemDetails]
  return newProblemDetails
}

function assertUniqueSlug(slug: string, currentProblemId?: string) {
  const duplicate = problemsStore.some(
    (problem) => problem.slug === slug && problem.id !== currentProblemId,
  )

  if (duplicate) {
    throw new Error('Slug already exists.')
  }
}

function cloneProblemFormValues(
  values: AdminProblemFormValues,
): AdminProblemFormValues {
  return {
    ...values,
    tags: [...values.tags],
    constraintsList: [...values.constraintsList],
    parameters: values.parameters.map((parameter) => ({ ...parameter })),
    testcases: values.testcases.map((testcase) => ({
      ...testcase,
      input: { ...testcase.input },
    })),
    supportedLanguages: [...values.supportedLanguages],
    starterCode: { ...values.starterCode },
    examples: values.examples.map((example) => ({ ...example })),
    codeTemplates: values.codeTemplates.map((template) => ({ ...template })),
  }
}

function cloneProblemDetails(problemDetails: AdminProblemDetails): AdminProblemDetails {
  return {
    ...problemDetails,
    tags: [...problemDetails.tags],
    constraintsList: [...problemDetails.constraintsList],
    parameters: problemDetails.parameters.map((parameter) => ({ ...parameter })),
    testcases: problemDetails.testcases.map((testcase) => ({
      ...testcase,
      input: { ...testcase.input },
    })),
    supportedLanguages: [...problemDetails.supportedLanguages],
    starterCode: { ...problemDetails.starterCode },
    examples: problemDetails.examples.map((example) => ({ ...example })),
    codeTemplates: problemDetails.codeTemplates.map((template) => ({ ...template })),
  }
}
