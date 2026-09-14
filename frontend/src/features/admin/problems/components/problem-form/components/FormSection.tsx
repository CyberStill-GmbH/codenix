import type { ReactNode } from 'react'

type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5 shadow-[var(--shadow-sm)]">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
