import type { ComponentType, SVGProps } from 'react'

import { landingTokens } from '@/features/landing/theme/tokens'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export type StatCardProps = {
  icon: IconComponent
  label: string
  value: string
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className={landingTokens.hero.statCard}>
      <span className={landingTokens.hero.statIcon}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-4 text-[0.625rem] font-medium text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  )
}
