import { landingTokens } from '@/features/landing/theme/tokens'

export type ProgressBarRowProps = {
  label: string
  value: string
}

export function ProgressBarRow({ label, value }: ProgressBarRowProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-[0.625rem] text-[var(--color-text-muted)]">
          {label}
        </span>
        <span className="font-mono text-[0.625rem] text-[var(--color-text-soft)]">
          {value}
        </span>
      </div>

      <div className={landingTokens.hero.progressTrack}>
        <div className={landingTokens.hero.progressFill} style={{ width: value }} />
      </div>
    </div>
  )
}
