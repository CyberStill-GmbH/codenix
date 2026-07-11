import { Link } from 'react-router-dom'

import type { FooterLink } from '@/features/landing/types/landing.types'
import { landingTokens } from '@/features/landing/theme/tokens'
import { cn } from '@/shared/lib/utils'

export type FooterLinkItemProps = {
  link: FooterLink
}

export function FooterLinkItem({ link }: FooterLinkItemProps) {
  const badge = link.badge ? (
    <span className={landingTokens.footer.linkBadge}>{link.badge}</span>
  ) : null

  if (link.href.startsWith('#')) {
    return (
      <a href={link.href} className={cn(landingTokens.footer.link, landingTokens.focus)}>
        {link.label}
        {badge}
      </a>
    )
  }

  return (
    <Link to={link.href} className={cn(landingTokens.footer.link, landingTokens.focus)}>
      {link.label}
      {badge}
    </Link>
  )
}
