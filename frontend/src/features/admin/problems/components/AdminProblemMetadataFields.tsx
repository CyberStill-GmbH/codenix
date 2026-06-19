import type { ReactNode } from 'react'

import type {
  AdminProblemFormValues,
  ProblemDifficulty,
} from '@/features/admin/problems/types/problem.types'

type AdminProblemMetadataFieldsProps = {
  values: AdminProblemFormValues
  errors: Partial<Record<keyof AdminProblemFormValues, string>>
  onChange: <Key extends keyof AdminProblemFormValues>(
    key: Key,
    value: AdminProblemFormValues[Key],
  ) => void
}

const inputClassName =
  'h-11 w-full rounded-2xl border border-slate-700/50 bg-slate-900/70 px-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]'

const difficultyOptions: Array<{ value: ProblemDifficulty; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export function AdminProblemMetadataFields({
  values,
  errors,
  onChange,
}: AdminProblemMetadataFieldsProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Metadata
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Core catalog information used by admin lists and user discovery.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Field label="Title" error={errors.title}>
          <input
            value={values.title}
            onChange={(event) => onChange('title', event.target.value)}
            className={inputClassName}
            placeholder="Two Sum"
          />
        </Field>

        <Field label="Slug" error={errors.slug}>
          <input
            value={values.slug}
            onChange={(event) => onChange('slug', event.target.value)}
            className={`${inputClassName} font-mono`}
            placeholder="two-sum"
          />
        </Field>

        <Field label="Difficulty" error={errors.difficulty}>
          <select
            value={values.difficulty}
            onChange={(event) =>
              onChange('difficulty', event.target.value as ProblemDifficulty)
            }
            className={inputClassName}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tags" error={errors.tags}>
          <input
            value={values.tags.join(', ')}
            onChange={(event) =>
              onChange(
                'tags',
                event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
            className={inputClassName}
            placeholder="Array, Hash Map, Sliding Window"
          />
        </Field>
      </div>
    </section>
  )
}

type FieldProps = {
  label: string
  error?: string
  children: ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </span>
      {children}
      {error && <span className="text-xs font-semibold text-[var(--color-error)]">{error}</span>}
    </label>
  )
}
