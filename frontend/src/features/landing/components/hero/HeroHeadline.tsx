import type { ReactNode } from 'react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type HeroHeadlineProps = {
  children: ReactNode
  id?: string
}

export function HeroHeadline({ children, id }: HeroHeadlineProps) {
  return (
    <h1 id={id} className={landingTokens.hero.headline}>
      {children}
    </h1>
  )
}
