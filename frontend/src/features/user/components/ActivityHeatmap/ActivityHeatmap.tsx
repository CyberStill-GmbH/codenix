import { ChevronDown } from 'lucide-react'

import { UserCard } from '@/features/user/components/UserCard'
import { HeatmapGrid } from './HeatmapGrid'
import { getHeatmapColor } from './heatmapColorScale'
import { useActivityHeatmapData } from './useActivityHeatmapData'

export function ActivityHeatmap() {
  const data = useActivityHeatmapData()

  const totalSubmissions = data.reduce((acc, curr) => acc + curr.count, 0)
  const activeDays = data.filter((day) => day.count > 0).length

  let maxStreak = 0
  let currentStreak = 0
  for (const day of data) {
    if (day.count > 0) {
      currentStreak++
      if (currentStreak > maxStreak) maxStreak = currentStreak
    } else {
      currentStreak = 0
    }
  }

  return (
    <UserCard>
      <div className="p-5">
        <header className="mb-5 flex flex-col gap-4 border-b border-slate-700/40 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
              Actividad
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              <span className="font-mono font-semibold text-[var(--color-text)]">{totalSubmissions}</span> envios
              <span className="text-[var(--color-text-subtle)]"> · </span>
              <span className="font-mono font-semibold text-[var(--color-text)]">{activeDays}</span> dias activos
              <span className="text-[var(--color-text-subtle)]"> · </span>
              racha maxima de <span className="font-mono font-semibold text-[var(--color-text)]">{maxStreak}</span> dias
            </p>
          </div>

          <button className="inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 text-sm font-medium text-[var(--color-text-soft)] transition hover:bg-slate-800/70 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            Año actual
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="w-full overflow-x-auto scrollbar-thin pb-2">
          <div className="flex w-full min-w-max justify-center">
            <HeatmapGrid data={data} />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-1.5 text-[0.6875rem] text-[var(--color-text-subtle)]">
            <span>Menos</span>
            {[0, 1, 3, 6, 11].map((count) => (
              <span
                key={count}
                className="h-3 w-3 rounded-[2px] border border-slate-800/70"
                style={{ backgroundColor: getHeatmapColor(count) }}
                aria-hidden="true"
              />
            ))}
            <span>Más</span>
          </div>
        </div>
      </div>
    </UserCard>
  )
}
