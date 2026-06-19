import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2 } from 'lucide-react'

import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { SortableItem } from '@/features/admin/problems/components/problem-form/components/SortableItem'
import { renderBasicMath } from '@/features/admin/problems/components/problem-form/utils/mathText'

type ConstraintsSectionProps = {
  constraints: string[]
  onChange: (constraints: string[]) => void
}

function getConstraintId(constraint: string, index: number) {
  return `${index}:${constraint}`
}

export function ConstraintsSection({ constraints, onChange }: ConstraintsSectionProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const ids = constraints.map(getConstraintId)

  function updateConstraint(index: number, value: string) {
    onChange(constraints.map((constraint, currentIndex) => (currentIndex === index ? value : constraint)))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = ids.findIndex((id) => id === active.id)
    const newIndex = ids.findIndex((id) => id === over.id)
    onChange(arrayMove(constraints, oldIndex, newIndex))
  }

  return (
    <FormSection
      title="Constraints"
      description="Una constraint por campo. Se renderiza 10^5 como superindice."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {constraints.map((constraint, index) => (
                <SortableItem key={getConstraintId(constraint, index)} id={getConstraintId(constraint, index)}>
                  <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-2 pr-12">
                    <input
                      value={constraint}
                      onChange={(event) => updateConstraint(index, event.target.value)}
                      placeholder={index === 0 ? '1 <= nums.length <= 10^4' : 'nums[i] es unico'}
                      className="h-10 flex-1 rounded-xl border border-slate-800 bg-slate-900/70 px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                    />
                    <button type="button" aria-label="Eliminar constraint" onClick={() => onChange(constraints.filter((_, currentIndex) => currentIndex !== index))} className="h-10 w-10 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-soft)]">
                      <Trash2 className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                </SortableItem>
              ))}

              <button
                type="button"
                onClick={() => onChange([...constraints, ''])}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] hover:border-[var(--color-primary)]"
              >
                <Plus className="h-4 w-4" />
                Agregar constraint
              </button>
            </div>
          </SortableContext>
        </DndContext>

        <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">Preview</h3>
          <ul className="mt-3 space-y-2">
            {constraints.filter(Boolean).map((constraint, index) => (
              <li key={`${constraint}-preview-${index}`} className="ml-5 list-disc text-sm text-[var(--color-text-soft)]">
                {renderBasicMath(constraint)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[var(--color-text-subtle)]">
            {/* TODO: considerar KaTeX si se necesita math complejo */}
            Math avanzado pendiente de evaluar.
          </p>
        </div>
      </div>
    </FormSection>
  )
}
