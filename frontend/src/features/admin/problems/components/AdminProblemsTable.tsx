import { EmptyState } from '@/components/feedback/EmptyState'
import type { AdminProblem, ProblemDifficulty } from '@/features/admin/problems/types/problem.types'
import { AdminProblemActions } from '@/features/admin/problems/components/AdminProblemActions'
import { AdminProblemStatusBadge } from '@/features/admin/problems/components/AdminProblemStatusBadge'

type AdminProblemsTableProps = {
  problems: AdminProblem[]
  updatingProblemId: string | null
  onEdit: (problem: AdminProblem) => void
  onManageTestcases: (problem: AdminProblem) => void
  onTogglePublish: (problem: AdminProblem) => void
}

const difficultyClassName: Record<ProblemDifficulty, string> = {
  easy: 'badge badge--easy',
  medium: 'badge badge--medium',
  hard: 'badge badge--hard',
}

const difficultyLabel: Record<ProblemDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const formatUpdatedDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date))

export function AdminProblemsTable({
  problems,
  updatingProblemId,
  onEdit,
  onManageTestcases,
  onTogglePublish,
}: AdminProblemsTableProps) {
  if (problems.length === 0) {
    return (
      <EmptyState
        title="No problems found"
        description="Adjust the search or filters to find existing problems, or create a new draft for the catalog."
      />
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="hidden grid-cols-[minmax(16rem,1.4fr)_7rem_minmax(12rem,1fr)_8rem_7rem_8rem_minmax(18rem,1fr)] gap-4 border-b border-slate-800 px-5 py-3 xl:grid">
        {['Title', 'Difficulty', 'Tags', 'Status', 'Testcases', 'Updated', 'Actions'].map(
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
        {problems.map((problem, index) => {
          const rowSurface = index % 2 === 0 ? 'bg-slate-900/55' : 'bg-transparent'

          return (
            <article
              key={problem.id}
              className={`grid gap-4 rounded-xl px-4 py-4 transition hover:bg-slate-800/70 xl:grid-cols-[minmax(16rem,1.4fr)_7rem_minmax(12rem,1fr)_8rem_7rem_8rem_minmax(18rem,1fr)] xl:items-center ${rowSurface}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {problem.title}
                </p>
                <p className="mt-1 truncate font-mono text-xs text-[var(--color-text-subtle)]">
                  /problems/{problem.slug}
                </p>
              </div>

              <div>
                <span className={difficultyClassName[problem.difficulty]}>
                  {difficultyLabel[problem.difficulty]}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-700/60 bg-slate-900/70 px-2 py-1 text-xs font-medium text-[var(--color-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <AdminProblemStatusBadge status={problem.status} />

              <span className="font-mono text-sm text-[var(--color-text-soft)]">
                {problem.testcasesCount}
              </span>

              <span className="text-sm text-[var(--color-text-muted)]">
                {formatUpdatedDate(problem.updatedAt)}
              </span>

              <AdminProblemActions
                problem={problem}
                isUpdating={updatingProblemId === problem.id}
                onEdit={onEdit}
                onManageTestcases={onManageTestcases}
                onTogglePublish={onTogglePublish}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}
