export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type ProblemCodeLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'cpp'

export type ProblemCodeTemplate = {
  language: ProblemCodeLanguage
  label: string
  starterCode: string
}

export type ProblemExample = {
  id: string
  input: string
  output: string
  explanation?: string
}

export type Problem = {
  id: number
  apiId?: string
  title: string
  slug: string
  difficulty: Difficulty
  acceptance: number
  solved: boolean
  topics: string[]
  statement?: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string
  codeTemplates: ProblemCodeTemplate[]
  examples: ProblemExample[]
  isLocked?: boolean
  isFavorite?: boolean
}

export type ProblemStatusFilter = 'all' | 'solved' | 'unsolved'

export type ProblemSort = 'id-asc' | 'acceptance-desc' | 'acceptance-asc' | 'difficulty-asc'
