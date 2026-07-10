import { useEffect, useMemo, useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AdminNavbar } from '@/features/admin/problems/components/AdminNavbar'
import { AdminProblemFilters } from '@/features/admin/problems/components/AdminProblemFilters'
import { AdminProblemsTable } from '@/features/admin/problems/components/AdminProblemsTable'
import { adminProblemsService } from '@/features/admin/problems/services/adminProblems.service'
import type {
  AdminProblem,
  AdminProblemFiltersState,
} from '@/features/admin/problems/types/problem.types'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSection } from '@/components/motion/PageSection'
import { StaggerContainer } from '@/components/motion/StaggerContainer'

const initialFilters: AdminProblemFiltersState = {
  search: '',
  difficulty: 'all',
  status: 'all',
  tag: 'all',
}

export function AdminProblemsPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<AdminProblem[]>([])
  const [filters, setFilters] = useState<AdminProblemFiltersState>(initialFilters)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingProblemId, setUpdatingProblemId] = useState<string | null>(null)
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProblems() {
      try {
        setIsLoading(true)
        setError(null)
        const nextProblems = await adminProblemsService.getProblems()

        if (isMounted) {
          setProblems(nextProblems)
        }
      } catch {
        if (isMounted) {
          setError('We could not load the admin problem list.')
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
  }, [])

  const filteredProblems = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()

    return problems.filter((problem) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        problem.title.toLowerCase().includes(normalizedSearch)

      const matchesDifficulty =
        filters.difficulty === 'all' || problem.difficulty === filters.difficulty

      const matchesStatus = filters.status === 'all' || problem.status === filters.status

      const matchesTag = filters.tag === 'all' || problem.tags.includes(filters.tag)

      return matchesSearch && matchesDifficulty && matchesStatus && matchesTag
    })
  }, [filters, problems])

  const publishedCount = problems.filter((problem) => problem.status === 'published').length
  const draftCount = problems.length - publishedCount
  const availableTags = useMemo(
    () =>
      Array.from(new Set(problems.flatMap((problem) => problem.tags))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [problems],
  )

  const updateFilters = <Key extends keyof AdminProblemFiltersState>(
    key: Key,
    value: AdminProblemFiltersState[Key],
  ) => {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }))
  }

  const handleTogglePublish = async (problem: AdminProblem) => {
    const nextStatus = problem.status === 'published' ? 'draft' : 'published'
    const confirmationText =
      nextStatus === 'published'
        ? `Publish "${problem.title}"?`
        : `Unpublish "${problem.title}"?`

    const confirmed = window.confirm(confirmationText)

    if (!confirmed) return

    try {
      setUpdatingProblemId(problem.id)
      setConfirmationMessage(null)

      const updatedProblem =
        nextStatus === 'published'
          ? await adminProblemsService.publishProblem(problem.id)
          : await adminProblemsService.unpublishProblem(problem.id)

      setProblems((currentProblems) =>
        currentProblems.map((currentProblem) =>
          currentProblem.id === updatedProblem.id ? updatedProblem : currentProblem,
        ),
      )

      setConfirmationMessage(
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
      setUpdatingProblemId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AdminNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <StaggerContainer>
          <PageSection>
            <header className="flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)] md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                  Admin Console
                </div>
                <h1 className="mt-2 font-display text-3xl font-bold tracking-normal text-[var(--color-text)]">
                  Problem Management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
                  Create, curate, publish and maintain Codenix problems before they reach
                  the user catalog.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/problems/new')}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-sky-300/30 bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-accent)_100%)] px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(14,165,233,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(14,165,233,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create problem
              </button>
            </header>
          </PageSection>

          <PageSection delay={75}>
            <section className="grid gap-3 md:grid-cols-3">
              <AdminMetric label="Total problems" value={problems.length} />
              <AdminMetric label="Published" value={publishedCount} tone="success" />
              <AdminMetric label="Drafts" value={draftCount} tone="warning" />
            </section>
          </PageSection>

          {confirmationMessage && (
            <div className="rounded-2xl border border-[var(--color-success)]/30 bg-[var(--color-success-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-success)]">
              {confirmationMessage}
            </div>
          )}

          <PageSection delay={150}>
            <AdminProblemFilters
              search={filters.search}
              difficulty={filters.difficulty}
              status={filters.status}
              tag={filters.tag}
              tags={availableTags}
              resultCount={filteredProblems.length}
              totalCount={problems.length}
              onSearchChange={(search) => updateFilters('search', search)}
              onDifficultyChange={(difficulty) => updateFilters('difficulty', difficulty)}
              onStatusChange={(status) => updateFilters('status', status)}
              onTagChange={(tag) => updateFilters('tag', tag)}
            />
          </PageSection>

          {isLoading && <AdminProblemsLoadingState />}

          {error && !isLoading && (
            <ErrorState message={error} />
          )}

          {!isLoading && !error && (
            <PageSection delay={200}>
              <AdminProblemsTable
                problems={filteredProblems}
                updatingProblemId={updatingProblemId}
                onEdit={(problem) => navigate(`/admin/problems/${problem.id}/edit`)}
                onManageTestcases={(problem) =>
                  navigate(`/admin/problems/${problem.id}/edit`)
                }
                onTogglePublish={handleTogglePublish}
              />
            </PageSection>
          )}
        </StaggerContainer>
      </main>
    </div>
  )
}

type AdminMetricProps = {
  label: string
  value: number
  tone?: 'default' | 'success' | 'warning'
}

const metricToneClassName: Record<NonNullable<AdminMetricProps['tone']>, string> = {
  default: 'text-[var(--color-primary)] bg-[var(--color-primary-soft)]',
  success: 'text-[var(--color-success)] bg-[var(--color-success-soft)]',
  warning: 'text-[var(--color-warning)] bg-[var(--color-warning-soft)]',
}

function AdminMetric({ label, value, tone = 'default' }: AdminMetricProps) {
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

function AdminProblemsLoadingState() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="mb-2 grid min-h-16 animate-pulse gap-4 rounded-xl bg-slate-900/55 px-4 py-4 xl:grid-cols-[minmax(16rem,1.4fr)_7rem_minmax(12rem,1fr)_8rem_7rem_8rem_minmax(18rem,1fr)]"
        >
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
          <span className="h-4 rounded-full bg-slate-800" />
        </div>
      ))}
    </section>
  )
}
