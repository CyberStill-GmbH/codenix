import type { InputHTMLAttributes } from 'react'
import { landingTokens } from '@/features/landing/theme/tokens'

type AuthCheckboxProps = {
  label: string | React.ReactNode
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export function AuthCheckbox({ label, error, id, ...props }: AuthCheckboxProps) {
  return (
    <div className={landingTokens.auth.fieldWrap}>
      <label
        htmlFor={id}
        className={landingTokens.auth.checkboxLabel}
      >
        <input
          id={id}
          type="checkbox"
          className={`${landingTokens.auth.checkbox} ${landingTokens.focus}`}
          {...props}
        />
        <span>{label}</span>
      </label>

      {error && (
        <div role="alert" aria-live="polite" className="text-xs text-[var(--color-error)]">
          {error}
        </div>
      )}
    </div>
  )
}
