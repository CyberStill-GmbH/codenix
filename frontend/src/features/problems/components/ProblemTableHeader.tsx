import { t } from '@/features/problems/utils/problemsI18n'

const columns = [
  { id: 'status', label: t('table.headerStatus'), className: 'text-center' },
  { id: 'problem', label: t('table.headerProblem'), className: '' },
  { id: 'acceptance', label: t('table.headerAcceptance'), className: 'text-right' },
  { id: 'difficulty', label: t('table.headerDifficulty'), className: 'text-right' },
]

export function ProblemTableHeader() {
  return (
    <div className="hidden grid-cols-[48px_minmax(0,1fr)_140px_120px] gap-4 border-b border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-4 py-3 md:grid">
      {columns.map((column) => (
        <span
          key={column.id}
          className={`font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] ${column.className}`}
        >
          {column.label}
        </span>
      ))}
    </div>
  )
}
