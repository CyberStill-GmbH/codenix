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
  bucket: string
  bucketRank: number
  bucketTotalUsers: number
  bucketPercentile: number
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
    | 'Memory Limit Exceeded'
    | 'Internal Error'
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
  'Memory Limit Exceeded': 'memory_limit_exceeded',
  'Internal Error': 'internal_error',
  Pending: 'pending',
}

export async function getUserStats(): Promise<UserStats> {
  return apiRequest<BackendUserStats>('/users/me/stats')
}

export type PublicProfileStats = {
  reputation: number
  profileViews: number
  reputationChange: number
  profileViewsChange: number
}

export type PublicProfile = PublicProfileStats & {
  id: string
  username: string
  name: string
  avatarUrl?: string
  degree?: string
  createdAt: string
  solvedSubmissions: number
  stats: UserStats
  progress: DifficultyProgress
  activityDays: ActivityDay[]
  recentSubmissions: Submission[]
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
  const response = await apiRequest<Partial<PublicProfile> & { recentSubmissions?: BackendSubmissionListItem[] }>(`/community/users/${encodeURIComponent(username)}/profile`)
  const solved = response.solvedSubmissions ?? 0
  const stats: UserStats = response.stats ?? {
    totalSubmissions: solved,
    acceptedSubmissions: solved,
    attemptedProblems: solved,
    solvedProblems: solved,
    acceptanceRate: solved > 0 ? 100 : 0,
    currentStreak: 0,
    rank: 0,
    percentile: 0,
    bucket: '0',
    bucketRank: 0,
    bucketTotalUsers: 0,
    bucketPercentile: 0,
    totalUsers: 0,
    distribution: [],
  }
  return {
    id: response.id ?? '',
    username: response.username ?? username,
    name: response.name ?? username,
    avatarUrl: response.avatarUrl,
    degree: response.degree,
    createdAt: response.createdAt ?? new Date().toISOString(),
    reputation: response.reputation ?? 0,
    profileViews: response.profileViews ?? 0,
    reputationChange: response.reputationChange ?? 0,
    profileViewsChange: response.profileViewsChange ?? 0,
    solvedSubmissions: solved,
    stats,
    progress: response.progress ?? emptyProgress,
    activityDays: response.activityDays ?? [],
    recentSubmissions: (response.recentSubmissions ?? []).map((submission) => ({
      id: submission.id,
      problemId: submission.problemId,
      problemSlug: submission.problemSlug,
      problemName: submission.problemTitle,
      difficulty: submission.difficulty,
      language: submission.language,
      status: statusByBackendResult[submission.result],
      submittedAt: submission.submittedAt,
      topics: submission.topics,
    })),
  }
}

export async function getPublicProfileStats(userId: string): Promise<PublicProfileStats> {
  const response = await apiRequest<PublicProfileStats>(`/community/users/${userId}/profile`)
  return {
    reputation: response.reputation ?? 0,
    profileViews: response.profileViews ?? 0,
    reputationChange: response.reputationChange ?? 0,
    profileViewsChange: response.profileViewsChange ?? 0,
  }
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

export type ChangeUsernameResponse = {
  message: string
  user: {
    id: string
    name?: string
    username: string
  }
}

export type ChangePasswordResponse = {
  message: string
}

export async function changeUsername(data: {
  name?: string
  newUsername?: string
}): Promise<ChangeUsernameResponse> {
  return apiRequest<ChangeUsernameResponse>('/users/me/username', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ChangePasswordResponse> {
  return apiRequest<ChangePasswordResponse>('/users/me/password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  })
}
