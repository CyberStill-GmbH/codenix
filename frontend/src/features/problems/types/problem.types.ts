export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Problem = {
  id: number
  title: string
  slug: string
  difficulty: Difficulty
  acceptance: number
  solved: boolean
  topics: string[]
  isLocked?: boolean
  isFavorite?: boolean
}

export type ProblemStatusFilter = 'all' | 'solved' | 'unsolved'

export type ProblemSort = 'id-asc' | 'acceptance-desc' | 'acceptance-asc' | 'difficulty-asc'
