import type { ProblemCodeLanguage } from '@/features/problems/types/problem.types'

export type JudgeStatus =
  | 'accepted'
  | 'wrong_answer'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'compilation_error'
  | 'memory_limit_exceeded'
  | 'pending'

export type CodingTestcase = {
  id: string
  input: string
  expectedOutput: string
  isCustom?: boolean
}

export type TestcaseRunResult = {
  id: string
  index: number
  passed: boolean
  input: string
  expectedOutput?: string
  actualOutput?: string
  stdout?: string
  stderr?: string
  executionTimeMs?: number
  memoryKb?: number
  error?: string
}

export type RuntimeDistributionPoint = {
  runtimeMs: number
  submissions: number
}

export type JudgeError = {
  message: string
  line?: number
  stderr?: string
}

export type RunCodeResponse = {
  id?: string
  status: JudgeStatus
  stdout?: string
  stderr?: string
  executionTimeMs?: number
  memoryKb?: number
  testcases?: TestcaseRunResult[]
  error?: JudgeError
}

export type SubmitCodeResponse = {
  id?: string
  status: JudgeStatus
  passedCases?: number
  totalCases?: number
  executionTimeMs?: number
  memoryKb?: number
  language?: ProblemCodeLanguage
  failedCase?: TestcaseRunResult
  error?: JudgeError
  runtimePercentile?: number
  runtimeDistribution?: RuntimeDistributionPoint[]
}

export type ProblemSubmission = {
  id: string
  problemId: string
  result: string
  language: string
  submittedAt: string
  executionTimeMs?: number
  memoryKb?: number
  sourceCode?: string
}

export type SubmissionDetail = ProblemSubmission & {
  problemTitle: string
  problemSlug: string
  difficulty: string
  topics: string[]
  stdout?: string | null
  stderr?: string | null
  error?: string | null
  stackTrace?: string | null
  testcaseResults: Array<{
    id: string
    testcaseId: string
    visibility: string
    input: string
    expectedOutput: string
    actualOutput?: string | null
    error?: string | null
    passed: boolean
    executionTimeMs?: number | null
    memoryKb?: number | null
  }>
}

export type PaginatedProblemSubmissions = {
  data: ProblemSubmission[]
  meta?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
