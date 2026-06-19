import type { TestcaseVisibility } from '@/features/admin/problems/types/problem.types'

type AdminTestcaseVisibilityBadgeProps = {
  visibility: TestcaseVisibility
}

const visibilityClassName: Record<TestcaseVisibility, string> = {
  sample:
    'border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-accent-muted)]',
  hidden:
    'border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
}

const visibilityLabel: Record<TestcaseVisibility, string> = {
  sample: 'Sample',
  hidden: 'Hidden',
}

export function AdminTestcaseVisibilityBadge({
  visibility,
}: AdminTestcaseVisibilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${visibilityClassName[visibility]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {visibilityLabel[visibility]}
    </span>
  )
}
