import { useMemo, useState } from 'react'

import { ProblemFilters } from '@/features/problems/components/ProblemFilters'
import { ProblemHeroCards } from '@/features/problems/components/ProblemHeroCards'
import { ProblemList } from '@/features/problems/components/ProblemList'
import { TopicChips } from '@/features/problems/components/TopicChips'
import { problemsMock, problemTopics } from '@/features/problems/data/problems.mock'
import type {
  Difficulty,
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
  const [selectedTopic, setSelectedTopic] = useState('All Topics')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [status, setStatus] = useState<ProblemStatusFilter>('all')
  const [sort, setSort] = useState<ProblemSort>('id-asc')

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return problemsMock
      .filter((problem) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          problem.title.toLowerCase().includes(normalizedQuery) ||
          problem.topics.some((topic) => topic.toLowerCase().includes(normalizedQuery))

        const matchesTopic =
          selectedTopic === 'All Topics' || problem.topics.includes(selectedTopic)

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
  }, [difficulty, query, selectedTopic, sort, status])

  const solvedCount = problemsMock.filter((problem) => problem.solved).length

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <div className="flex flex-col gap-6">
          <ProblemHeroCards problems={problemsMock} />

          <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
            <TopicChips
              topics={problemTopics}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
            <ProblemFilters
              query={query}
              difficulty={difficulty}
              status={status}
              sort={sort}
              solvedCount={solvedCount}
              totalCount={problemsMock.length}
              onQueryChange={setQuery}
              onDifficultyChange={setDifficulty}
              onStatusChange={setStatus}
              onSortChange={setSort}
            />
          </section>

          <ProblemList problems={filteredProblems} />
        </div>
      </main>
    </div>
  )
}
