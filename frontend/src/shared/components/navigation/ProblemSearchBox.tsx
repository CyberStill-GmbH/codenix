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
          className="h-8 w-full rounded-full border border-slate-700/60 bg-slate-950/70 pl-8 pr-3 text-xs font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-auth-placeholder)] transition duration-200 hover:border-slate-600/80 focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-auth-focus)]"
        />
      </label>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute right-0 top-10 z-50 w-[22rem] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 shadow-[0_18px_50px_rgba(2,8,23,0.42)]">
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
                className="block border-b border-slate-800/70 px-4 py-3 transition last:border-b-0 hover:bg-slate-900/80"
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
