import { landingTokens } from '@/features/landing/theme/tokens'

export type TrustBadgeItem = {
  value: string
  label: string
}

export type TrustBadgesProps = {
  items: TrustBadgeItem[]
}

export function TrustBadges({ items }: TrustBadgesProps) {
  const primary = items.find((item) => item.value === 'IEEE') ?? items[0]
  const context = items.find((item) => item.value === 'CP')

  return (
    <div className={landingTokens.hero.trust}>
      <span className={landingTokens.hero.trustMark}>{primary.value}</span>
      <span>
        Respaldado por {primary.label}
        {context ? ` para ${context.label.toLowerCase()}` : ''}
      </span>
    </div>
  )
}
