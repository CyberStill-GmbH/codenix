import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { Link } from 'react-router-dom'

type UserMenuActionProps = {
  id: string
  icon: ComponentType<LucideProps>
  label: string
  route?: string
  onClick?: () => void
  variant?: 'default' | 'danger'
}

export function UserMenuAction({
  id,
  icon: Icon,
  label,
  route,
  onClick,
  variant = 'default',
}: UserMenuActionProps) {
  const toneClassName =
    variant === 'danger'
      ? 'text-[var(--color-error)] hover:border-[var(--color-error-soft)] hover:bg-[var(--color-error-soft)]'
      : 'text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'

  const className = `flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-lg)] border border-transparent px-4 py-2 text-left text-sm font-medium transition duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] cursor-pointer ${toneClassName}`

  if (route) {
    return (
      <Link to={route} onClick={onClick} className={className} id={`user-menu-${id}`}>
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button
      id={`user-menu-${id}`}
      type="button"
      onClick={onClick}
      className={className}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
