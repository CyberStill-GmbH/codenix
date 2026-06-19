import { FilePenLine, Trash2 } from 'lucide-react'

import type { AdminTestcase } from '@/features/admin/problems/types/problem.types'

type AdminTestcaseActionsProps = {
  testcase: AdminTestcase
  isDeleting: boolean
  onEdit: (testcase: AdminTestcase) => void
  onDelete: (testcase: AdminTestcase) => void
}

const actionButtonClassName =
  'inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 text-xs font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60'

export function AdminTestcaseActions({
  testcase,
  isDeleting,
  onEdit,
  onDelete,
}: AdminTestcaseActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        className={actionButtonClassName}
        onClick={() => onEdit(testcase)}
      >
        <FilePenLine className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </button>

      <button
        type="button"
        className={`${actionButtonClassName} border-[var(--color-error)]/40 text-[var(--color-error)] hover:bg-[var(--color-error-soft)]`}
        disabled={isDeleting}
        onClick={() => onDelete(testcase)}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        {isDeleting ? 'Deleting' : 'Delete'}
      </button>
    </div>
  )
}
