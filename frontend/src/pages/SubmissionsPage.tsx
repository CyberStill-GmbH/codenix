import { useMemo, useState } from 'react'

import { SubmissionFilters } from '@/features/submissions/components/SubmissionFilters'
import { SubmissionHistoryTable } from '@/features/submissions/components/SubmissionHistoryTable'
import { SubmissionSummary } from '@/features/submissions/components/SubmissionSummary'
import { TopicDistribution } from '@/features/submissions/components/TopicDistribution'
import { submissionsMock, submissionTopics } from '@/features/submissions/data/submissions.mock'
import type {
  SubmissionDifficultyFilter,
  SubmissionResultFilter,
  SubmissionSort,
} from '@/features/submissions/types/submission.types'
import { AppNavbar } from '@/shared/components/navigation/AppNavbar'

export function SubmissionsPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SubmissionResultFilter>('All')
  const [difficulty, setDifficulty] = useState<SubmissionDifficultyFilter>('All')
  const [topic, setTopic] = useState('All')
  const [sort, setSort] = useState<SubmissionSort>('submitted-desc')

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return submissionsMock
      .filter((submission) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          submission.problemTitle.toLowerCase().includes(normalizedQuery) ||
          submission.topics.some((item) => item.toLowerCase().includes(normalizedQuery))

        const matchesResult = result === 'All' || submission.result === result
        const matchesDifficulty = difficulty === 'All' || submission.difficulty === difficulty
        const matchesTopic = topic === 'All' || submission.topics.includes(topic)

        return matchesQuery && matchesResult && matchesDifficulty && matchesTopic
      })
      .sort((a, b) => {
        if (sort === 'submitted-asc') {
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        }
        if (sort === 'submissions-desc') {
          return b.submissionsCount - a.submissionsCount
        }
        if (sort === 'acceptance-desc') {
          return b.acceptance - a.acceptance
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      })
  }, [difficulty, query, result, sort, topic])

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_30rem]">
          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
                Practice History
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Revisa tus envios, resultados y patrones de practica.
              </p>
            </div>

            <SubmissionFilters
              query={query}
              result={result}
              difficulty={difficulty}
              topic={topic}
              topics={submissionTopics}
              sort={sort}
              onQueryChange={setQuery}
              onResultChange={setResult}
              onDifficultyChange={setDifficulty}
              onTopicChange={setTopic}
              onSortChange={setSort}
            />

            <SubmissionHistoryTable submissions={filteredSubmissions} />
          </div>

          <aside className="flex min-w-0 flex-col gap-5">
            <div>
              <h2 className="font-display text-3xl font-bold text-[var(--color-text)]">
                Summary
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Vista general de tu rendimiento.
              </p>
            </div>
            <SubmissionSummary submissions={submissionsMock} />
            <TopicDistribution submissions={submissionsMock} />
          </aside>
        </div>
      </main>
    </div>
  )
}
