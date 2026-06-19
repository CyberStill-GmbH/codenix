export type ProblemDifficulty = 'easy' | 'medium' | 'hard'

export type ProblemStatus = 'draft' | 'published'

export type TestcaseVisibility = 'sample' | 'hidden'

export type ProblemLanguage = 'typescript' | 'javascript' | 'python' | 'c' | 'rust'

export type ProblemParameterType =
  | 'number'
  | 'number[]'
  | 'string'
  | 'string[]'
  | 'boolean'
  | 'object'

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export interface AdminProblem {
  id: string
  title: string
  slug: string
  difficulty: ProblemDifficulty
  tags: string[]
  status: ProblemStatus
  testcasesCount: number
  updatedAt: string
}

export interface AdminTestcase {
  id: string
  problemId: string
  input: string
  expectedOutput: string
  visibility: TestcaseVisibility
  weight?: number
  createdAt: string
  updatedAt: string
}

export type AdminTestcasePayload = {
  input: string
  expectedOutput: string
  visibility: TestcaseVisibility
  weight?: number
}

export interface ProblemExample {
  id: string
  input: string
  output: string
  explanation?: string
}

export interface ProblemCodeTemplate {
  language: string
  starterCode: string
}

export interface ProblemParameter {
  id: string
  name: string
  type: ProblemParameterType
  description?: string
}

export interface StructuredProblemTestcase {
  id: string
  input: Record<string, JsonValue>
  expectedOutput: JsonValue
  isSample: boolean
}

export interface AdminProblemFormValues {
  title: string
  slug: string
  difficulty: ProblemDifficulty
  tags: string[]
  descriptionMarkdown: string
  constraintsList: string[]
  parameters: ProblemParameter[]
  outputType: ProblemParameterType
  testcases: StructuredProblemTestcase[]
  supportedLanguages: ProblemLanguage[]
  starterCode: Record<ProblemLanguage, string>
  timeLimitMs: number
  memoryLimitMb: number
  status: ProblemStatus
  // Legacy fields kept while older admin components are migrated out.
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
  examples: ProblemExample[]
  codeTemplates: ProblemCodeTemplate[]
}

export type AdminProblemDetails = AdminProblem & AdminProblemFormValues

export type AdminProblemDifficultyFilter = ProblemDifficulty | 'all'

export type AdminProblemStatusFilter = ProblemStatus | 'all'

export type AdminProblemFiltersState = {
  search: string
  difficulty: AdminProblemDifficultyFilter
  status: AdminProblemStatusFilter
  tag: string
}
