import type { ComponentType, InputHTMLAttributes } from 'react'
import type { LucideProps } from 'lucide-react'

import { landingTokens } from '@/features/landing/theme/tokens'
import { cn } from '@/shared/lib/utils'

export type FormInputProps = {
  label: string
  error?: string
  icon: ComponentType<LucideProps>
} & InputHTMLAttributes<HTMLInputElement>

export function FormInput({
  label,
  error,
  icon: Icon,
  id,
  disabled,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={landingTokens.auth.fieldWrap}>
      <label htmlFor={id} className={landingTokens.auth.label}>
        {label}
      </label>

      <div
        className={cn(
          landingTokens.auth.inputShell,
          error
            ? landingTokens.auth.inputShellError
            : landingTokens.auth.inputShellDefault,
          disabled && landingTokens.auth.inputShellDisabled,
        )}
      >
        <Icon
          className={cn(
            landingTokens.auth.inputIcon,
            error && landingTokens.auth.inputIconError,
          )}
          aria-hidden="true"
        />

        <input
          id={id}
          disabled={disabled}
          className={cn(landingTokens.auth.input, className)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>

      <div
        id={`${id}-error`}
        role="alert"
        aria-live="polite"
        className={landingTokens.auth.fieldError}
      >
        {error}
      </div>
    </div>
  )
}
