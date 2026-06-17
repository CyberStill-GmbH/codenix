import { Search } from 'lucide-react'

import type {
  Difficulty,
  ProblemSort,
  ProblemStatusFilter,
} from '@/features/problems/types/problem.types'

type ProblemFiltersProps = {
  query: string
  difficulty: Difficulty | 'All'
  status: ProblemStatusFilter
  sort: ProblemSort
  solvedCount: number
  totalCount: number
  onQueryChange: (query: string) => void
  onDifficultyChange: (difficulty: Difficulty | 'All') => void
  onStatusChange: (status: ProblemStatusFilter) => void
  onSortChange: (sort: ProblemSort) => void
}

export function ProblemFilters({
  query,
  difficulty,
  status,
  sort,
  solvedCount,
  totalCount,
  onQueryChange,
  onDifficultyChange,
  onStatusChange,
  onSortChange,
}: ProblemFiltersProps) {
  return (
    <section className="border-t border-slate-800 pt-5" aria-label="Filtros de problemas">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Buscar problemas</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search questions"
            className="h-11 w-full rounded-full border border-slate-700/50 bg-slate-900/70 pl-10 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value as Difficulty | 'All')}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Filtrar por dificultad"
          >
            <option value="All">Dificultad</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as ProblemStatusFilter)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos</option>
            <option value="solved">Resueltos</option>
            <option value="unsolved">No resueltos</option>
          </select>

          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ProblemSort)}
            className="h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
            aria-label="Ordenar problemas"
          >
            <option value="id-asc">Orden original</option>
            <option value="acceptance-desc">Mayor aceptacion</option>
            <option value="acceptance-asc">Menor aceptacion</option>
            <option value="difficulty-asc">Dificultad</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm text-[var(--color-text-muted)]">
        <span className="h-2.5 w-2.5 rounded-full border border-[var(--color-success)] bg-[var(--color-success-soft)]" />
        <span>
          <span className="font-mono text-[var(--color-text)]">{solvedCount}</span>/
          <span className="font-mono">{totalCount}</span> Solved
        </span>
      </div>
    </section>
  )
}
