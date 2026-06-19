export type User = {
  id: string
  name: string
  username: string
  email?: string
  avatarUrl: string
  degree: string
  githubUrl: string
  linkedinUrl: string
  memberSince?: string
  role?: 'user' | 'admin'
}

export type UserStats = {
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

export type DifficultyProgress = {
  easy: {
    solved: number
    total: number
  }
  medium: {
    solved: number
    total: number
  }
  hard: {
    solved: number
    total: number
  }
}

export type Submission = {
  id: string
  problemId: string | number
  problemSlug?: string
  problemName: string
  difficulty: 'easy' | 'medium' | 'hard'
  language: string
  status:
    | 'accepted'
    | 'wrong_answer'
    | 'time_limit_exceeded'
    | 'runtime_error'
    | 'compilation_error'
    | 'pending'
  submittedAt: string
  topics?: string[]
}

export type ActivityDay = {
  date: string
  count: number
  accepted: number
}
