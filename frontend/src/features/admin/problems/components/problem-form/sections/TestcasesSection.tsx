import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'

import type {
  JsonValue,
  ProblemParameter,
  ProblemParameterType,
  StructuredProblemTestcase,
} from '@/features/admin/problems/types/problem.types'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { SortableItem } from '@/features/admin/problems/components/problem-form/components/SortableItem'
import {
  createEmptyParameter,
  createEmptyTestcase,
  formatJsonValue,
  parseJsonValue,
  validateValueAgainstType,
} from '@/features/admin/problems/components/problem-form/utils/problemSchema'

type TestcasesSectionProps = {
  parameters: ProblemParameter[]
  outputType: ProblemParameterType
  testcases: StructuredProblemTestcase[]
  error?: string
  onParametersChange: (parameters: ProblemParameter[]) => void
  onOutputTypeChange: (type: ProblemParameterType) => void
  onTestcasesChange: (testcases: StructuredProblemTestcase[]) => void
}

const parameterTypes: ProblemParameterType[] = [
  'number',
  'number[]',
  'string',
  'string[]',
  'boolean',
  'object',
]

export function TestcasesSection({
  parameters,
  outputType,
  testcases,
  error,
  onParametersChange,
  onOutputTypeChange,
  onTestcasesChange,
}: TestcasesSectionProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const [importText, setImportText] = useState('')
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importError, setImportError] = useState('')

  function updateParameter(id: string, patch: Partial<ProblemParameter>) {
    onParametersChange(
      parameters.map((parameter) =>
        parameter.id === id ? { ...parameter, ...patch } : parameter,
      ),
    )
  }

  function updateTestcase(id: string, patch: Partial<StructuredProblemTestcase>) {
    onTestcasesChange(
      testcases.map((testcase) =>
        testcase.id === id ? { ...testcase, ...patch } : testcase,
      ),
    )
  }

  function updateTestcaseInput(
    testcase: StructuredProblemTestcase,
    parameter: ProblemParameter,
    value: JsonValue,
  ) {
    updateTestcase(testcase.id, {
      input: {
        ...testcase.input,
        [parameter.name]: value,
      },
    })
  }

  function importJson() {
    try {
      const parsed = JSON.parse(importText) as StructuredProblemTestcase[]
      if (!Array.isArray(parsed)) {
        setImportError('El JSON debe ser un array de testcases.')
        return
      }
      onTestcasesChange(parsed)
      setImportText('')
      setImportError('')
      setIsImportOpen(false)
    } catch {
      setImportError('JSON invalido.')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = testcases.findIndex((testcase) => testcase.id === active.id)
    const newIndex = testcases.findIndex((testcase) => testcase.id === over.id)
    onTestcasesChange(arrayMove(testcases, oldIndex, newIndex))
  }

  return (
    <FormSection
      title="Testcases estructurados"
      description="El judge consume JSON. No mezcles estos datos con el Markdown."
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-[var(--color-text)]">Schema de parametros</h3>
            <button
              type="button"
              onClick={() => onParametersChange([...parameters, createEmptyParameter()])}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/60 px-3 text-xs font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
            >
              <Plus className="h-4 w-4" />
              Parametro
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {parameters.map((parameter) => (
              <div key={parameter.id} className="grid gap-2 lg:grid-cols-[1fr_9rem_1fr_auto]">
                <input
                  value={parameter.name}
                  onChange={(event) => updateParameter(parameter.id, { name: event.target.value })}
                  placeholder="nums"
                  className="h-10 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
                <select
                  value={parameter.type}
                  onChange={(event) =>
                    updateParameter(parameter.id, {
                      type: event.target.value as ProblemParameterType,
                    })
                  }
                  className="h-10 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                >
                  {parameterTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  value={parameter.description ?? ''}
                  onChange={(event) =>
                    updateParameter(parameter.id, { description: event.target.value })
                  }
                  placeholder="Descripcion opcional"
                  className="h-10 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
                <button type="button" aria-label="Eliminar parametro" onClick={() => onParametersChange(parameters.filter((item) => item.id !== parameter.id))} className="h-10 w-10 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-soft)]">
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <label className="mt-4 grid gap-2 lg:max-w-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
              Tipo de output esperado
            </span>
            <select
              value={outputType}
              onChange={(event) => onOutputTypeChange(event.target.value as ProblemParameterType)}
              className="h-10 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              {parameterTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onTestcasesChange([...testcases, createEmptyTestcase(parameters)])}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
          >
            <Plus className="h-4 w-4" />
            Agregar testcase
          </button>
          <button
            type="button"
            onClick={() => setIsImportOpen((current) => !current)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
          >
            <Upload className="h-4 w-4" />
            Importar desde JSON
          </button>
        </div>

        {isImportOpen && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              className="min-h-44 w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              placeholder='[{"id":"case-1","input":{"nums":[2,7],"target":9},"expectedOutput":[0,1],"isSample":true}]'
            />
            {importError && <p className="mt-2 text-xs font-semibold text-[var(--color-error)]">{importError}</p>}
            <button type="button" onClick={importJson} className="mt-3 h-9 rounded-full bg-[var(--color-primary)] px-4 text-sm font-bold text-white">
              Importar
            </button>
          </div>
        )}

        {error && <p className="text-xs font-semibold text-[var(--color-error)]">{error}</p>}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={testcases.map((testcase) => testcase.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {testcases.map((testcase, index) => (
                <SortableItem key={testcase.id} id={testcase.id}>
            <article className="rounded-xl border border-slate-800 bg-slate-950/55 p-4 pr-14">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[var(--color-text)]">Caso {index + 1}</h3>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${testcase.isSample ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'bg-slate-800 text-[var(--color-text-muted)]'}`}>
                    {testcase.isSample ? 'SAMPLE' : 'HIDDEN'}
                  </span>
                </div>
                <button type="button" aria-label="Eliminar testcase" onClick={() => onTestcasesChange(testcases.filter((item) => item.id !== testcase.id))} className="h-9 w-9 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-soft)]">
                  <Trash2 className="mx-auto h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {parameters.map((parameter) => {
                  const currentValue = testcase.input[parameter.name] ?? ''
                  const isValid = validateValueAgainstType(currentValue, parameter.type)
                  return (
                    <label key={parameter.id} className="grid gap-1">
                      <span className="text-xs font-bold text-[var(--color-text-subtle)]">
                        {parameter.name || 'parametro'} ({parameter.type})
                      </span>
                      <textarea
                        value={formatJsonValue(currentValue)}
                        onChange={(event) =>
                          updateTestcaseInput(testcase, parameter, parseJsonValue(event.target.value))
                        }
                        onBlur={(event) => {
                          event.currentTarget.value = formatJsonValue(currentValue)
                        }}
                        className="min-h-20 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                      />
                      {!isValid && (
                        <span className="text-xs font-semibold text-[var(--color-error)]">
                          El valor no coincide con {parameter.type}.
                        </span>
                      )}
                    </label>
                  )
                })}

                <label className="grid gap-1">
                  <span className="text-xs font-bold text-[var(--color-text-subtle)]">
                    Output esperado ({outputType})
                  </span>
                  <textarea
                    value={formatJsonValue(testcase.expectedOutput)}
                    onChange={(event) =>
                      updateTestcase(testcase.id, {
                        expectedOutput: parseJsonValue(event.target.value),
                      })
                    }
                    className="min-h-20 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                  />
                </label>
              </div>

              <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-soft)]">
                <input
                  type="checkbox"
                  checked={testcase.isSample}
                  onChange={(event) => updateTestcase(testcase.id, { isSample: event.target.checked })}
                />
                Es sample visible para Run
              </label>
            </article>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </FormSection>
  )
}
