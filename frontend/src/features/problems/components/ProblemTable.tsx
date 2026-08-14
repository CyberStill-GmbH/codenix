import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ProblemTableHeader } from '@/features/problems/components/ProblemTableHeader'
import { ProblemTableRow } from '@/features/problems/components/ProblemTableRow'
import type { Problem } from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'
import { preloadRoute } from '@/routes/routePreload'

type ProblemTableProps = {
  problems: Problem[]
}

export function ProblemTable({ problems }: ProblemTableProps) {
  const navigate = useNavigate()
  const openProblem = useCallback(
    (slug: string) => navigate(`/problems/${slug}`),
    [navigate],
  )
  const preloadProblem = useCallback(() => preloadRoute('problemDetail'), [])

  if (problems.length === 0) {
    return (
      <EmptyState
        title={t('table.emptyTitle')}
        description={t('table.emptyDescription')}
      />
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <ProblemTableHeader />
      <div>
        {problems.map((problem) => (
          <ProblemTableRow
            key={problem.apiId ?? problem.id}
            problem={problem}
            onOpen={openProblem}
            onPreload={preloadProblem}
          />
        ))}
      </div>
    </section>
  )
}
