import { Link } from 'react-router-dom'

import logo from '@/assets/icons/logo.png'
import {
  AUTH_GLOBE_VIDEO_URL,
  authBrandContent,
} from '@/features/auth/constants/authContent'
import { landingTokens } from '@/features/landing/theme/tokens'
import { cn } from '@/shared/lib/utils'

export function AuthBrandPanel() {
  return (
    <aside className={landingTokens.auth.brandPanel}>
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60 [object-position:center_center]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={AUTH_GLOBE_VIDEO_URL} type="video/mp4" />
      </video>

      <div className={landingTokens.auth.brandOverlay} aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,20,0.08)_0%,rgba(5,9,20,0.22)_42%,rgba(5,9,20,0.92)_100%)]"
        aria-hidden="true"
      />

      <div className={landingTokens.auth.brandInner}>
        <Link
          to="/"
          className={cn(
            landingTokens.auth.brandLogoLink,
            'items-center gap-3',
            landingTokens.focus,
          )}
          aria-label={`Volver al inicio de ${authBrandContent.title}`}
        >
          <span
            className={landingTokens.auth.brandLogo}
            style={{
              mask: `url(${logo}) center / contain no-repeat`,
              WebkitMask: `url(${logo}) center / contain no-repeat`,
            }}
            aria-hidden="true"
          />
        </Link>

        <section className={landingTokens.auth.brandContent}>
          <p className={landingTokens.auth.brandEyebrow}>
            {authBrandContent.eyebrow}
          </p>

          <h2 className={landingTokens.auth.brandTitle}>
            {authBrandContent.title}
            <br />
            <span
              className={landingTokens.auth.brandEmphasis}
              style={{
                backgroundImage: 'var(--gradient-brand)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {authBrandContent.highlightedTitle}
            </span>
          </h2>

          <p className={landingTokens.auth.brandDescription}>
            {authBrandContent.description}
          </p>

          <Link
            to="/"
            className={cn(landingTokens.auth.brandLink, landingTokens.focus)}
          >
            {authBrandContent.linkLabel}
          </Link>
        </section>
      </div>
    </aside>
  )
}
