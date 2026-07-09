import { useEffect, useMemo, useState } from 'react'

import { SubmissionFilters } from '@/features/submissions/components/SubmissionFilters'
import { SubmissionHistoryTable } from '@/features/submissions/components/SubmissionHistoryTable'
import { SubmissionSummary } from '@/features/submissions/components/SubmissionSummary'
import { TopicDistribution } from '@/features/submissions/components/TopicDistribution'
import { getSubmissions } from '@/features/submissions/services/submissionsApi'
import type { Submission } from '@/features/submissions/types/submission.types'
import type {
  SubmissionDifficultyFilter,
  SubmissionResultFilter,
  SubmissionSort,
} from '@/features/submissions/types/submission.types'
import { PageSection } from '@/components/motion/PageSection'
import { AppNavbar } from '@/shared/components/navigation/AppNavbar'

export function SubmissionsPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<SubmissionResultFilter>('All')
  const [difficulty, setDifficulty] = useState<SubmissionDifficultyFilter>('All')
  const [topic, setTopic] = useState('All')
  const [sort, setSort] = useState<SubmissionSort>('submitted-desc')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSubmissions() {
      try {
        setIsLoading(true)
        setLoadError('')
        const nextSubmissions = await getSubmissions({
          result,
          difficulty,
          topic,
          sort,
        })

        if (isMounted) {
          setSubmissions(nextSubmissions)
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar tus submissions.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSubmissions()

    return () => {
      isMounted = false
    }
  }, [difficulty, result, sort, topic])

  const topics = useMemo(
    () =>
      Array.from(
        new Set(submissions.flatMap((submission) => submission.topics)),
      ).sort((a, b) => a.localeCompare(b)),
    [submissions],
  )

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return submissions
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
  }, [difficulty, query, result, sort, submissions, topic])

  const handleResetFilters = () => {
    setQuery('')
    setResult('All')
    setDifficulty('All')
    setTopic('All')
    setSort('submitted-desc')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_30rem]">
          <div className="flex min-w-0 flex-col gap-5">
            <PageSection>
              <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
                Practice History
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Revisa tus envios, resultados y patrones de practica.
              </p>
            </PageSection>

            <PageSection delay={100} className="relative z-20">
              <SubmissionFilters
                query={query}
                result={result}
                difficulty={difficulty}
                topic={topic}
                topics={topics}
                sort={sort}
                onQueryChange={setQuery}
                onResultChange={setResult}
                onDifficultyChange={setDifficulty}
                onTopicChange={setTopic}
                onSortChange={setSort}
                onReset={handleResetFilters}
              />
            </PageSection>

            <PageSection delay={200} className="relative z-10">
              {isLoading && (
                <div className="mb-3 rounded-xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  Cargando submissions...
                </div>
              )}
              {loadError && (
                <div className="mb-3 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
                  {loadError}
                </div>
              )}
              <SubmissionHistoryTable submissions={filteredSubmissions} />
            </PageSection>
          </div>

          <aside className="flex min-w-0 flex-col gap-5">
            <PageSection delay={150}>
              <h2 className="font-display text-3xl font-bold text-[var(--color-text)]">
                Summary
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Vista general de tu rendimiento.
              </p>
            </PageSection>
            <PageSection delay={200}>
              <SubmissionSummary submissions={submissions} />
            </PageSection>
            <PageSection delay={300}>
              <TopicDistribution submissions={submissions} />
            </PageSection>
          </aside>
        </div>
      </main>
    </div>
  )
}
