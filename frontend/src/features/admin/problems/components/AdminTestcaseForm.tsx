import { useState, type FormEvent } from 'react'
import { Save, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Textarea } from '@/shared/components/ui/Textarea'

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

const fieldClassName = ''

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
      setFormError('La entrada y la salida esperada son obligatorias.')
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
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          {testcase ? 'Editar caso de prueba' : 'Crear caso de prueba'}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Los casos visibles aparecen en el enunciado. Los ocultos se reservan para validar las soluciones.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Input
          </span>
          <Textarea
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
          <Textarea
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
            <option value="sample">Visible</option>
            <option value="hidden">Oculto</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Weight
          </span>
          <Input
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
            placeholder="Opcional"
          />
        </label>
      </div>

      {formError && (
        <div className="mt-4 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
          {formError}
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="rounded-full"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="rounded-full"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Guardando' : testcase ? 'Guardar cambios' : 'Crear caso de prueba'}
        </Button>
      </div>
    </form>
  )
}
