import type {
  Difficulty,
  Submission,
  SubmissionDifficultyFilter,
  SubmissionResult,
  SubmissionResultFilter,
  SubmissionSort,
} from '@/features/submissions/types/submission.types'
import { apiRequest } from '@/shared/api/apiClient'

type SubmissionsQuery = {
  result: SubmissionResultFilter
  difficulty: SubmissionDifficultyFilter
  topic: string
  sort: SubmissionSort
}

type BackendSubmission = {
  id: string
  problemId: string
  problemTitle: string
  problemSlug: string
  difficulty: 'easy' | 'medium' | 'hard'
  result: SubmissionResult
  language: string
  submittedAt: string
  executionTimeMs: number | null
  memoryKb: number | null
  submissionsCount: number
  acceptance: number
  topics: string[]
}

type SubmissionsResponse = {
  data: BackendSubmission[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

const difficultyLabel: Record<BackendSubmission['difficulty'], Difficulty> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const resultQueryByLabel: Partial<Record<SubmissionResultFilter, string>> = {
  Accepted: 'accepted',
  'Wrong Answer': 'wrong_answer',
  'Runtime Error': 'runtime_error',
  'Time Limit Exceeded': 'time_limit_exceeded',
  'Compilation Error': 'compilation_error',
}

const difficultyQueryByLabel: Partial<Record<SubmissionDifficultyFilter, string>> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

export async function getSubmissions(query: SubmissionsQuery): Promise<Submission[]> {
  const params = new URLSearchParams({
    pageSize: '50',
    sort:
      query.sort === 'submitted-asc' || query.sort === 'submitted-desc'
        ? query.sort
        : 'submitted-desc',
  })

  const result = resultQueryByLabel[query.result]
  const difficulty = difficultyQueryByLabel[query.difficulty]

  if (result) params.set('result', result)
  if (difficulty) params.set('difficulty', difficulty)
  if (query.topic !== 'All') params.set('topic', query.topic)

  const response = await apiRequest<SubmissionsResponse>(`/submissions?${params.toString()}`)
  return response.data.map(mapSubmission)
}

function mapSubmission(submission: BackendSubmission): Submission {
  return {
    id: submission.id,
    problemId: submission.problemId,
    problemTitle: submission.problemTitle,
    problemSlug: submission.problemSlug,
    difficulty: difficultyLabel[submission.difficulty],
    result: submission.result,
    submittedAt: submission.submittedAt,
    submissionsCount: submission.submissionsCount,
    acceptance: submission.acceptance,
    topics: submission.topics,
  }
}
