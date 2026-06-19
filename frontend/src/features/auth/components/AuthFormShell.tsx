import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { GithubBrandIcon, GoogleBrandIcon } from '@/features/auth/components/OAuthBrandIcon'
import { OAuthButton } from '@/features/auth/components/OAuthButton'
import type { OAuthProvider } from '@/features/auth/types/auth.types'
import { landingTokens } from '@/features/landing/theme/tokens'

export type AuthFormShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  onSubmit: React.FormEventHandler<HTMLFormElement>
  onOAuth: (provider: OAuthProvider) => void
  dividerText: string
  footerText: string
  footerLinkLabel: string
  footerLinkTo: string
  compact?: boolean
}

export function AuthFormShell({
  eyebrow,
  title,
  description,
  children,
  onSubmit,
  onOAuth,
  dividerText,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  compact = false,
}: AuthFormShellProps) {
  return (
    <>
      <div className={compact ? landingTokens.auth.headerCompact : landingTokens.auth.header}>
        <p className={landingTokens.auth.eyebrow}>{eyebrow}</p>
        <h1 className={landingTokens.auth.title}>{title}</h1>
        <p className={landingTokens.auth.description}>{description}</p>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className={compact ? landingTokens.auth.formCompact : landingTokens.auth.form}
      >
        {children}
      </form>

      <div className={compact ? landingTokens.auth.dividerCompact : landingTokens.auth.divider}>
        <span className={landingTokens.auth.dividerLine} />
        <span>{dividerText}</span>
        <span className={landingTokens.auth.dividerLine} />
      </div>

      <div className={landingTokens.auth.oauthGrid}>
        <OAuthButton
          provider="github"
          icon={<GithubBrandIcon />}
          label="GitHub"
          onClick={onOAuth}
        />
        <OAuthButton
          provider="google"
          icon={<GoogleBrandIcon />}
          label="Google"
          onClick={onOAuth}
        />
      </div>

      <p className={compact ? landingTokens.auth.footerTextCompact : landingTokens.auth.footerText}>
        {footerText}{' '}
        <Link
          to={footerLinkTo}
          className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}
        >
          {footerLinkLabel}
        </Link>
      </p>
    </>
  )
}
