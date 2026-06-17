import type { ComponentType, InputHTMLAttributes } from 'react'
import type { LucideProps } from 'lucide-react'

type AuthInputProps = {
  label: string
  error?: string
  icon: ComponentType<LucideProps>
} & InputHTMLAttributes<HTMLInputElement>

export function AuthInput({ label, error, icon: Icon, id, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text)]">
        {label}
      </label>

      <div
        className={[
          'relative flex items-center rounded-xl border transition duration-200',
          'bg-[var(--color-surface)]',
          error
            ? 'border-[var(--color-error)] shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
            : 'border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(11,127,195,0.14)]',
        ].join(' ')}
      >
        <Icon
          className={[
            'ml-3.5 h-4 w-4 shrink-0 transition-colors',
            error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-subtle)]',
          ].join(' ')}
          aria-hidden="true"
        />

        <input
          id={id}
          className="h-11 w-full bg-transparent px-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
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
