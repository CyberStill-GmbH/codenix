import { memo } from 'react'

import { DifficultyBadge } from '@/features/problems/components/DifficultyBadge'
import { StatusIcon } from '@/features/problems/components/StatusIcon'
import type { Problem } from '@/features/problems/types/problem.types'
import { translateTopic } from '@/features/problems/utils/problemsI18n'

type ProblemTableRowProps = {
  problem: Problem
  onOpen: (slug: string) => void
  onPreload: () => void
}

function ProblemTableRowComponent({ problem, onOpen, onPreload }: ProblemTableRowProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(problem.slug)}
      onMouseEnter={onPreload}
      onFocus={onPreload}
      className="grid min-h-[56px] w-full cursor-pointer gap-3 border-b border-slate-800/60 px-4 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:grid-cols-[48px_minmax(0,1fr)_140px_120px] md:items-center"
    >
      <div className="hidden justify-center md:flex">
        <StatusIcon solved={problem.solved} />
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center">
          <span className="mr-2 font-mono text-sm text-slate-500">{problem.id}.</span>
          <span className="truncate text-sm font-medium text-slate-100">
            {problem.title}
          </span>
        </div>
        {problem.topics.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
            {problem.topics.slice(0, 3).map((topic) => (
              <span key={topic}>{translateTopic(topic)}</span>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-2 md:hidden">
          <StatusIcon solved={problem.solved} />
          <span className="font-mono text-sm text-slate-300">
            {problem.acceptance.toFixed(1)}%
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
      </div>

      <span className="hidden text-right font-mono text-sm text-slate-300 md:block">
        {problem.acceptance.toFixed(1)}%
      </span>

      <div className="hidden justify-end md:flex">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </button>
  )
}

export const ProblemTableRow = memo(ProblemTableRowComponent)
