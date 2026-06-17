import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { landingTokens } from '@/features/landing/theme/tokens'

type AuthSubmitButtonProps = {
  children: ReactNode
  icon?: ReactNode
  isLoading?: boolean
  loadingText?: string
}

export function AuthSubmitButton({
  children,
  icon,
  isLoading = false,
  loadingText = 'Procesando...',
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`${landingTokens.auth.primaryButton} ${landingTokens.focus}`}
    >
      <span className={landingTokens.auth.primaryButtonOverlay} />
      {isLoading ? (
        <span className={landingTokens.auth.primaryButtonContent}>
          <span>{loadingText}</span>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        </span>
      ) : (
        <span className={landingTokens.auth.primaryButtonContent}>
          <span>{children}</span>
          {icon && <span aria-hidden="true">{icon}</span>}
        </span>
      )}
    </button>
  )
}
