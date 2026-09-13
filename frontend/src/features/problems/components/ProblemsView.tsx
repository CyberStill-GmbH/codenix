import { BookOpen, CheckCircle2, ChevronRight, ListChecks, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { RefObject } from 'react'

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
  totalAvailable: number
  hasMore: boolean
  isLoadingMore: boolean
  loadMoreRef: RefObject<HTMLDivElement | null>
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
  totalAvailable,
  hasMore,
  isLoadingMore,
  loadMoreRef,
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
  const totalCount = totalAvailable || allProblems.length
  const mediumAndHard = allProblems.filter((problem) => problem.difficulty !== 'Easy').length

  if (isLoading && allProblems.length === 0 && !error) {
    return <SkeletonProblemList />
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="hidden lg:block" aria-label="Navegación de problemas">
        <div className="sticky top-20 space-y-7">
          <div>
            <p className="mb-3 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
              Biblioteca
            </p>
            <nav className="space-y-1">
              <Link
                to="/problems"
                className="flex items-center gap-3 rounded-lg bg-[var(--color-surface)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-xs)]"
                aria-current="page"
              >
                <BookOpen className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                Todos los problemas
              </Link>
              <Link
                to="/submissions"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
              >
                <ListChecks className="h-4 w-4" aria-hidden="true" />
                Mis envíos
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
              >
                <Target className="h-4 w-4" aria-hidden="true" />
                Mi progreso
              </Link>
            </nav>
          </div>

          <div className="border-t border-[var(--color-border-soft)] pt-5">
            <p className="mb-3 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">
              Atajos
            </p>
            <div className="space-y-1 px-3 text-xs leading-5 text-[var(--color-text-muted)]">
              <p className="flex items-center justify-between gap-2"><span>Resueltos</span><strong className="text-[var(--color-success)]">{solvedCount}</strong></p>
              <p className="flex items-center justify-between gap-2"><span>Por practicar</span><strong className="text-[var(--color-text)]">{Math.max(totalCount - solvedCount, 0)}</strong></p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
              Sigue practicando
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
              Un reto corto hoy mantiene el hábito activo.
            </p>
            <Link to="/problems" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)]">
              Ver retos <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 space-y-5">
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
          <div ref={loadMoreRef} className="flex min-h-14 items-center justify-center py-4" aria-live="polite">
            {isLoadingMore && <span className="text-xs font-semibold text-[var(--color-text-muted)]">Cargando más problemas…</span>}
            {!hasMore && allProblems.length > 0 && <span className="text-xs text-[var(--color-text-subtle)]">Has llegado al final de la biblioteca.</span>}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
