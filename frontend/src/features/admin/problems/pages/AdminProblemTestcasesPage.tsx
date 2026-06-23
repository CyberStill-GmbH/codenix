import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Plus, UploadCloud } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Link, useParams } from 'react-router-dom'

import { AdminNavbar } from '@/features/admin/problems/components/AdminNavbar'
import { AdminProblemStatusBadge } from '@/features/admin/problems/components/AdminProblemStatusBadge'
import { AdminTestcaseForm } from '@/features/admin/problems/components/AdminTestcaseForm'
import { AdminTestcasesTable } from '@/features/admin/problems/components/AdminTestcasesTable'
import { adminProblemsService } from '@/features/admin/problems/services/adminProblems.service'
import type {
  AdminProblem,
  AdminTestcase,
  AdminTestcasePayload,
} from '@/features/admin/problems/types/problem.types'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSection } from '@/components/motion/PageSection'
import { StaggerContainer } from '@/components/motion/StaggerContainer'

export function AdminProblemTestcasesPage() {
  const { problemId } = useParams<{ problemId: string }>()
  const [problem, setProblem] = useState<AdminProblem | null>(null)
  const [testcases, setTestcases] = useState<AdminTestcase[]>([])
  const [editingTestcase, setEditingTestcase] = useState<AdminTestcase | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [deletingTestcaseId, setDeletingTestcaseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadTestcases() {
      if (!problemId) {
        setError('Problem id is required.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const [nextProblem, nextTestcases] = await Promise.all([
          adminProblemsService.getProblem(problemId),
          adminProblemsService.getProblemTestcases(problemId),
        ])

        if (isMounted) {
          setProblem(nextProblem)
          setTestcases(nextTestcases)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'We could not load this problem testcases.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTestcases()

    return () => {
      isMounted = false
    }
  }, [problemId])

  const testcaseStats = useMemo(() => {
    const sampleCount = testcases.filter(
      (testcase) => testcase.visibility === 'sample',
    ).length
    const hiddenCount = testcases.filter(
      (testcase) => testcase.visibility === 'hidden',
    ).length

    return {
      total: testcases.length,
      sample: sampleCount,
      hidden: hiddenCount,
    }
  }, [testcases])

  const publishValidation = useMemo(() => {
    const hasSample = testcaseStats.sample > 0
    const hasHidden = testcaseStats.hidden > 0

    if (hasSample && hasHidden) {
      return { canPublish: true, message: 'Problem is ready to publish.' }
    }

    if (!hasSample && !hasHidden) {
      return {
        canPublish: false,
        message: 'Add at least 1 sample testcase and 1 hidden testcase before publishing.',
      }
    }

    return {
      canPublish: false,
      message: hasSample
        ? 'Add at least 1 hidden testcase before publishing.'
        : 'Add at least 1 sample testcase before publishing.',
    }
  }, [testcaseStats.hidden, testcaseStats.sample])

  const openCreateForm = () => {
    setEditingTestcase(null)
    setIsFormOpen(true)
    setFeedback(null)
  }

  const handleSubmit = async (payload: AdminTestcasePayload) => {
    if (!problemId) return

    try {
      setIsSubmitting(true)
      setError(null)

      const savedTestcase = editingTestcase
        ? await adminProblemsService.updateProblemTestcase(
            problemId,
            editingTestcase.id,
            payload,
          )
        : await adminProblemsService.createProblemTestcase(problemId, payload)

      setTestcases((currentTestcases) => {
        if (!editingTestcase) {
          return [savedTestcase, ...currentTestcases]
        }

        return currentTestcases.map((testcase) =>
          testcase.id === savedTestcase.id ? savedTestcase : testcase,
        )
      })

      const nextProblem = await adminProblemsService.getProblem(problemId)
      setProblem(nextProblem)
      setFeedback(editingTestcase ? 'Testcase updated.' : 'Testcase created.')
      setEditingTestcase(null)
      setIsFormOpen(false)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'We could not save the testcase. Try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (testcase: AdminTestcase) => {
    if (!problemId) return

    const confirmed = window.confirm('Delete this testcase? This action cannot be undone.')

    if (!confirmed) return

    try {
      setDeletingTestcaseId(testcase.id)
      setError(null)
      await adminProblemsService.deleteProblemTestcase(problemId, testcase.id)
      setTestcases((currentTestcases) =>
        currentTestcases.filter((currentTestcase) => currentTestcase.id !== testcase.id),
      )

      const nextProblem = await adminProblemsService.getProblem(problemId)
      setProblem(nextProblem)
      setFeedback('Testcase deleted.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'We could not delete the testcase. Try again.',
      )
    } finally {
      setDeletingTestcaseId(null)
    }
  }

  const handleTogglePublish = async () => {
    if (!problem) return

    const nextStatus = problem.status === 'published' ? 'draft' : 'published'

    if (nextStatus === 'published' && !publishValidation.canPublish) {
      setFeedback(null)
      setError(publishValidation.message)
      return
    }

    const confirmed = window.confirm(
      nextStatus === 'published'
        ? `Publish "${problem.title}"?`
        : `Unpublish "${problem.title}"?`,
    )

    if (!confirmed) return

    try {
      setIsPublishing(true)
      setError(null)

      const updatedProblem =
        nextStatus === 'published'
          ? await adminProblemsService.publishProblem(problem.id)
          : await adminProblemsService.unpublishProblem(problem.id)

      setProblem(updatedProblem)
      setFeedback(
        `"${updatedProblem.title}" is now ${
          updatedProblem.status === 'published' ? 'Published' : 'Draft'
        }.`,
      )
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : 'We could not update the publish status. Try again.',
      )
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AdminNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <StaggerContainer>
          <PageSection>
            <header className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
              <Link
                to="/admin/problems"
                className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to problems
              </Link>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-3xl font-bold tracking-normal text-[var(--color-text)]">
                      {problem?.title ?? 'Problem testcases'}
                    </h1>
                    {problem && <AdminProblemStatusBadge status={problem.status} />}
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
                    Manage sample cases shown to users and hidden judge cases used for
                    validation.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={openCreateForm}
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create testcase
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    disabled={!problem || isPublishing}
                    onClick={handleTogglePublish}
                    className="rounded-full"
                  >
                    <UploadCloud className="h-4 w-4" aria-hidden="true" />
                    {isPublishing
                      ? 'Saving'
                      : problem?.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                  </Button>
                </div>
              </div>
            </header>
          </PageSection>

          <PageSection delay={75}>
            <section className="grid gap-3 md:grid-cols-3">
              <AdminTestcaseMetric label="Total testcases" value={testcaseStats.total} />
              <AdminTestcaseMetric
                label="Sample testcases"
                value={testcaseStats.sample}
                tone="sample"
              />
              <AdminTestcaseMetric
                label="Hidden testcases"
                value={testcaseStats.hidden}
                tone="hidden"
              />
            </section>
          </PageSection>

          {problem?.status !== 'published' && !publishValidation.canPublish && (
            <div className="rounded-2xl border border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-warning)]">
              {publishValidation.message}
            </div>
          )}

          {feedback && (
            <div className="rounded-2xl border border-[var(--color-success)]/30 bg-[var(--color-success-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-success)]">
              {feedback}
            </div>
          )}

          {error && (
            <ErrorState message={error} />
          )}

          {isFormOpen && (
            <PageSection delay={100}>
              <AdminTestcaseForm
                key={editingTestcase?.id ?? 'new-testcase'}
                testcase={editingTestcase}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setEditingTestcase(null)
                  setIsFormOpen(false)
                }}
              />
            </PageSection>
          )}

          {isLoading ? (
            <AdminTestcasesLoadingState />
          ) : (
            <PageSection delay={200}>
              <AdminTestcasesTable
                testcases={testcases}
                deletingTestcaseId={deletingTestcaseId}
                onEdit={(testcase) => {
                  setEditingTestcase(testcase)
                  setIsFormOpen(true)
                  setFeedback(null)
                }}
                onDelete={handleDelete}
              />
            </PageSection>
          )}
        </StaggerContainer>
      </main>
    </div>
  )
}

type AdminTestcaseMetricProps = {
  label: string
  value: number
  tone?: 'default' | 'sample' | 'hidden'
}

const metricToneClassName: Record<NonNullable<AdminTestcaseMetricProps['tone']>, string> = {
  default: 'text-[var(--color-primary)] bg-[var(--color-primary-soft)]',
  sample: 'text-[var(--color-accent-muted)] bg-[var(--color-accent-muted-soft)]',
  hidden: 'text-[var(--color-warning)] bg-[var(--color-warning-soft)]',
}

function AdminTestcaseMetric({
  label,
  value,
  tone = 'default',
}: AdminTestcaseMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </span>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-2xl font-bold text-[var(--color-text)]">
          {value}
        </span>
        <span className={`h-2.5 w-2.5 rounded-full ${metricToneClassName[tone]}`} />
      </div>
    </div>
  )
}

function AdminTestcasesLoadingState() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="mb-2 grid min-h-20 animate-pulse gap-4 rounded-xl bg-slate-900/55 px-4 py-4 lg:grid-cols-[8rem_minmax(14rem,1fr)_minmax(14rem,1fr)_6rem_minmax(12rem,0.7fr)]"
        >
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-12 rounded-xl bg-slate-800" />
          <span className="h-12 rounded-xl bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
        </div>
      ))}
    </section>
  )
}
