import type { Difficulty } from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type DifficultyBadgeProps = {
  difficulty: Difficulty
}

const badgeClassName: Record<Difficulty, string> = {
  Easy: 'border-cyan-300/30 bg-cyan-400/12 text-cyan-200',
  Medium: 'border-amber-300/35 bg-amber-400/12 text-amber-200',
  Hard: 'border-rose-300/35 bg-rose-400/12 text-rose-200',
}

const labelKey: Record<Difficulty, string> = {
  Easy: 'difficulty.easy',
  Medium: 'difficulty.medium',
  Hard: 'difficulty.hard',
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-bold ${badgeClassName[difficulty]}`}
    >
      {t(labelKey[difficulty])}
    </span>
  )
}
