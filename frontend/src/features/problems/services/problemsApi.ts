import type {
  Difficulty,
  Problem,
  ProblemCodeLanguage,
  ProblemCodeTemplate,
  ProblemSort,
} from '@/features/problems/types/problem.types'
import { apiRequest } from '@/shared/api/apiClient'

type ProblemsQuery = {
  query: string
  difficulty: Difficulty | 'All'
  topic: string
  sort: ProblemSort
}

type BackendProblemListItem = {
  id: string
  numericId: number
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard'
  acceptance: number
  solved: boolean
  topics: string[]
}

type BackendProblemDetail = BackendProblemListItem & {
  statement?: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string
  examples?: Array<{
    id: string
    input: string
    output: string
    explanation?: string | null
  }>
  codeTemplates?: Array<{
    language: string
    starterCode: string
  }>
}

type ProblemsResponse = {
  data: BackendProblemListItem[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

type TopicsResponse = {
  data: Array<{
    id: string
    name: string
    slug: string
  }>
}

export type ProblemSearchResult = {
  id: string
  numericId: number
  title: string
  slug: string
  difficulty: Difficulty
  topics: string[]
}

type ProblemSearchResponse = {
  data: Array<{
    id: string
    numericId: number
    title: string
    slug: string
    difficulty: 'easy' | 'medium' | 'hard'
    topics: string[]
  }>
}

const difficultyLabel: Record<BackendProblemListItem['difficulty'], Difficulty> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const difficultyQueryByLabel: Partial<Record<Difficulty | 'All', string>> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}

const languageLabel: Record<ProblemCodeLanguage, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  c: 'C',
  rust: 'Rust',
}

const supportedLanguages: ProblemCodeLanguage[] = [
  'typescript',
  'javascript',
  'python',
  'c',
  'rust',
]

export async function getProblems(query: ProblemsQuery): Promise<Problem[]> {
  const params = new URLSearchParams({
    pageSize: '50',
    sort: mapProblemSort(query.sort),
  })
  const difficulty = difficultyQueryByLabel[query.difficulty]

  if (query.query.trim()) params.set('search', query.query.trim())
  if (difficulty) params.set('difficulty', difficulty)
  if (query.topic !== 'All Topics') params.set('topic', query.topic)

  const response = await apiRequest<ProblemsResponse>(`/problems?${params.toString()}`)

  return response.data.map(mapProblemListItem)
}

export async function getProblemBySlug(slug: string): Promise<Problem | undefined> {
  const response = await apiRequest<BackendProblemDetail>(`/problems/${slug}`)
  return mapProblemDetail(response)
}

export async function getProblemTopics(): Promise<string[]> {
  const response = await apiRequest<TopicsResponse>('/problems/topics', {
    skipAuth: true,
  })
  return response.data.map((topic) => topic.name).sort((a, b) => a.localeCompare(b))
}

export async function searchProblems(query: string, limit = 8): Promise<ProblemSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  })

  const response = await apiRequest<ProblemSearchResponse>(`/problems/search?${params.toString()}`, {
    skipAuth: true,
  })

  return response.data.map((problem) => ({
    ...problem,
    difficulty: difficultyLabel[problem.difficulty],
  }))
}

function mapProblemSort(sort: ProblemSort) {
  if (sort === 'acceptance-desc' || sort === 'acceptance-asc') return sort
  return 'numeric-asc'
}

function mapProblemListItem(problem: BackendProblemListItem): Problem {
  return {
    id: problem.numericId,
    apiId: problem.id,
    title: problem.title,
    slug: problem.slug,
    difficulty: difficultyLabel[problem.difficulty],
    acceptance: problem.acceptance,
    solved: problem.solved,
    topics: problem.topics,
    codeTemplates: [],
    examples: [],
  }
}

function mapProblemDetail(problem: BackendProblemDetail): Problem {
  const codeTemplates = mapCodeTemplates(problem.codeTemplates)

  return {
    ...mapProblemListItem(problem),
    statement: problem.statement,
    inputFormat: problem.inputFormat,
    outputFormat: problem.outputFormat,
    constraints: problem.constraints,
    examples:
      problem.examples?.map((example) => ({
        id: example.id,
        input: example.input,
        output: example.output,
        explanation: example.explanation ?? undefined,
      })) ?? [],
    codeTemplates,
  }
}

function mapCodeTemplates(
  templates: BackendProblemDetail['codeTemplates'],
): ProblemCodeTemplate[] {
  return (
    templates
      ?.map((template) => {
        const language = normalizeLanguage(template.language)
        if (!language) return null

        return {
          language,
          label: languageLabel[language],
          starterCode: template.starterCode,
        }
      })
      .filter((template): template is ProblemCodeTemplate => Boolean(template)) ?? []
  )
}

function normalizeLanguage(language: string): ProblemCodeLanguage | null {
  const normalized = language.toLowerCase()
  if (supportedLanguages.includes(normalized as ProblemCodeLanguage)) {
    return normalized as ProblemCodeLanguage
  }
  return null
}
