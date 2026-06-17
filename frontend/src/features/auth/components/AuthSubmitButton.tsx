import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

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
      className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-primary),#ff6b00)] px-4 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(11,127,195,0.28)] transition duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
    >
      {isLoading ? (
        <>
          <span>{loadingText}</span>
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon && <span aria-hidden="true">{icon}</span>}
        </>
      )}
    </button>
  )
}
