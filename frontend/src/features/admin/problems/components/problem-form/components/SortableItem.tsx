import type { ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Reordenar"
          className="absolute right-3 top-3 z-10 opacity-0 touch-none group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </Button>
        {children}
      </div>
    </div>
  )
}
