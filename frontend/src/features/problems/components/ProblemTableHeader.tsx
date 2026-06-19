import { t } from '@/features/problems/utils/problemsI18n'

const columns = [
  { id: 'status', label: t('table.headerStatus'), className: 'text-center' },
  { id: 'problem', label: t('table.headerProblem'), className: '' },
  { id: 'acceptance', label: t('table.headerAcceptance'), className: 'text-right' },
  { id: 'difficulty', label: t('table.headerDifficulty'), className: 'text-right' },
]

export function ProblemTableHeader() {
  return (
    <div className="hidden grid-cols-[48px_minmax(0,1fr)_140px_120px] border-b border-slate-800/60 px-4 py-3 md:grid">
      {columns.map((column) => (
        <span
          key={column.id}
          className={`text-xs font-medium uppercase tracking-wider text-slate-400 ${column.className}`}
        >
          {column.label}
        </span>
      ))}
    </div>
  )
}
