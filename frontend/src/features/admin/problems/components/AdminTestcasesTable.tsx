import { EmptyState } from '@/components/feedback/EmptyState'
import type { AdminTestcase } from '@/features/admin/problems/types/problem.types'
import { AdminTestcaseActions } from '@/features/admin/problems/components/AdminTestcaseActions'
import { AdminTestcaseVisibilityBadge } from '@/features/admin/problems/components/AdminTestcaseVisibilityBadge'

type AdminTestcasesTableProps = {
  testcases: AdminTestcase[]
  deletingTestcaseId: string | null
  onEdit: (testcase: AdminTestcase) => void
  onDelete: (testcase: AdminTestcase) => void
}

const previewText = (value: string) => {
  const oneLineValue = value.replace(/\s+/g, ' ').trim()
  return oneLineValue.length > 96 ? `${oneLineValue.slice(0, 96)}...` : oneLineValue
}

export function AdminTestcasesTable({
  testcases,
  deletingTestcaseId,
  onEdit,
  onDelete,
}: AdminTestcasesTableProps) {
  if (testcases.length === 0) {
    return (
      <EmptyState
        title="No testcases yet"
        description="Add at least one sample testcase and one hidden testcase before publishing this problem."
      />
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="hidden grid-cols-[8rem_minmax(14rem,1fr)_minmax(14rem,1fr)_6rem_minmax(12rem,0.7fr)] gap-4 border-b border-slate-800 px-5 py-3 lg:grid">
        {['Visibility', 'Input preview', 'Expected output', 'Weight', 'Actions'].map(
          (heading) => (
            <span
              key={heading}
              className="text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]"
            >
              {heading}
            </span>
          ),
        )}
      </div>

      <div className="space-y-2 p-3">
        {testcases.map((testcase, index) => {
          const rowSurface = index % 2 === 0 ? 'bg-slate-900/55' : 'bg-transparent'

          return (
            <article
              key={testcase.id}
              className={`grid gap-4 rounded-xl px-4 py-4 transition hover:bg-slate-800/70 lg:grid-cols-[8rem_minmax(14rem,1fr)_minmax(14rem,1fr)_6rem_minmax(12rem,0.7fr)] lg:items-center ${rowSurface}`}
            >
              <AdminTestcaseVisibilityBadge visibility={testcase.visibility} />

              <pre className="whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-[var(--color-text-soft)]">
                {previewText(testcase.input)}
              </pre>

              <pre className="whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-[var(--color-text-soft)]">
                {previewText(testcase.expectedOutput)}
              </pre>

              <span className="font-mono text-sm text-[var(--color-text-muted)]">
                {testcase.weight ?? '-'}
              </span>

              <AdminTestcaseActions
                testcase={testcase}
                isDeleting={deletingTestcaseId === testcase.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}
