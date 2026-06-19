import type { ProblemDifficulty } from '@/features/admin/problems/types/problem.types'

type DifficultySelectorProps = {
  value: ProblemDifficulty
  onChange: (value: ProblemDifficulty) => void
}

const options: Array<{ value: ProblemDifficulty; label: string; className: string }> = [
  {
    value: 'easy',
    label: 'EASY',
    className: 'border-[var(--color-success)]/40 text-[var(--color-success)]',
  },
  {
    value: 'medium',
    label: 'MEDIUM',
    className: 'border-[var(--color-warning)]/40 text-[var(--color-warning)]',
  },
  {
    value: 'hard',
    label: 'HARD',
    className: 'border-[var(--color-error)]/40 text-[var(--color-error)]',
  },
]

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Dificultad">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`h-10 rounded-full border px-4 text-xs font-bold transition ${
            option.className
          } ${
            value === option.value
              ? 'bg-slate-900 shadow-[0_10px_24px_rgba(2,8,23,0.24)]'
              : 'bg-slate-950/50 opacity-75 hover:opacity-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
