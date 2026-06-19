import type { ReactNode } from 'react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type HeroDescriptionProps = {
  children: ReactNode
}

export function HeroDescription({ children }: HeroDescriptionProps) {
  return <p className={landingTokens.hero.description}>{children}</p>
}
