import type { DifficultyProgress, UserStats } from '@/features/user/types/user.types'

type UserProgressPanelProps = {
  progress: DifficultyProgress
  stats: UserStats
}

type DifficultyKey = keyof DifficultyProgress

const difficultyConfig: Record<DifficultyKey, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'var(--color-difficulty-easy)' },
  medium: { label: 'Medium', color: 'var(--color-difficulty-medium)' },
  hard: { label: 'Hard', color: 'var(--color-difficulty-hard)' },
}

export function UserProgressPanel({ progress, stats }: UserProgressPanelProps) {
  // TODO: API - GET /api/users/me/progress
  const items = (Object.keys(progress) as DifficultyKey[]).map((key) => ({
    key,
    ...difficultyConfig[key],
    solved: progress[key].solved,
    total: progress[key].total,
  }))

  return (
    <div className="flex flex-1 flex-col p-6">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Problemas resueltos
      </p>
      <p className="mt-2 font-mono text-4xl font-bold leading-none text-[var(--color-text)]">
        {stats.problemsSolved}
        <span className="mx-1 text-2xl font-normal text-[var(--color-text-subtle)]">/</span>
        <span className="text-2xl font-semibold text-[var(--color-text-muted)]">{stats.totalProblems}</span>
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {items.map((item) => {
          const pct = item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0

          return (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: item.color }}>
                  {item.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-[var(--color-text-muted)]">
                  {item.solved}
                  <span className="text-[var(--color-text-subtle)]">/{item.total}</span>
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80"
                role="progressbar"
                aria-valuenow={item.solved}
                aria-valuemin={0}
                aria-valuemax={item.total}
                aria-label={`${item.label}: ${item.solved} de ${item.total}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-700/40 pt-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Aceptacion
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-text)]">38.1%</p>
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Envios
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-text)]">
            {stats.submissionsCount}
          </p>
        </div>
      </div>
    </div>
  )
}
