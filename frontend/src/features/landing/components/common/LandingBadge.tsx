import type { ReactNode } from 'react'

type LandingBadgeProps = {
  children: ReactNode
  icon?: ReactNode
  className?: string
  /** 'default' = text-muted, 'primary' = text-primary */
  variant?: 'default' | 'primary'
}

/**
 * Pill badge reutilizable para encabezados de sección, estados y etiquetas.
 */
export function LandingBadge({
  children,
  icon,
  className = '',
  variant = 'default',
}: LandingBadgeProps) {
  const textClass = variant === 'primary' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-subtle)]'

  return (
    <span className={`font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] ${textClass} ${className}`}>
      {icon && <span className="mr-2 inline-flex align-middle" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  )
}
