import type { ReactNode } from 'react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type HeroBadgeProps = {
  children: ReactNode
  icon?: ReactNode
}

export function HeroBadge({ children, icon }: HeroBadgeProps) {
  return (
    <span className={landingTokens.hero.badge}>
      {icon && (
        <span className={landingTokens.color.primaryText} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
