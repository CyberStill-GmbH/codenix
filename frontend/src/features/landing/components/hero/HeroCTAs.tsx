import { ArrowRight } from 'lucide-react'

import { LandingButton } from '@/features/landing/components/common/LandingButton'
import { landingTokens } from '@/features/landing/theme/tokens'

export type HeroCTAsProps = {
  primaryLabel: string
  primaryTo: string
  secondaryLabel: string
  secondaryHref: string
}

export function HeroCTAs({
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryHref,
}: HeroCTAsProps) {
  return (
    <div className={landingTokens.hero.ctas}>
      <LandingButton
        to={primaryTo}
        variant="primary"
        icon={<ArrowRight className="h-4 w-4" />}
      >
        {primaryLabel}
      </LandingButton>

      <LandingButton href={secondaryHref} variant="ghost">
        {secondaryLabel}
      </LandingButton>
    </div>
  )
}
