import type { ReactNode } from 'react'
import type { OAuthProvider } from '@/features/auth/types/auth.types'

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
      className="inline-flex h-11 items-center justify-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium text-[var(--color-text-soft)] transition duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
    >
      <span className="h-4 w-4 shrink-0" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  )
}
