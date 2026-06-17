export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type SubmissionResult =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Compilation Error'

export type Submission = {
  id: string
  problemId: number
  problemTitle: string
  problemSlug: string
  difficulty: Difficulty
  result: SubmissionResult
  submittedAt: string
  submissionsCount: number
  acceptance: number
  topics: string[]
}

export type SubmissionResultFilter = SubmissionResult | 'All'
export type SubmissionDifficultyFilter = Difficulty | 'All'
export type SubmissionSort = 'submitted-desc' | 'submitted-asc' | 'submissions-desc' | 'acceptance-desc'
