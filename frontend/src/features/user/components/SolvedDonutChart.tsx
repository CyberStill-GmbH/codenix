import { useReducedMotion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { profileInsetSurfaceClassName } from '@/features/user/components/profileStyles'
import type { DifficultyProgress } from '@/features/user/types/user.types'

type SolvedDonutChartProps = {
  progress: DifficultyProgress
  acceptanceRate: number
  attempts: number
}

const difficultyItems = [
  {
    key: 'easy',
    label: 'Fácil',
    color: 'var(--color-difficulty-easy)',
    labelClassName: 'text-[var(--color-difficulty-easy)]',
  },
  {
    key: 'medium',
    label: 'Medio',
    color: 'var(--color-difficulty-medium)',
    labelClassName: 'text-[var(--color-difficulty-medium)]',
  },
  {
    key: 'hard',
    label: 'Difícil',
    color: 'var(--color-difficulty-hard)',
    labelClassName: 'text-[var(--color-difficulty-hard)]',
  },
] as const

export function SolvedDonutChart({
  progress,
  acceptanceRate,
  attempts,
}: SolvedDonutChartProps) {
  const reducedMotion = useReducedMotion()
  const items = difficultyItems.map((item) => ({
    ...item,
    solved: progress[item.key].solved,
    total: progress[item.key].total,
  }))
  const solved = items.reduce((total, item) => total + item.solved, 0)
  const total = items.reduce((sum, item) => sum + item.total, 0)
  const chartData = items.flatMap((item) => [
    {
      name: `${item.label} resueltos`,
      value: item.solved,
      color: item.color,
    },
    {
      name: `${item.label} restantes`,
      value: Math.max(item.total - item.solved, 0),
      color: 'var(--color-bg-muted)',
    },
  ])
  const safeChartData = total > 0
    ? chartData
    : [{ name: 'Sin problemas', value: 1, color: 'var(--color-bg-muted)' }]

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_6.5rem] sm:items-center">
      <div className="group relative mx-auto h-[188px] w-[188px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={86}
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={3}
              isAnimationActive={!reducedMotion}
              animationDuration={reducedMotion ? 0 : 800}
              animationBegin={reducedMotion ? 0 : 80}
            >
              {safeChartData.map((slice, index) => (
                <Cell key={`${slice.name}-${index}`} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-bold leading-none text-[var(--color-text)]">
                {solved}
                <span className="text-base font-semibold text-[var(--color-text-muted)]">/{total}</span>
              </span>
              <span className="mt-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-text-soft)]">
                <span className="text-[var(--color-success)]">✓</span>
                Resueltos
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className={`rounded-lg px-2.5 py-2 text-center ${profileInsetSurfaceClassName}`}
          >
            <span className={`block text-xs font-bold ${item.labelClassName}`}>
              {item.label}
            </span>
            <span className="mt-0.5 block font-mono text-sm font-bold tabular-nums text-[var(--color-text)]">
              {item.solved}
              <span className="text-[var(--color-text-subtle)]">/{item.total}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 border-t border-[var(--color-border-soft)] pt-3 text-[0.6875rem] font-semibold text-[var(--color-text-muted)] sm:col-span-2">
        <span>Tasa de aceptación <strong className="text-[var(--color-text)]">{acceptanceRate.toFixed(1)}%</strong></span>
        <span className="text-[var(--color-text-subtle)]">·</span>
        <span>{attempts.toLocaleString()} intentos</span>
      </div>
    </div>
  )
}
