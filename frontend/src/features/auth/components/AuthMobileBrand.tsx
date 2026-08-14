import { Link } from 'react-router-dom'

import { authBrandContent } from '@/features/auth/constants/authContent'
import { landingTokens } from '@/features/landing/theme/tokens'

export function AuthMobileBrand() {
  return (
    <div className={landingTokens.auth.mobileBrand}>
      <Link
        to="/"
        className={`${landingTokens.auth.mobileLogoLink} items-center gap-3 ${landingTokens.focus}`}
        aria-label={`Volver al inicio de ${authBrandContent.title}`}
      >
        <img
          src="/favicon.svg"
          className={landingTokens.auth.mobileLogo}
          alt=""
          aria-hidden="true"
        />
        <span className={landingTokens.auth.brandLockupText}>
          <span className={landingTokens.auth.brandLockupName}>
            {authBrandContent.title}
          </span>
        </span>
      </Link>
    </div>
  )
}
