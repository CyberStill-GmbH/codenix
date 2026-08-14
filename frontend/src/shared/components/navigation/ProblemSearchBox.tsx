import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

import {
  searchProblems,
  type ProblemSearchResult,
} from '@/features/problems/services/problemsApi'

const difficultyClassName: Record<ProblemSearchResult['difficulty'], string> = {
  Easy: 'text-[var(--color-difficulty-easy)]',
  Medium: 'text-[var(--color-difficulty-medium)]',
  Hard: 'text-[var(--color-difficulty-hard)]',
}

export function ProblemSearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProblemSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true)
        setError('')
        const nextResults = await searchProblems(query.trim())
        setResults(nextResults)
        setIsOpen(true)
      } catch (requestError) {
        setResults([])
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No pudimos buscar problemas.',
        )
      } finally {
        setIsLoading(false)
      }
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative hidden min-w-0 w-[17rem] lg:block xl:w-[20rem]">
      <label className="relative block">
        <span className="sr-only">Buscar problemas</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-auth-icon)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          placeholder="Buscar problemas"
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            setIsOpen(true)
            if (nextQuery.trim().length < 2) {
              setResults([])
              setError('')
              setIsLoading(false)
            }
          }}
          onFocus={() => setIsOpen(true)}
          className="h-8 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-3 text-xs font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] transition duration-200 hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-auth-focus)]"
        />
      </label>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute right-0 top-10 z-50 w-[22rem] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-floating)]">
          {isLoading && (
            <div className="px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)]">
              Buscando...
            </div>
          )}

          {error && !isLoading && (
            <div className="px-4 py-3 text-xs font-semibold text-[var(--color-error)]">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)]">
              Sin resultados.
            </div>
          )}

          {!isLoading &&
            !error &&
            results.map((problem) => (
              <Link
                key={problem.id}
                to={`/problems/${problem.slug}`}
                onClick={() => setIsOpen(false)}
                className="block border-b border-[var(--color-border-soft)] px-4 py-3 transition last:border-b-0 hover:bg-[var(--color-surface-soft)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {problem.numericId}. {problem.title}
                  </span>
                  <span className={`text-xs font-bold ${difficultyClassName[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
                {problem.topics.length > 0 && (
                  <p className="mt-1 truncate text-xs text-[var(--color-text-subtle)]">
                    {problem.topics.join(' · ')}
                  </p>
                )}
              </Link>
            ))}
        </div>
      )}
    </div>
  )
}
