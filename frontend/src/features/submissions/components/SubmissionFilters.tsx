import { Filter, Search } from 'lucide-react'

import type {
  SubmissionDifficultyFilter,
  SubmissionResultFilter,
  SubmissionSort,
} from '@/features/submissions/types/submission.types'

type SubmissionFiltersProps = {
  query: string
  result: SubmissionResultFilter
  difficulty: SubmissionDifficultyFilter
  topic: string
  topics: string[]
  sort: SubmissionSort
  onQueryChange: (query: string) => void
  onResultChange: (result: SubmissionResultFilter) => void
  onDifficultyChange: (difficulty: SubmissionDifficultyFilter) => void
  onTopicChange: (topic: string) => void
  onSortChange: (sort: SubmissionSort) => void
}

export function SubmissionFilters({
  query,
  result,
  difficulty,
  topic,
  topics,
  sort,
  onQueryChange,
  onResultChange,
  onDifficultyChange,
  onTopicChange,
  onSortChange,
}: SubmissionFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Buscar envio</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search submissions"
            className="h-11 w-full rounded-full border border-slate-700/50 bg-slate-900/70 pl-10 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <span className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm font-semibold text-[var(--color-text-muted)]">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </span>

          <select
            value={result}
            onChange={(event) => onResultChange(event.target.value as SubmissionResultFilter)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Filtrar por resultado"
          >
            <option value="All">Resultado</option>
            <option value="Accepted">Accepted</option>
            <option value="Wrong Answer">Wrong Answer</option>
            <option value="Runtime Error">Runtime Error</option>
            <option value="Time Limit Exceeded">Time Limit Exceeded</option>
            <option value="Compilation Error">Compilation Error</option>
          </select>

          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value as SubmissionDifficultyFilter)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Filtrar por dificultad"
          >
            <option value="All">Dificultad</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={topic}
            onChange={(event) => onTopicChange(event.target.value)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Filtrar por tema"
          >
            <option value="All">Tema</option>
            {topics.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SubmissionSort)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Ordenar envios"
          >
            <option value="submitted-desc">Mas recientes</option>
            <option value="submitted-asc">Mas antiguos</option>
            <option value="submissions-desc">Mas intentos</option>
            <option value="acceptance-desc">Mayor aceptacion</option>
          </select>
        </div>
      </div>
    </section>
  )
}
