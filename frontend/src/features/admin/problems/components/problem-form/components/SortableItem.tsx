import type { ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortableItemProps = {
  id: string
  children: ReactNode
  className?: string
}

export function SortableItem({ id, children, className = '' }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${isDragging ? 'relative z-20 opacity-80' : ''} ${className}`}
    >
      <div className="group relative">
        <button
          type="button"
          aria-label="Reordenar"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 touch-none items-center justify-center rounded-lg text-[var(--color-text-muted)] opacity-0 transition hover:bg-slate-900 hover:text-white group-hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  )
}
