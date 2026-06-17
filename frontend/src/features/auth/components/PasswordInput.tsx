import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'

import { landingTokens } from '@/features/landing/theme/tokens'

type PasswordInputProps = {
  label: string
  error?: string
  forgotHref?: string
} & InputHTMLAttributes<HTMLInputElement>

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

export function PasswordInput({
  label,
  error,
  forgotHref,
  id,
  disabled,
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={landingTokens.auth.fieldWrap}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className={landingTokens.auth.label}>
          {label}
        </label>

        {forgotHref && (
          <a
            href={forgotHref}
            className={`${landingTokens.auth.textLink} ${landingTokens.focus}`}
          >
            ¿Olvidaste tu contraseña?
          </a>
        )}
      </div>

      <div
        className={cx(
          landingTokens.auth.inputShell,
          error
            ? landingTokens.auth.inputShellError
            : landingTokens.auth.inputShellDefault,
          disabled && landingTokens.auth.inputShellDisabled,
        )}
      >
        <LockKeyhole
          className={cx(
            landingTokens.auth.inputIcon,
            error && landingTokens.auth.inputIconError,
          )}
          aria-hidden="true"
        />

        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          disabled={disabled}
          className={cx(landingTokens.auth.inputWithAction, className)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        <button
          type="button"
          className={`${landingTokens.auth.iconButton} ${landingTokens.focus}`}
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((value) => !value)}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
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
