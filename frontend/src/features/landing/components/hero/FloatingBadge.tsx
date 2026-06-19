import { landingTokens } from '@/features/landing/theme/tokens'

export type FloatingBadgeProps = {
  label: string
  value: string
}

export function FloatingBadge({ label, value }: FloatingBadgeProps) {
  return (
    <div className={landingTokens.hero.floatingBadge}>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[var(--color-success)]">
        {value}
      </p>
    </div>
  )
}
