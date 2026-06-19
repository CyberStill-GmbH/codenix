import { Plus, Trash2 } from 'lucide-react'

import type {
  AdminProblemFormValues,
  ProblemExample,
} from '@/features/admin/problems/types/problem.types'

type AdminProblemExamplesEditorProps = {
  examples: ProblemExample[]
  error?: string
  onChange: (examples: ProblemExample[]) => void
}

const textareaClassName =
  'min-h-24 w-full rounded-2xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]'

export function AdminProblemExamplesEditor({
  examples,
  error,
  onChange,
}: AdminProblemExamplesEditorProps) {
  const updateExample = (
    exampleId: string,
    key: keyof ProblemExample,
    value: ProblemExample[keyof ProblemExample],
  ) => {
    onChange(
      examples.map((example) =>
        example.id === exampleId ? { ...example, [key]: value } : example,
      ),
    )
  }

  const addExample = () => {
    onChange([
      ...examples,
      {
        id: `example-${Date.now()}`,
        input: '',
        output: '',
        explanation: '',
      },
    ])
  }

  const removeExample = (exampleId: string) => {
    onChange(examples.filter((example) => example.id !== exampleId))
  }

  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
            Examples
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            At least one example is required before saving the problem.
          </p>
        </div>

        <button
          type="button"
          onClick={addExample}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add example
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {examples.map((example, index) => (
          <article
            key={example.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-mono text-sm font-bold text-[var(--color-text-soft)]">
                Example {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeExample(example.id)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-error)]/40 bg-slate-900/70 px-3 text-xs font-semibold text-[var(--color-error)] transition hover:bg-[var(--color-error-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Input
                </span>
                <textarea
                  value={example.input}
                  onChange={(event) => updateExample(example.id, 'input', event.target.value)}
                  className={`${textareaClassName} font-mono`}
                  placeholder="nums = [2,7,11,15]"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Output
                </span>
                <textarea
                  value={example.output}
                  onChange={(event) => updateExample(example.id, 'output', event.target.value)}
                  className={`${textareaClassName} font-mono`}
                  placeholder="[0,1]"
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                Explanation
              </span>
              <textarea
                value={example.explanation ?? ''}
                onChange={(event) =>
                  updateExample(example.id, 'explanation', event.target.value)
                }
                className={textareaClassName}
                placeholder="Optional explanation for the sample."
              />
            </label>
          </article>
        ))}
      </div>
    </section>
  )
}

export type AdminProblemExamplesValue = AdminProblemFormValues['examples']
