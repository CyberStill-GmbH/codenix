import type { ReactNode } from 'react'
import type { OAuthProvider } from '@/features/auth/types/auth.types'
import { landingTokens } from '@/features/landing/theme/tokens'

type OAuthButtonProps = {
  provider: OAuthProvider
  icon: ReactNode
  label: string
  onClick: (provider: OAuthProvider) => void
}

export function OAuthButton({ provider, icon, label, onClick }: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(provider)}
      className={`${landingTokens.auth.oauthButton} ${landingTokens.focus}`}
    >
      <span className="h-4 w-4 shrink-0" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  )
}
