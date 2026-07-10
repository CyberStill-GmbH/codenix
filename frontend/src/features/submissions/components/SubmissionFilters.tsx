import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Filter, RotateCcw, Search } from 'lucide-react'

import type {
  SubmissionDifficultyFilter,
  SubmissionResultFilter,
  SubmissionSort,
} from '@/features/submissions/types/submission.types'

const RESULT_OPTIONS = [
  { value: 'All', label: 'Todos' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Wrong Answer', label: 'Wrong Answer' },
  { value: 'Runtime Error', label: 'Runtime Error' },
  { value: 'Time Limit Exceeded', label: 'Time Limit Exceeded' },
  { value: 'Compilation Error', label: 'Compilation Error' },
] as const

const DIFFICULTY_OPTIONS = [
  { value: 'All', label: 'Todas' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
] as const

const SORT_OPTIONS = [
  { value: 'submitted-desc', label: 'Más recientes' },
  { value: 'submitted-asc', label: 'Más antiguos' },
  { value: 'submissions-desc', label: 'Más intentos' },
  { value: 'acceptance-desc', label: 'Mayor aceptación' },
] as const

type SubmissionFiltersProps = {
  query: string
  result: SubmissionResultFilter
  difficulty: SubmissionDifficultyFilter
  topic: string
  topics: string[]
  sort: SubmissionSort
  onQueryChange: (query: string) => void
  onResultChange: (result: SubmissionResultFilter) => void
  onDifficultyChange: (difficulty: SubmissionDifficultyFilter) => void
  onTopicChange: (topic: string) => void
  onSortChange: (sort: SubmissionSort) => void
  onReset: () => void
}

function CustomSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  displayValue,
}: {
  label: string
  value: T
  options: readonly { readonly value: T; readonly label: string }[] | { value: T; label: string }[]
  onChange: (value: T) => void
  displayValue: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5 w-full">
      <span className="text-xs font-bold text-[var(--color-text-muted)]">{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-soft)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] transition cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-subtle)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[4.25rem] z-50 max-h-52 w-full overflow-y-auto rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] py-1 shadow-2xl scrollbar-thin">
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-[var(--color-surface)] ${
                  isSelected
                    ? 'bg-[var(--color-surface)] font-semibold text-[var(--color-primary)]'
                    : 'text-[var(--color-text-soft)] hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SubmissionFilters({
  query,
  result,
  difficulty,
  topic,
  topics,
  sort,
  onQueryChange,
  onResultChange,
  onDifficultyChange,
  onTopicChange,
  onSortChange,
  onReset,
}: SubmissionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const filterContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const hasActiveFilters =
    query !== '' ||
    result !== 'All' ||
    difficulty !== 'All' ||
    topic !== 'All' ||
    sort !== 'submitted-desc'

  const topicOptions = [
    { value: 'All', label: 'Todos' },
    ...topics.map((t) => ({ value: t, label: t })),
  ]

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-lg)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Buscar envio</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search submissions"
            className="h-11 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] pl-10 pr-4 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </label>

        <div ref={filterContainerRef} className="relative flex flex-wrap items-center gap-2 lg:ml-auto">
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((v) => !v)}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 ${
              isExpanded
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]'
            }`}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </button>

          {isExpanded && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-xl)] animate-[user-menu-fade-in_120ms_ease-out_both] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2 mb-2">
                <span className="text-xs font-bold text-[var(--color-text)]">Filtros</span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restablecer
                  </button>
                )}
              </div>

              <CustomSelect
                label="Resultado"
                value={result}
                options={RESULT_OPTIONS}
                onChange={onResultChange}
                displayValue={RESULT_OPTIONS.find((o) => o.value === result)?.label ?? result}
              />

              <CustomSelect
                label="Dificultad"
                value={difficulty}
                options={DIFFICULTY_OPTIONS}
                onChange={onDifficultyChange}
                displayValue={DIFFICULTY_OPTIONS.find((o) => o.value === difficulty)?.label ?? difficulty}
              />

              <CustomSelect
                label="Tema"
                value={topic}
                options={topicOptions}
                onChange={onTopicChange}
                displayValue={topicOptions.find((o) => o.value === topic)?.label ?? topic}
              />

              <CustomSelect
                label="Ordenar por"
                value={sort}
                options={SORT_OPTIONS}
                onChange={onSortChange}
                displayValue={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? sort}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

