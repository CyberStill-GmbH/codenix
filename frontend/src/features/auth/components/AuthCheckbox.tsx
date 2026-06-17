import type { InputHTMLAttributes } from 'react'

type AuthCheckboxProps = {
  label: string | React.ReactNode
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export function AuthCheckbox({ label, error, id, ...props }: AuthCheckboxProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--color-text-muted)]"
      >
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--color-border)] bg-[var(--color-surface)] accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
