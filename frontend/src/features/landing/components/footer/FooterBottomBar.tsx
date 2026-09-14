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
        <img
          src="/ieee-logo.png"
          alt="IEEE Computer Society UNI"
          className="footer-ieee-mark"
        />
        <span className="footer-signature">Construyendo para la comunidad</span>
      </div>
    </div>
  )
}
