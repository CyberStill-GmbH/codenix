import { GitBranch } from 'lucide-react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type FooterBottomBarProps = {
  year: number
}

export function FooterBottomBar({ year }: FooterBottomBarProps) {
  return (
    <div className={landingTokens.footer.bottom}>
      <p className={landingTokens.footer.bottomText}>
        © {year} Codenix — IEEE Computer Society UNI.
      </p>

      <div className={landingTokens.footer.bottomMeta}>
        <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Construido como plataforma propia de práctica.</span>
      </div>
    </div>
  )
}
