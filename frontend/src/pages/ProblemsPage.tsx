import { useEffect, useMemo, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadProblems() {
      try {
        setIsLoading(true)
        setLoadError('')
        const apiTopic = selectedTopic === 'all' ? 'All Topics' : selectedTopic
        const [nextProblems, nextTopics] = await Promise.all([
          getProblems({ query, difficulty, topic: apiTopic, sort }),
          getProblemTopics(),
        ])

        if (isMounted) {
          setProblems(nextProblems)
          setTopics(nextTopics)
        }
      } catch (error) {
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

    loadProblems()

    return () => {
      isMounted = false
    }
  }, [difficulty, query, selectedTopic, sort])

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

      <main className="codenix-app-shell codenix-user-main">
        <ProblemsView
          problems={filteredProblems}
          allProblems={problems}
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
