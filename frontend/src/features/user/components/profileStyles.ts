export const profileSurfaceClassName =
  'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]'

export const profileInsetSurfaceClassName =
  'border border-[var(--color-border)] bg-[var(--color-surface-soft)]'

export const profileInteractiveSurfaceClassName =
  `${profileInsetSurfaceClassName} transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]`

export const profilePillClassName =
  'inline-flex items-center gap-1 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)]'

export const profileDividerClassName = 'border-t border-[var(--color-border-soft)]'
