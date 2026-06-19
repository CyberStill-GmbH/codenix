import type { ProblemStatusFilter } from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type StatusSelectorProps = {
  value: ProblemStatusFilter
  onChange: (value: ProblemStatusFilter) => void
}

const selectClassName =
  'h-10 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none transition-shadow duration-150 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]'

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ProblemStatusFilter)}
      className={selectClassName}
      aria-label={t('filters.status')}
    >
      <option value="all">{t('filters.all')}</option>
      <option value="solved">{t('filters.solved')}</option>
      <option value="unsolved">{t('filters.unsolved')}</option>
    </select>
  )
}
