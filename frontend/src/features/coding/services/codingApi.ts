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
    testcaseId: string
    input: string
    expectedOutput: string
    actualOutput?: string | null
    error?: string | null
    passed: boolean
    executionTimeMs?: number | null
    memoryKb?: number | null
  }>
}

function mapTestcaseResult(
  testcase: BackendRunDetail['testcaseResults'][number] | SubmissionDetail['testcaseResults'][number],
  index: number,
): TestcaseRunResult {
  return {
    id: testcase.testcaseId,
    index: index + 1,
    passed: testcase.passed,
    input: testcase.input,
    expectedOutput: testcase.expectedOutput,
    actualOutput: testcase.actualOutput ?? undefined,
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
): Promise<JudgeRequestReceipt> {
  const response = await apiRequest<BackendRunReceipt>(`/problems/${problemId}/run`, {
    method: 'POST',
    body: payload,
  })

  return { id: response.id, status: normalizeJudgeStatus(response.status) }
}

export function getRunResult(runId: string) {
  return apiRequest<BackendRunDetail>(`/runs/${runId}`).then(mapRunDetail)
}

export async function submitProblemCode(
  problemId: string | number,
  payload: SubmitCodePayload,
): Promise<JudgeRequestReceipt> {
  const response = await apiRequest<BackendSubmissionReceipt>(
    `/problems/${problemId}/submissions`,
    {
      method: 'POST',
      body: payload,
    },
  )

  return {
    id: response.id,
    status: normalizeJudgeStatus(response.resultCode ?? response.result),
  }
}

export async function getSubmissionResult(submissionId: string) {
  const detail = await getSubmissionDetail(submissionId)
  return mapSubmissionDetail(detail)
}

export function getSubmissionDetail(submissionId: string) {
  return apiRequest<SubmissionDetail>(`/submissions/${submissionId}`)
}

export function getProblemSubmissions(problemId: string | number) {
  const query = new URLSearchParams({
    problemId: String(problemId),
    sort: 'submitted-desc',
    pageSize: '20',
  })

  return apiRequest<PaginatedProblemSubmissions>(`/submissions?${query.toString()}`)
}
