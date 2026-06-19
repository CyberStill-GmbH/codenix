import { useState, type FormEvent } from 'react'
import { Save, X } from 'lucide-react'

import type {
  AdminTestcase,
  AdminTestcasePayload,
  TestcaseVisibility,
} from '@/features/admin/problems/types/problem.types'

type AdminTestcaseFormProps = {
  testcase?: AdminTestcase | null
  isSubmitting: boolean
  onSubmit: (payload: AdminTestcasePayload) => Promise<void>
  onCancel: () => void
}

const emptyPayload: AdminTestcasePayload = {
  input: '',
  expectedOutput: '',
  visibility: 'sample',
  weight: undefined,
}

const fieldClassName =
  'w-full rounded-2xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)]'

export function AdminTestcaseForm({
  testcase,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdminTestcaseFormProps) {
  const [payload, setPayload] = useState<AdminTestcasePayload>(() =>
    testcase
      ? {
          input: testcase.input,
          expectedOutput: testcase.expectedOutput,
          visibility: testcase.visibility,
          weight: testcase.weight,
        }
      : emptyPayload,
  )
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!payload.input.trim() || !payload.expectedOutput.trim()) {
      setFormError('Input and expected output are required.')
      return
    }

    setFormError(null)
    await onSubmit({
      input: payload.input.trim(),
      expectedOutput: payload.expectedOutput.trim(),
      visibility: payload.visibility,
      weight: payload.weight,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          {testcase ? 'Edit testcase' : 'Create testcase'}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Sample cases appear in the problem statement. Hidden cases are reserved for judge
          validation.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Input
          </span>
          <textarea
            value={payload.input}
            onChange={(event) =>
              setPayload((currentPayload) => ({
                ...currentPayload,
                input: event.target.value,
              }))
            }
            className={`${fieldClassName} min-h-40 font-mono`}
            placeholder="nums = [2,7,11,15]&#10;target = 9"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Expected output
          </span>
          <textarea
            value={payload.expectedOutput}
            onChange={(event) =>
              setPayload((currentPayload) => ({
                ...currentPayload,
                expectedOutput: event.target.value,
              }))
            }
            className={`${fieldClassName} min-h-40 font-mono`}
            placeholder="[0,1]"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Visibility
          </span>
          <select
            value={payload.visibility}
            onChange={(event) =>
              setPayload((currentPayload) => ({
                ...currentPayload,
                visibility: event.target.value as TestcaseVisibility,
              }))
            }
            className={fieldClassName}
          >
            <option value="sample">Sample</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Weight
          </span>
          <input
            type="number"
            min="0"
            step="1"
            value={payload.weight ?? ''}
            onChange={(event) =>
              setPayload((currentPayload) => ({
                ...currentPayload,
                weight:
                  event.target.value.length === 0 ? undefined : Number(event.target.value),
              }))
            }
            className={fieldClassName}
            placeholder="Optional"
          />
        </label>
      </div>

      {formError && (
        <div className="mt-4 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
          {formError}
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-semibold text-[var(--color-text-soft)] transition hover:border-slate-600 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-sky-300/30 bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] px-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(14,165,233,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(14,165,233,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Saving' : testcase ? 'Save changes' : 'Create testcase'}
        </button>
      </div>
    </form>
  )
}
