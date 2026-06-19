import type { ReactNode } from 'react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type FooterBadgeProps = {
  icon: ReactNode
  text: string
}

export function FooterBadge({ icon, text }: FooterBadgeProps) {
  return (
    <span className={landingTokens.footer.badge}>
      <span className={landingTokens.footer.badgeIcon}>{icon}</span>
      {text}
    </span>
  )
}
