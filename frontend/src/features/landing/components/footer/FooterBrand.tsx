import { Code2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import logo from '@/assets/icons/logo.png'
import { FooterBadge } from '@/features/landing/components/footer/FooterBadge'
import { landingTokens } from '@/features/landing/theme/tokens'
import { cn } from '@/shared/lib/utils'

export function FooterBrand() {
  return (
    <div className={landingTokens.footer.brand}>
      <Link
        to="/"
        className={cn(landingTokens.footer.brandLink, landingTokens.focus)}
        aria-label="Codenix — Inicio"
      >
        <span
          className={`h-7 w-7 shrink-0 ${landingTokens.color.logo}`}
          style={{
            mask: `url(${logo}) center / contain no-repeat`,
            WebkitMask: `url(${logo}) center / contain no-repeat`,
          }}
          aria-hidden="true"
        />
        <span className={landingTokens.footer.brandText}>Codenix</span>
      </Link>

      <p className={landingTokens.footer.description}>
        Plataforma de IEEE Computer Society UNI para centralizar la práctica de
        algoritmos, el progreso técnico y la preparación para competencias de
        programación.
      </p>

      <div className={landingTokens.footer.badgeRow}>
        <FooterBadge
          icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
          text="IEEE CS UNI"
        />
        <FooterBadge
          icon={<Code2 className="h-3.5 w-3.5" aria-hidden="true" />}
          text="Práctica algorítmica"
        />
      </div>
    </div>
  )
}
