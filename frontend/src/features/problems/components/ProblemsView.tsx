import { DifficultySelector } from '@/features/problems/components/DifficultySelector'
import { ProblemTable } from '@/features/problems/components/ProblemTable'
import { SearchBar } from '@/features/problems/components/SearchBar'
import { SortSelector } from '@/features/problems/components/SortSelector'
import { StatusSelector } from '@/features/problems/components/StatusSelector'
import { SkeletonProblemList } from '@/components/skeletons/SkeletonProblemList'
import { TopicFilters } from '@/features/problems/components/TopicFilters'
import type {
  Difficulty,
  Problem,
  ProblemSort,
  ProblemStatusFilter,
} from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type ProblemsViewProps = {
  problems: Problem[]
  allProblems: Problem[]
  topics: string[]
  query: string
  selectedTopic: string
  difficulty: Difficulty | 'All'
  status: ProblemStatusFilter
  sort: ProblemSort
  isLoading: boolean
  error: string
  onSearch: (query: string) => void
  onTopicChange: (topic: string) => void
  onDifficultyChange: (difficulty: Difficulty | 'All') => void
  onStatusChange: (status: ProblemStatusFilter) => void
  onSortChange: (sort: ProblemSort) => void
}

export function ProblemsView({
  problems,
  allProblems,
  topics,
  query,
  selectedTopic,
  difficulty,
  status,
  sort,
  isLoading,
  error,
  onSearch,
  onTopicChange,
  onDifficultyChange,
  onStatusChange,
  onSortChange,
}: ProblemsViewProps) {
  const solvedCount = allProblems.filter((problem) => problem.solved).length
  const totalCount = allProblems.length
  const mediumAndHard = allProblems.filter((problem) => problem.difficulty !== 'Easy').length

  if (isLoading && allProblems.length === 0 && !error) {
    return <SkeletonProblemList />
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-5 border-b border-[var(--color-border-soft)] pb-5 lg:flex-row lg:items-end lg:justify-between" aria-labelledby="problems-page-title">
        <div>
          <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Biblioteca</p>
          <h1 id="problems-page-title" className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">Problemas</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-text-muted)]">Elige un reto, resuelve con intención y deja una señal de progreso.</p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs text-[var(--color-text-muted)]">
          <span><strong className="text-[var(--color-text)]">{totalCount}</strong> disponibles</span>
          <span><strong className="text-[var(--color-success)]">{solvedCount}</strong> resueltos</span>
          <span><strong className="text-[var(--color-text)]">{mediumAndHard}</strong> para subir nivel</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]">
        <TopicFilters topics={topics} selected={selectedTopic} onSelect={onTopicChange} />

        <div className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={query} onSearch={onSearch} />
          <div className="flex flex-wrap items-center gap-2">
            <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
            <StatusSelector value={status} onChange={onStatusChange} />
            <SortSelector value={sort} onChange={onSortChange} />
          </div>
        </div>

        {totalCount > 0 && (
          <div className="mt-4 flex items-center justify-end gap-2 text-sm text-[var(--color-text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full border border-emerald-300/40 bg-emerald-400/20" />
            <span>{t('status.solvedCount', { solved: solvedCount, total: totalCount })}</span>
          </div>
        )}
      </section>

      {isLoading && allProblems.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)]" role="status" aria-live="polite">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
          Actualizando resultados…
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
          {error}
        </div>
      )}
      {!error && (
        <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
          <ProblemTable problems={problems} />
        </div>
      )}
    </div>
  )
}
