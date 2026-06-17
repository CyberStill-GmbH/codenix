import { landingTokens } from '@/features/landing/theme/tokens'

export type ProblemListItemProps = {
  title: string
  status: string
  difficulty: string
}

export function ProblemListItem({
  title,
  status,
  difficulty,
}: ProblemListItemProps) {
  return (
    <div className={landingTokens.hero.problemItem}>
      <span className="h-2 w-2 rounded-[var(--radius-full)] bg-[var(--color-accent)]" />

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[var(--color-text)]">
          {title}
        </p>
        <p className="truncate text-[0.625rem] text-[var(--color-text-muted)]">
          {status}
        </p>
      </div>

      <span className={landingTokens.hero.difficultyPill}>{difficulty}</span>
    </div>
  )
}
