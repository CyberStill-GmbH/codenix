import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2 } from 'lucide-react'

import type { ProblemExample } from '@/features/admin/problems/types/problem.types'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { SortableItem } from '@/features/admin/problems/components/problem-form/components/SortableItem'
import { createId } from '@/features/admin/problems/components/problem-form/utils/problemSchema'

type ExamplesSectionProps = {
  examples: ProblemExample[]
  error?: string
  onChange: (examples: ProblemExample[]) => void
}

export function ExamplesSection({ examples, error, onChange }: ExamplesSectionProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function updateExample(id: string, patch: Partial<ProblemExample>) {
    onChange(examples.map((example) => (example.id === id ? { ...example, ...patch } : example)))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = examples.findIndex((example) => example.id === active.id)
    const newIndex = examples.findIndex((example) => example.id === over.id)
    onChange(arrayMove(examples, oldIndex, newIndex))
  }

  return (
    <FormSection
      title="Ejemplos visibles"
      description="Texto legible para usuarios. No reemplaza los testcases del judge."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={examples.map((example) => example.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <SortableItem key={example.id} id={example.id}>
                  <article className="rounded-xl border border-slate-800 bg-slate-950/55 p-4 pr-14">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[var(--color-text)]">Ejemplo {index + 1}</h3>
                      <button
                        type="button"
                        aria-label="Eliminar ejemplo"
                        onClick={() => onChange(examples.filter((item) => item.id !== example.id))}
                        className="h-8 w-8 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-soft)]"
                      >
                        <Trash2 className="mx-auto h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-3">
                      <textarea value={example.input} onChange={(event) => updateExample(example.id, { input: event.target.value })} placeholder="Input" className="min-h-20 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
                      <textarea value={example.output} onChange={(event) => updateExample(example.id, { output: event.target.value })} placeholder="Output" className="min-h-16 rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
                      <textarea value={example.explanation ?? ''} onChange={(event) => updateExample(example.id, { explanation: event.target.value })} placeholder="Explicacion opcional" className="min-h-16 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
                    </div>
                  </article>
                </SortableItem>
              ))}

              <button
                type="button"
                onClick={() =>
                  onChange([...examples, { id: createId('example'), input: '', output: '' }])
                }
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
              >
                <Plus className="h-4 w-4" />
                Agregar ejemplo
              </button>
              {error && <p className="text-xs font-semibold text-[var(--color-error)]">{error}</p>}
            </div>
          </SortableContext>
        </DndContext>

        <aside className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Preview</h3>
          <div className="mt-3 space-y-3">
            {examples.map((example, index) => (
              <div key={example.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-xs font-bold text-[var(--color-text)]">Example {index + 1}</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-[var(--color-text-soft)]">input: {example.input}{'\n'}output: {example.output}</pre>
                {example.explanation && <p className="mt-2 text-xs text-[var(--color-text-subtle)]">{example.explanation}</p>}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </FormSection>
  )
}
