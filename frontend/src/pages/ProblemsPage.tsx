import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ProblemsView } from '@/features/problems/components/ProblemsView'
import { getProblems, getProblemTopics } from '@/features/problems/services/problemsApi'
import type {
  Difficulty,
  Problem,
  ProblemSort,
  ProblemStatusFilter,
} from '@/features/problems/types/problem.types'
import { AppNavbar } from '@/shared/components/navigation/AppNavbar'

const difficultyOrder: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
}

export function ProblemsPage() {
  const [query, setQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [status, setStatus] = useState<ProblemStatusFilter>('all')
  const [sort, setSort] = useState<ProblemSort>('id-asc')
  const [problems, setProblems] = useState<Problem[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextPage, setNextPage] = useState(2)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      void loadProblems()
    }, query.trim() ? 300 : 0)

    async function loadProblems() {
      try {
        setIsLoading(true)
        setLoadError('')
        const apiTopic = selectedTopic === 'all' ? 'All Topics' : selectedTopic
        const [nextProblems, nextTopics] = await Promise.all([
          getProblems({ query, difficulty, topic: apiTopic, sort, page: 1, pageSize: 20 }, controller.signal),
          getProblemTopics(),
        ])

        if (isMounted) {
          setProblems(nextProblems.problems)
          setTotalAvailable(nextProblems.total)
          setHasMore(nextProblems.page < nextProblems.totalPages)
          setNextPage(2)
          setTopics(nextTopics)
        }
      } catch (error) {
        if (controller.signal.aborted) return
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar los problemas.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    return () => {
      isMounted = false
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [difficulty, query, selectedTopic, sort])

  const loadNextPage = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return
    loadingMoreRef.current = true
    setIsLoadingMore(true)
    const controller = new AbortController()
    try {
      const apiTopic = selectedTopic === 'all' ? 'All Topics' : selectedTopic
      const response = await getProblems(
        { query, difficulty, topic: apiTopic, sort, page: nextPage, pageSize: 20 },
        controller.signal,
      )
      setProblems((current) => [...current, ...response.problems])
      setTotalAvailable(response.total)
      setHasMore(response.page < response.totalPages)
      setNextPage((page) => page + 1)
    } catch (error) {
      if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : 'No pudimos cargar más problemas.')
    } finally {
      loadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [difficulty, hasMore, nextPage, query, selectedTopic, sort])

  useEffect(() => {
    const node = loadMoreRef.current
    if (!node || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadNextPage()
      },
      { rootMargin: '320px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadNextPage])

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return problems
      .filter((problem) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          problem.title.toLowerCase().includes(normalizedQuery) ||
          problem.topics.some((topic) => topic.toLowerCase().includes(normalizedQuery))

        const matchesTopic =
          selectedTopic === 'all' || problem.topics.includes(selectedTopic)

        const matchesDifficulty =
          difficulty === 'All' || problem.difficulty === difficulty

        const matchesStatus =
          status === 'all' ||
          (status === 'solved' && problem.solved) ||
          (status === 'unsolved' && !problem.solved)

        return matchesQuery && matchesTopic && matchesDifficulty && matchesStatus
      })
      .sort((a, b) => {
        if (sort === 'acceptance-desc') return b.acceptance - a.acceptance
        if (sort === 'acceptance-asc') return a.acceptance - b.acceptance
        if (sort === 'difficulty-asc') {
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.id - b.id
        }
        return a.id - b.id
      })
  }, [problems, difficulty, query, selectedTopic, sort, status])

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main id="main-content" className="codenix-app-shell codenix-user-main">
        <ProblemsView
          problems={filteredProblems}
          allProblems={problems}
          totalAvailable={totalAvailable}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMoreRef={loadMoreRef}
          topics={topics}
          query={query}
          selectedTopic={selectedTopic}
          difficulty={difficulty}
          status={status}
          sort={sort}
          isLoading={isLoading}
          error={loadError}
          onSearch={setQuery}
          onTopicChange={setSelectedTopic}
          onDifficultyChange={setDifficulty}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
      </main>
    </div>
  )
}
