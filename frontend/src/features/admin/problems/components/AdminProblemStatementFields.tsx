import type { ReactNode } from 'react'

import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'

type AdminProblemStatementFieldsProps = {
  values: AdminProblemFormValues
  errors: Partial<Record<keyof AdminProblemFormValues, string>>
  onChange: <Key extends keyof AdminProblemFormValues>(
    key: Key,
    value: AdminProblemFormValues[Key],
  ) => void
}

const textareaClassName =
  'min-h-32 w-full rounded-2xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]'

export function AdminProblemStatementFields({
  values,
  errors,
  onChange,
}: AdminProblemStatementFieldsProps) {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div>
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Statement
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Problem content shown in the solving workspace.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <StatementField label="Statement" error={errors.statement}>
          <textarea
            value={values.statement}
            onChange={(event) => onChange('statement', event.target.value)}
            className={`${textareaClassName} min-h-44`}
            placeholder="Describe the task, edge cases, and required behavior."
          />
        </StatementField>

        <div className="grid gap-4 lg:grid-cols-2">
          <StatementField label="Input format">
            <textarea
              value={values.inputFormat}
              onChange={(event) => onChange('inputFormat', event.target.value)}
              className={textareaClassName}
              placeholder="Describe the input shape."
            />
          </StatementField>

          <StatementField label="Output format">
            <textarea
              value={values.outputFormat}
              onChange={(event) => onChange('outputFormat', event.target.value)}
              className={textareaClassName}
              placeholder="Describe the expected output."
            />
          </StatementField>
        </div>

        <StatementField label="Constraints">
          <textarea
            value={values.constraints}
            onChange={(event) => onChange('constraints', event.target.value)}
            className={`${textareaClassName} font-mono`}
            placeholder="1 <= n <= 10^5"
          />
        </StatementField>
      </div>
    </section>
  )
}

type StatementFieldProps = {
  label: string
  error?: string
  children: ReactNode
}

function StatementField({ label, error, children }: StatementFieldProps) {
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
