import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { t, translateTopic } from '@/features/problems/utils/problemsI18n'

type TopicFiltersProps = {
  topics: string[]
  selected: string
  onSelect: (topic: string) => void
}

function ScrollButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  const positionClassName = direction === 'left' ? 'left-0' : 'right-0'
  const gradientClassName =
    direction === 'left'
      ? 'bg-gradient-to-r from-[var(--color-surface)] via-[var(--color-surface)] to-transparent'
      : 'bg-gradient-to-l from-[var(--color-surface)] via-[var(--color-surface)] to-transparent'

  return (
    <div className={`pointer-events-none absolute inset-y-0 ${positionClassName} flex w-14 items-center justify-center ${gradientClassName}`}>
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]"
        aria-label={direction === 'left' ? 'Desplazar temas a la izquierda' : 'Desplazar temas a la derecha'}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function TopicFilters({ topics, selected, onSelect }: TopicFiltersProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const allTopics = ['all', ...topics]

  function updateScrollState() {
    const element = scrollRef.current
    if (!element) return

    setCanScrollLeft(element.scrollLeft > 4)
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const element = scrollRef.current
    if (!element) return

    element.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      element.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [topics])

  function scrollBy(offset: number) {
    scrollRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <div className="relative" aria-label="Filtrar por tema">
      {canScrollLeft && <ScrollButton direction="left" onClick={() => scrollBy(-240)} />}
      <div
        ref={scrollRef}
        className="topic-filters-scroll flex gap-2 overflow-x-auto pb-1"
      >
        {allTopics.map((topic) => {
          const isSelected = selected === topic
          const label = topic === 'all' ? t('filters.allTopics') : translateTopic(topic)

          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelect(topic)}
              className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-4 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] font-medium text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      {canScrollRight && <ScrollButton direction="right" onClick={() => scrollBy(240)} />}
    </div>
  )
}
