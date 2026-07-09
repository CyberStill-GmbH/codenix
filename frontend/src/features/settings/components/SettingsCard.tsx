import type { ReactNode } from 'react'

type SettingsCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

type SettingsFieldProps = {
  label: string
  description?: string
  htmlFor?: string
  children: ReactNode
}

export function SettingsField({ label, description, htmlFor, children }: SettingsFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 shrink-0 sm:max-w-[260px]">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-[var(--color-text)]"
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      <div className="w-full sm:max-w-[240px]">{children}</div>
    </div>
  )
}

const baseInputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'

export function SettingsInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInputClass} ${props.className ?? ''}`} />
}

export function SettingsSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${baseInputClass} cursor-pointer ${props.className ?? ''}`}
    />
  )
}

type SettingsToggleProps = {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function SettingsToggle({ id, checked, onChange, label }: SettingsToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${checked ? 'bg-[var(--color-primary)]' : 'bg-slate-700'}`}
      aria-label={label}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}
