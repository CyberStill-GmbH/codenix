import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'

type PasswordInputProps = {
  label: string
  error?: string
  /** Pass forgotHref to show the "¿Olvidaste tu contraseña?" link. Omit in Register. */
  forgotHref?: string
} & InputHTMLAttributes<HTMLInputElement>

export function PasswordInput({ label, error, forgotHref, id, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>

        {forgotHref && (
          <a
            href={forgotHref}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] rounded"
          >
            ¿Olvidaste tu contraseña?
          </a>
        )}
      </div>

      <div
        className={[
          'relative flex items-center rounded-xl border transition duration-200 bg-[var(--color-surface)]',
          error
            ? 'border-[var(--color-error)] shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
            : 'border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(11,127,195,0.14)]',
        ].join(' ')}
      >
        <LockKeyhole
          className={[
            'ml-3.5 h-4 w-4 shrink-0 transition-colors',
            error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-subtle)]',
          ].join(' ')}
          aria-hidden="true"
        />

        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          className="h-11 w-full bg-transparent px-3 pr-11 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />

        <button
          type="button"
          className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-subtle)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
          aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((v) => !v)}
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
        className="min-h-[1rem] text-xs text-[var(--color-error)]"
      >
        {error}
      </div>
    </div>
  )
}
