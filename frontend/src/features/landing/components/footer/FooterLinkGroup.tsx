import { FooterLinkItem } from '@/features/landing/components/footer/FooterLinkItem'
import type { FooterGroup } from '@/features/landing/types/landing.types'
import { landingTokens } from '@/features/landing/theme/tokens'

export type FooterLinkGroupProps = {
  group: FooterGroup
}

export function FooterLinkGroup({ group }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className={landingTokens.footer.heading}>
        {group.title}
      </h3>

      <ul className={landingTokens.footer.list} role="list">
        {group.links.map((link) => (
          <li key={link.label}>
            <FooterLinkItem link={link} />
          </li>
        ))}
      </ul>
    </div>
  )
}
