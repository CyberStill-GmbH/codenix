import type { ReactNode } from 'react'

type LandingBadgeProps = {
  children: ReactNode
  icon?: ReactNode
  /** 'default' = text-muted, 'primary' = text-primary */
  variant?: 'default' | 'primary'
}

/**
 * Pill badge reutilizable para encabezados de sección, estados y etiquetas.
 */
export function LandingBadge({
  children,
  icon,
  variant = 'default',
}: LandingBadgeProps) {
  const textClass =
    variant === 'primary'
      ? 'text-[var(--color-primary)]'
      : 'text-[var(--color-text-muted)]'

  return (
    <span
      className={`font-display inline-flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium ${textClass}`}
    >
      {icon && (
        <span className="text-[var(--color-primary)]" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
