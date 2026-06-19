import { ClipboardList, FilePenLine, UploadCloud } from 'lucide-react'

import type { AdminProblem } from '@/features/admin/problems/types/problem.types'

type AdminProblemActionsProps = {
  problem: AdminProblem
  isUpdating: boolean
  onEdit: (problem: AdminProblem) => void
  onManageTestcases: (problem: AdminProblem) => void
  onTogglePublish: (problem: AdminProblem) => void
}

const actionButtonClassName =
  'inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 text-xs font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60'

export function AdminProblemActions({
  problem,
  isUpdating,
  onEdit,
  onManageTestcases,
  onTogglePublish,
}: AdminProblemActionsProps) {
  const publishLabel = problem.status === 'published' ? 'Unpublish' : 'Publish'

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        className={actionButtonClassName}
        onClick={() => onEdit(problem)}
      >
        <FilePenLine className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </button>

      <button
        type="button"
        className={actionButtonClassName}
        onClick={() => onManageTestcases(problem)}
      >
        <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
        Testcases
      </button>

      <button
        type="button"
        className={`${actionButtonClassName} ${
          problem.status === 'published'
            ? 'border-[var(--color-warning)]/40 text-[var(--color-warning)] hover:bg-[var(--color-warning-soft)]'
            : 'border-[var(--color-success)]/40 text-[var(--color-success)] hover:bg-[var(--color-success-soft)]'
        }`}
        disabled={isUpdating}
        onClick={() => onTogglePublish(problem)}
      >
        <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
        {isUpdating ? 'Saving' : publishLabel}
      </button>
    </div>
  )
}
