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
          setError('No se pudo cargar la lista de problemas.')
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
        ? `¿Publicar «${problem.title}»?`
        : `¿Retirar «${problem.title}»?`

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
        `«${updatedProblem.title}» ahora está ${
          updatedProblem.status === 'published' ? 'publicado' : 'borrador'
        }.`,
      )
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : 'No se pudo actualizar el estado de publicación. Inténtalo de nuevo.',
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
            <header className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />
                  Administración
                </div>
                <h1 className="mt-2 font-display text-3xl font-bold tracking-normal text-[var(--color-text)]">
                  Gestión de problemas
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
                  Crea, revisa y publica los problemas antes de que lleguen al catálogo de usuarios.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/problems/new')}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition-colors duration-150 hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Crear problema
              </button>
            </header>
          </PageSection>

          <PageSection delay={75}>
            <section className="grid gap-3 md:grid-cols-3">
              <AdminMetric label="Problemas" value={problems.length} />
              <AdminMetric label="Publicados" value={publishedCount} tone="success" />
              <AdminMetric label="Borradores" value={draftCount} tone="warning" />
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
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
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
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="mb-2 grid min-h-16 animate-pulse gap-4 rounded-xl bg-[var(--color-surface-soft)] px-4 py-4 xl:grid-cols-[minmax(16rem,1.4fr)_7rem_minmax(12rem,1fr)_8rem_7rem_8rem_minmax(18rem,1fr)]"
        >
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
          <span className="h-4 rounded-full bg-[var(--color-border)]" />
        </div>
      ))}
    </section>
  )
}
