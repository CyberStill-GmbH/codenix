import type { ProblemStatus } from '@/features/admin/problems/types/problem.types'

type AdminProblemStatusBadgeProps = {
  status: ProblemStatus
}

const statusClassName: Record<ProblemStatus, string> = {
  published:
    'border-[var(--color-success)]/30 bg-[var(--color-success-soft)] text-[var(--color-success)]',
  draft:
    'border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
}

const statusLabel: Record<ProblemStatus, string> = {
  published: 'Published',
  draft: 'Draft',
}

export function AdminProblemStatusBadge({ status }: AdminProblemStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassName[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {statusLabel[status]}
    </span>
  )
}
