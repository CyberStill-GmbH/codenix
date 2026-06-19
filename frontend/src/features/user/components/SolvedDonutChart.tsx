import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { profileInsetSurfaceClassName } from '@/features/user/components/profileStyles'
import type { DifficultyProgress } from '@/features/user/types/user.types'

type SolvedDonutChartProps = {
  progress: DifficultyProgress
  acceptanceRate: number
  attempts: number
}

const difficultyItems = [
  { key: 'easy', label: 'Easy', color: 'var(--color-difficulty-easy)' },
  { key: 'medium', label: 'Medium', color: 'var(--color-difficulty-medium)' },
  { key: 'hard', label: 'Hard', color: 'var(--color-difficulty-hard)' },
] as const

export function SolvedDonutChart({
  progress,
  acceptanceRate,
  attempts,
}: SolvedDonutChartProps) {
  const items = difficultyItems.map((item) => ({
    ...item,
    solved: progress[item.key].solved,
    total: progress[item.key].total,
  }))
  const solved = items.reduce((total, item) => total + item.solved, 0)
  const total = items.reduce((sum, item) => sum + item.total, 0)
  const chartData = items.map((item) => ({
    name: item.label,
    value: Math.max(item.solved, 0.001),
  }))

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6.5rem] sm:items-center">
      <div className="group relative mx-auto h-[188px] w-[188px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={86}
              paddingAngle={2}
              stroke="rgba(15,23,42,0.86)"
              strokeWidth={4}
              isAnimationActive={false}
            >
              {items.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="transition duration-150 ease-out group-hover:scale-[0.98] group-hover:opacity-0">
            <span className="font-mono text-3xl font-bold leading-none text-[var(--color-text)]">
              {solved}
              <span className="text-base font-semibold text-[var(--color-text-muted)]">
                /{total}
              </span>
            </span>
            <span className="mt-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-text-soft)]">
              <span className="text-[var(--color-success)]">✓</span>
              Resueltos
            </span>
            <span className="mt-7 block text-xs font-semibold text-[var(--color-text-subtle)]">
              {attempts} Intentos
            </span>
          </div>

          <div className="absolute inset-0 flex scale-[1.02] flex-col items-center justify-center opacity-0 transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100">
            <span className="font-mono text-3xl font-bold leading-none text-[var(--color-accent)]">
              {acceptanceRate.toFixed(1)}%
            </span>
            <span className="mt-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
              Aceptacion
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={`rounded-lg px-2.5 py-2 text-center ${profileInsetSurfaceClassName}`}
          >
            <span
              className="block text-xs font-bold"
              style={{ color: item.color }}
            >
              {item.label}
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold tabular-nums text-[var(--color-text)]">
              {item.solved}
              <span className="text-[var(--color-text-subtle)]">/{item.total}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
