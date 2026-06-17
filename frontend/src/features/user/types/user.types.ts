export type User = {
  id: string
  name: string
  username: string
  avatarUrl: string
  degree: string
  githubUrl: string
  linkedinUrl: string
  memberSince?: string
}

export type UserStats = {
  problemsSolved: number
  totalProblems: number
  submissionsCount: number
  mostUsedLanguage: string
  currentStreak: number
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
  problemId: number
  problemName: string
  difficulty: 'easy' | 'medium' | 'hard'
  language: string
  status: 'accepted' | 'wrong_answer' | 'pending'
  submittedAt: string
}
