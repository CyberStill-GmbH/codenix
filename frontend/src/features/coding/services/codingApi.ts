import { apiRequest } from '@/shared/api/apiClient'
import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'
import type {
  CodingTestcase,
  PaginatedProblemSubmissions,
  RunCodeResponse,
  SubmissionDetail,
  SubmitCodeResponse,
} from '@/features/coding/types/coding.types'

type RunCodePayload = {
  language: ProblemCodeLanguage
  sourceCode: string
  testcases: Array<Pick<CodingTestcase, 'input' | 'expectedOutput'>>
}

type SubmitCodePayload = {
  language: ProblemCodeLanguage
  sourceCode: string
}

export function runProblemCode(problemId: string | number, payload: RunCodePayload) {
  // TODO: API-PENDING - backend does not expose POST /api/problems/:problemId/run yet.
  return apiRequest<RunCodeResponse>(`/problems/${problemId}/run`, {
    method: 'POST',
    body: payload,
  })
}

export function getRunResult(runId: string) {
  // TODO: API-PENDING - backend does not expose GET /api/runs/:runId yet.
  return apiRequest<RunCodeResponse>(`/runs/${runId}`)
}

export function submitProblemCode(problemId: string | number, payload: SubmitCodePayload) {
  // TODO: API-PENDING - backend does not expose POST /api/problems/:problemId/submissions yet.
  return apiRequest<SubmitCodeResponse>(`/problems/${problemId}/submissions`, {
    method: 'POST',
    body: payload,
  })
}

export function getSubmissionResult(submissionId: string) {
  // TODO: API-PENDING - async judge polling result endpoint is not available yet.
  return apiRequest<SubmitCodeResponse>(`/submissions/${submissionId}`)
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
