import { apiRequest } from '@/shared/api/apiClient'
import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'
import type {
  PaginatedProblemSubmissions,
  RunCodeResponse,
  SubmissionDetail,
  SubmitCodeResponse,
  TestcaseRunResult,
} from '@/features/coding/types/coding.types'
import { normalizeJudgeStatus } from '@/features/coding/utils/judgeStatus'

type RunCodePayload = {
  language: ProblemCodeLanguage
  sourceCode: string
  stdin?: string
  testcaseIds?: string[]
  testcases?: Array<{
    input: string
    expectedOutput: string
  }>
}

type SubmitCodePayload = {
  language: ProblemCodeLanguage
  sourceCode: string
}

type JudgeRequestReceipt = {
  id: string
  status: ReturnType<typeof normalizeJudgeStatus>
}

type BackendRunReceipt = {
  id: string
  status: string
}

type BackendSubmissionReceipt = {
  id: string
  result: string
  resultCode: string
  submittedAt: string
}

type BackendRunDetail = {
  id: string
  status: string
  stdout?: string | null
  stderr?: string | null
  error?: string | null
  executionTimeMs?: number | null
  memoryKb?: number | null
  testcaseResults: Array<{
    id: string
    testcaseId?: string | null
    index?: number
    visibility?: string
    input: string
    expectedOutput?: string | null
    actualOutput?: string | null
    stdout?: string | null
    stderr?: string | null
    error?: string | null
    passed: boolean
    executionTimeMs?: number | null
    memoryKb?: number | null
  }>
}

type RequestOptions = {
  signal?: AbortSignal
}

class InvalidJudgeResponseError extends Error {
  constructor(message = 'Respuesta inesperada del judge.') {
    super(message)
    this.name = 'InvalidJudgeResponseError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function assertReceipt(value: unknown): asserts value is BackendRunReceipt {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.status !== 'string') {
    throw new InvalidJudgeResponseError()
  }
}

function assertRunDetail(value: unknown): asserts value is BackendRunDetail {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.status !== 'string' ||
    !Array.isArray(value.testcaseResults)
  ) {
    throw new InvalidJudgeResponseError()
  }
}

function assertSubmissionReceipt(value: unknown): asserts value is BackendSubmissionReceipt {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof (value.resultCode ?? value.result) !== 'string'
  ) {
    throw new InvalidJudgeResponseError()
  }
}

function mapTestcaseResult(
  testcase: BackendRunDetail['testcaseResults'][number] | SubmissionDetail['testcaseResults'][number],
  index: number,
): TestcaseRunResult {
  const testcaseIndex =
    'index' in testcase && typeof testcase.index === 'number' ? testcase.index : index + 1
  const stdout = 'stdout' in testcase ? testcase.stdout : undefined
  const stderr = 'stderr' in testcase ? testcase.stderr : undefined

  return {
    id: testcase.testcaseId || testcase.id || `case-${index + 1}`,
    index: testcaseIndex,
    passed: testcase.passed,
    status: 'finished',
    visibility: 'visibility' in testcase ? testcase.visibility : undefined,
    input: testcase.input ?? null,
    expectedOutput: testcase.expectedOutput ?? null,
    actualOutput: testcase.actualOutput ?? stdout ?? undefined,
    stdout: stdout ?? undefined,
    stderr: stderr ?? undefined,
    executionTimeMs: testcase.executionTimeMs ?? undefined,
    memoryKb: testcase.memoryKb ?? undefined,
    error: testcase.error ?? undefined,
  }
}

function mapRunDetail(detail: BackendRunDetail): RunCodeResponse {
  return {
    id: detail.id,
    status: normalizeJudgeStatus(detail.status),
    stdout: detail.stdout ?? undefined,
    stderr: detail.stderr ?? undefined,
    executionTimeMs: detail.executionTimeMs ?? undefined,
    memoryKb: detail.memoryKb ?? undefined,
    testcases: detail.testcaseResults.map(mapTestcaseResult),
    error: detail.error ? { message: detail.error, stderr: detail.stderr ?? undefined } : undefined,
  }
}

function mapSubmissionDetail(detail: SubmissionDetail): SubmitCodeResponse {
  const testcases = detail.testcaseResults.map(mapTestcaseResult)
  const failedCase = testcases.find((testcase) => !testcase.passed)

  return {
    id: detail.id,
    status: normalizeJudgeStatus(detail.resultCode ?? detail.result),
    stdout: detail.stdout ?? undefined,
    stderr: detail.stderr ?? undefined,
    passedCases: testcases.filter((testcase) => testcase.passed).length,
    totalCases: testcases.length,
    executionTimeMs: detail.executionTimeMs ?? undefined,
    memoryKb: detail.memoryKb ?? undefined,
    language: detail.language as ProblemCodeLanguage,
    failedCase,
    error:
      detail.error || detail.stackTrace
        ? { message: detail.error ?? detail.stackTrace ?? 'Execution failed.' }
        : undefined,
  }
}

export async function runProblemCode(
  problemId: string | number,
  payload: RunCodePayload,
  options: RequestOptions = {},
): Promise<JudgeRequestReceipt> {
  const response = await apiRequest<unknown>(`/problems/${problemId}/run`, {
    method: 'POST',
    body: payload,
    signal: options.signal,
  })

  assertReceipt(response)
  return { id: response.id, status: normalizeJudgeStatus(response.status) }
}

export async function getRunResult(runId: string, options: RequestOptions = {}) {
  const response = await apiRequest<unknown>(`/runs/${runId}`, {
    signal: options.signal,
  })
  assertRunDetail(response)
  return mapRunDetail(response)
}

export async function submitProblemCode(
  problemId: string | number,
  payload: SubmitCodePayload,
  options: RequestOptions = {},
): Promise<JudgeRequestReceipt> {
  const response = await apiRequest<unknown>(
    `/problems/${problemId}/submissions`,
    {
      method: 'POST',
      body: payload,
      signal: options.signal,
    },
  )

  assertSubmissionReceipt(response)
  return {
    id: response.id,
    status: normalizeJudgeStatus(response.resultCode ?? response.result),
  }
}

export async function getSubmissionResult(
  submissionId: string,
  options: RequestOptions = {},
) {
  const detail = await getSubmissionDetail(submissionId, options)
  return mapSubmissionDetail(detail)
}

export function getSubmissionDetail(submissionId: string, options: RequestOptions = {}) {
  return apiRequest<SubmissionDetail>(`/submissions/${submissionId}`, {
    signal: options.signal,
  })
}

export function getProblemSubmissions(problemId: string | number) {
  const query = new URLSearchParams({
    problemId: String(problemId),
    sort: 'submitted-desc',
    pageSize: '20',
  })

  return apiRequest<PaginatedProblemSubmissions>(`/submissions?${query.toString()}`)
}
