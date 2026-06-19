import type {
  ActivityDay,
  DifficultyProgress,
  Submission,
  UserStats,
} from '@/features/user/types/user.types'
import { apiRequest } from '@/shared/api/apiClient'

type BackendUserStats = {
  totalSubmissions: number
  acceptedSubmissions: number
  attemptedProblems: number
  solvedProblems: number
  acceptanceRate: number
  currentStreak: number
  rank: number
  percentile: number
  totalUsers: number
  distribution: Array<{
    bucket: string
    count: number
  }>
}

type BackendProgressResponse = {
  data: Array<{
    difficulty: 'easy' | 'medium' | 'hard'
    solved: number
    total: number
  }>
  totals: {
    solved: number
    total: number
  }
}

type BackendActivityResponse = {
  year: number
  data: ActivityDay[]
}

type BackendSubmissionListItem = {
  id: string
  problemId: string
  problemTitle: string
  problemSlug: string
  difficulty: 'easy' | 'medium' | 'hard'
  result:
    | 'Accepted'
    | 'Wrong Answer'
    | 'Runtime Error'
    | 'Time Limit Exceeded'
    | 'Compilation Error'
    | 'Pending'
  language: string
  submittedAt: string
  topics: string[]
}

type BackendSubmissionsResponse = {
  data: BackendSubmissionListItem[]
}

const emptyProgress: DifficultyProgress = {
  easy: { solved: 0, total: 0 },
  medium: { solved: 0, total: 0 },
  hard: { solved: 0, total: 0 },
}

const statusByBackendResult: Record<BackendSubmissionListItem['result'], Submission['status']> = {
  Accepted: 'accepted',
  'Wrong Answer': 'wrong_answer',
  'Runtime Error': 'runtime_error',
  'Time Limit Exceeded': 'time_limit_exceeded',
  'Compilation Error': 'compilation_error',
  Pending: 'pending',
}

export async function getUserStats(): Promise<UserStats> {
  return apiRequest<BackendUserStats>('/users/me/stats')
}

export async function getUserProgress(): Promise<DifficultyProgress> {
  const response = await apiRequest<BackendProgressResponse>('/users/me/progress')
  const progress: DifficultyProgress = structuredClone(emptyProgress)

  for (const item of response.data) {
    progress[item.difficulty] = {
      solved: item.solved,
      total: item.total,
    }
  }

  return progress
}

export async function getUserActivity(year: number): Promise<ActivityDay[]> {
  const response = await apiRequest<BackendActivityResponse>(`/users/me/activity?year=${year}`)
  return response.data
}

export async function getUserRecentSubmissions(limit = 10): Promise<Submission[]> {
  const params = new URLSearchParams({
    pageSize: String(limit),
    sort: 'submitted-desc',
  })

  const response = await apiRequest<BackendSubmissionsResponse>(`/submissions?${params.toString()}`)

  return response.data.map((submission) => ({
    id: submission.id,
    problemId: submission.problemId,
    problemSlug: submission.problemSlug,
    problemName: submission.problemTitle,
    difficulty: submission.difficulty,
    language: submission.language,
    status: statusByBackendResult[submission.result],
    submittedAt: submission.submittedAt,
    topics: submission.topics,
  }))
}
