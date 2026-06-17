import { Check, Lock, Star } from 'lucide-react'

import type { Difficulty, Problem } from '@/features/problems/types/problem.types'

type ProblemListProps = {
  problems: Problem[]
}

const difficultyClassName: Record<Difficulty, string> = {
  Easy: 'text-[var(--color-difficulty-easy)]',
  Medium: 'text-[var(--color-difficulty-medium)]',
  Hard: 'text-[var(--color-difficulty-hard)]',
}

export function ProblemList({ problems }: ProblemListProps) {
  if (problems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-8 text-center">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          No encontramos problemas
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Ajusta la busqueda o cambia los filtros para ver mas resultados.
        </p>
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="hidden grid-cols-[3rem_minmax(0,1fr)_8rem_7rem_4rem] border-b border-slate-800 px-5 py-3 md:grid">
        {['', 'Problema', 'Aceptacion', 'Dificultad', ''].map((heading) => (
          <span
            key={heading || 'status'}
            className="text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]"
          >
            {heading}
          </span>
        ))}
      </div>

      <div className="space-y-2 p-3">
        {problems.map((problem, index) => {
          const rowSurface = index % 2 === 0 ? 'bg-slate-900/55' : 'bg-transparent'

          return (
            <button
              key={problem.id}
              type="button"
              onClick={() => console.log('Problem selected: ', problem.slug)}
              className={`grid min-h-14 w-full gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:grid-cols-[2rem_minmax(0,1fr)_8rem_7rem_4rem] md:items-center ${rowSurface}`}
            >
              <div className="flex items-center">
                {problem.solved ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]" aria-label="Problema resuelto">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="h-6 w-6" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {problem.id}. {problem.title}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5 md:hidden">
                  <span className={`text-xs font-semibold ${difficultyClassName[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    {problem.acceptance.toFixed(1)}%
                  </span>
                </div>
              </div>

              <span className="hidden font-mono text-sm text-[var(--color-text-muted)] md:block">
                {problem.acceptance.toFixed(1)}%
              </span>

              <span className={`hidden text-sm font-semibold md:block ${difficultyClassName[problem.difficulty]}`}>
                {problem.difficulty}
              </span>

              <div className="hidden items-center justify-end gap-2 text-[var(--color-text-subtle)] md:flex">
                {problem.isLocked && <Lock className="h-4 w-4" aria-label="Bloqueado" />}
                {problem.isFavorite && <Star className="h-4 w-4 fill-[var(--color-warning)] text-[var(--color-warning)]" aria-label="Favorito" />}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
