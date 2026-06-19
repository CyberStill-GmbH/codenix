import type { Difficulty } from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type DifficultySelectorProps = {
  value: Difficulty | 'All'
  onChange: (value: Difficulty | 'All') => void
}

const selectClassName =
  'h-10 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 outline-none transition-shadow duration-150 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)]'

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Difficulty | 'All')}
      className={selectClassName}
      aria-label={t('filters.difficulty')}
    >
      <option value="All">{t('filters.difficulty')}</option>
      <option value="Easy">{t('difficulty.easy')}</option>
      <option value="Medium">{t('difficulty.medium')}</option>
      <option value="Hard">{t('difficulty.hard')}</option>
    </select>
  )
}
