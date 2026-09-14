import type { DifficultyProgress, UserStats } from '@/features/user/types/user.types'
import { SolvedDonutChart } from '@/features/user/components/SolvedDonutChart'

type UserProgressPanelProps = {
  progress: DifficultyProgress
  stats: UserStats
}

export function UserProgressPanel({ progress, stats }: UserProgressPanelProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <h2 className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Problemas resueltos
      </h2>
      <div className="mt-4">
        <SolvedDonutChart
          progress={progress}
          acceptanceRate={stats.acceptanceRate}
          attempts={stats.totalSubmissions}
        />
      </div>
    </div>
  )
}
