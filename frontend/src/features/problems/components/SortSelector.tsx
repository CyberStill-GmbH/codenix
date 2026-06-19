import type { ProblemSort } from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type SortSelectorProps = {
  value: ProblemSort
  onChange: (value: ProblemSort) => void
}

const selectClassName =
  'h-10 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none transition-shadow duration-150 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]'

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ProblemSort)}
      className={selectClassName}
      aria-label={t('filters.sort')}
    >
      <option value="id-asc">{t('filters.sortOriginal')}</option>
      <option value="acceptance-desc">{t('filters.sortAcceptanceDesc')}</option>
      <option value="acceptance-asc">{t('filters.sortAcceptanceAsc')}</option>
      <option value="difficulty-asc">{t('filters.sortDifficultyAsc')}</option>
    </select>
  )
}
