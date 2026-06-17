import type { ComponentType, InputHTMLAttributes } from 'react'
import type { LucideProps } from 'lucide-react'

import { landingTokens } from '@/features/landing/theme/tokens'

export type FormInputProps = {
  label: string
  error?: string
  icon: ComponentType<LucideProps>
} & InputHTMLAttributes<HTMLInputElement>

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

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
        className={cx(
          landingTokens.auth.inputShell,
          error
            ? landingTokens.auth.inputShellError
            : landingTokens.auth.inputShellDefault,
          disabled && landingTokens.auth.inputShellDisabled,
        )}
      >
        <Icon
          className={cx(
            landingTokens.auth.inputIcon,
            error && landingTokens.auth.inputIconError,
          )}
          aria-hidden="true"
        />

        <input
          id={id}
          disabled={disabled}
          className={cx(landingTokens.auth.input, className)}
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
