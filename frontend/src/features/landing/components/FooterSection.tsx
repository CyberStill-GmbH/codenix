import { footerGroups } from '@/features/landing/constants/landingContent'
import { FooterBottomBar } from '@/features/landing/components/footer/FooterBottomBar'
import { FooterBrand } from '@/features/landing/components/footer/FooterBrand'
import { FooterLinkGroup } from '@/features/landing/components/footer/FooterLinkGroup'
import { landingTokens } from '@/features/landing/theme/tokens'

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={landingTokens.footer.shell}>
      <div className={landingTokens.footer.inner}>
        <div className={landingTokens.footer.grid}>
          <FooterBrand />

          <div className={landingTokens.footer.groupGrid}>
            {footerGroups.map((group) => (
              <FooterLinkGroup key={group.title} group={group} />
            ))}
          </div>
        </div>

        <FooterBottomBar year={currentYear} />
      </div>
    </footer>
  )
}
