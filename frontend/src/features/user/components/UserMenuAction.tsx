import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

type UserMenuActionProps = {
  icon: ComponentType<LucideProps>
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}

export function UserMenuAction({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: UserMenuActionProps) {
  const toneClassName =
    variant === 'danger'
      ? 'text-[var(--color-error)] hover:border-[var(--color-error-soft)] hover:bg-[var(--color-error-soft)]'
      : 'text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 w-full items-center gap-3 rounded-[var(--radius-lg)] border border-transparent px-3 py-2 text-left text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${toneClassName}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
