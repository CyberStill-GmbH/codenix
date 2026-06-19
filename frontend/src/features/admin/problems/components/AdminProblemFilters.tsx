import { Search } from 'lucide-react'

import type {
  AdminProblemDifficultyFilter,
  AdminProblemStatusFilter,
} from '@/features/admin/problems/types/problem.types'

type AdminProblemFiltersProps = {
  search: string
  difficulty: AdminProblemDifficultyFilter
  status: AdminProblemStatusFilter
  tag: string
  tags: string[]
  resultCount: number
  totalCount: number
  onSearchChange: (search: string) => void
  onDifficultyChange: (difficulty: AdminProblemDifficultyFilter) => void
  onStatusChange: (status: AdminProblemStatusFilter) => void
  onTagChange: (tag: string) => void
}

const selectClassName =
  'h-10 rounded-full border border-slate-700/50 bg-slate-900/70 px-3 text-sm text-[var(--color-text-soft)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]'

export function AdminProblemFilters({
  search,
  difficulty,
  status,
  tag,
  tags,
  resultCount,
  totalCount,
  onSearchChange,
  onDifficultyChange,
  onStatusChange,
  onTagChange,
}: AdminProblemFiltersProps) {
  return (
    <section
      className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]"
      aria-label="Admin problem filters"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search problems by title</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title"
            className="h-11 w-full rounded-full border border-slate-700/50 bg-slate-900/70 pl-10 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={difficulty}
            onChange={(event) =>
              onDifficultyChange(event.target.value as AdminProblemDifficultyFilter)
            }
            className={selectClassName}
            aria-label="Filter by difficulty"
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as AdminProblemStatusFilter)
            }
            className={selectClassName}
            aria-label="Filter by status"
          >
            <option value="all">Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={tag}
            onChange={(event) => onTagChange(event.target.value)}
            className={selectClassName}
            aria-label="Filter by tag"
          >
            <option value="all">Tags</option>
            {tags.map((availableTag) => (
              <option key={availableTag} value={availableTag}>
                {availableTag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm text-[var(--color-text-muted)]">
        <span className="h-2.5 w-2.5 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-soft)]" />
        <span>
          <span className="font-mono text-[var(--color-text)]">{resultCount}</span>/
          <span className="font-mono">{totalCount}</span> visible
        </span>
      </div>
    </section>
  )
}
