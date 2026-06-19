import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  message: string
  action?: ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-5 text-sm text-[var(--color-error)]">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-display text-base font-bold text-[var(--color-error)]">
            {title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[var(--color-error)]">{message}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  )
}
