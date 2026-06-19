import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, FilePenLine, Plus } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { AdminNavbar } from '@/features/admin/problems/components/AdminNavbar'
import { AdminProblemForm } from '@/features/admin/problems/components/AdminProblemForm'
import {
  createDefaultCodeTemplates,
  createDefaultProblemParameters,
  createDefaultStarterCode,
  createDefaultStructuredTestcases,
} from '@/features/admin/problems/data/adminProblemDetails.mock'
import { adminProblemsService } from '@/features/admin/problems/services/adminProblems.service'
import type {
  AdminProblemDetails,
  AdminProblemFormValues,
} from '@/features/admin/problems/types/problem.types'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSection } from '@/components/motion/PageSection'
import { StaggerContainer } from '@/components/motion/StaggerContainer'

type LocationState = {
  message?: string
}

const emptyProblemFormValues: AdminProblemFormValues = {
  title: '',
  slug: '',
  difficulty: 'easy',
  tags: [],
  descriptionMarkdown:
    '## Descripcion\n\nEscribe el enunciado del problema aqui...\n\n## Ejemplos\n\n...',
  constraintsList: ['1 <= nums.length <= 10^4', 'nums[i] es unico'],
  parameters: createDefaultProblemParameters(),
  outputType: 'number[]',
  testcases: createDefaultStructuredTestcases(),
  supportedLanguages: ['typescript', 'javascript', 'python', 'java'],
  starterCode: createDefaultStarterCode(),
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  status: 'draft',
  statement: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  examples: [],
  codeTemplates: createDefaultCodeTemplates(),
}

export function AdminProblemFormPage() {
  const { problemId } = useParams<{ problemId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | null
  const isEditMode = Boolean(problemId)

  const [problem, setProblem] = useState<AdminProblemDetails | null>(null)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(locationState?.message ?? null)

  useEffect(() => {
    let isMounted = true

    async function loadProblem() {
      if (!problemId) return

      try {
        setIsLoading(true)
        setError(null)
        const nextProblem = await adminProblemsService.getProblemDetails(problemId)

        if (isMounted) {
          setProblem(nextProblem)
        }
      } catch {
        if (isMounted) {
          setError('We could not load this problem for editing.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProblem()

    return () => {
      isMounted = false
    }
  }, [problemId])

  const initialValues = useMemo<AdminProblemFormValues>(() => {
    if (!problem) {
      return emptyProblemFormValues
    }

    return {
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      tags: [...problem.tags],
      descriptionMarkdown: problem.descriptionMarkdown || problem.statement,
      constraintsList:
        problem.constraintsList?.length > 0
          ? [...problem.constraintsList]
          : problem.constraints.split('\n').filter(Boolean),
      parameters:
        problem.parameters?.length > 0
          ? problem.parameters.map((parameter) => ({ ...parameter }))
          : createDefaultProblemParameters(),
      outputType: problem.outputType ?? 'object',
      testcases:
        problem.testcases?.length > 0
          ? problem.testcases.map((testcase) => ({ ...testcase, input: { ...testcase.input } }))
          : createDefaultStructuredTestcases(),
      supportedLanguages:
        problem.supportedLanguages?.length > 0
          ? [...problem.supportedLanguages]
          : ['typescript', 'javascript', 'python', 'java'],
      starterCode: { ...createDefaultStarterCode(), ...problem.starterCode },
      timeLimitMs: problem.timeLimitMs ?? 2000,
      memoryLimitMb: problem.memoryLimitMb ?? 256,
      status: problem.status,
      statement: problem.statement,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints,
      examples: problem.examples.map((example) => ({ ...example })),
      codeTemplates: problem.codeTemplates.map((template) => ({ ...template })),
    }
  }, [problem])

  const handleSubmit = async (values: AdminProblemFormValues) => {
    try {
      setIsSaving(true)
      setError(null)
      setFeedback(null)

      if (isEditMode && problemId) {
        const updatedProblem = await adminProblemsService.updateProblem(problemId, values)
        setProblem(updatedProblem)
        setFeedback('Problem changes saved.')
        return
      }

      const createdProblem = await adminProblemsService.createProblem(values)
      navigate(`/admin/problems/${createdProblem.slug}/edit`, {
        replace: true,
        state: { message: 'Problem draft created.' },
      })
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'We could not save this problem. Try again.',
      )
    } finally {
      setIsSaving(false)
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

              <div className="mt-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  {isEditMode ? (
                    <FilePenLine className="h-4 w-4 text-[var(--color-primary)]" />
                  ) : (
                    <Plus className="h-4 w-4 text-[var(--color-primary)]" />
                  )}
                  {isEditMode ? 'Edit problem' : 'New draft'}
                </div>
                <h1 className="font-display text-3xl font-bold tracking-normal text-[var(--color-text)]">
                  {isEditMode ? problem?.title ?? 'Edit problem' : 'Create problem'}
                </h1>
                <p className="max-w-2xl text-sm text-[var(--color-text-muted)]">
                  Draft the statement, examples and starter code before publishing to the
                  Codenix catalog.
                </p>
              </div>
            </header>
          </PageSection>

          {feedback && (
            <div className="rounded-2xl border border-[var(--color-success)]/30 bg-[var(--color-success-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-success)]">
              {feedback}
            </div>
          )}

          {error && (
            <ErrorState message={error} />
          )}

          {isLoading ? (
            <AdminProblemFormLoadingState />
          ) : (
            <PageSection delay={100}>
              <AdminProblemForm
                key={problem?.id ?? 'new-problem'}
                initialValues={initialValues}
                mode={isEditMode ? 'edit' : 'create'}
                isSaving={isSaving}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/problems')}
              />
            </PageSection>
          )}
        </StaggerContainer>
      </main>
    </div>
  )
}

function AdminProblemFormLoadingState() {
  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="animate-pulse space-y-4">
        <span className="block h-6 w-48 rounded-full bg-slate-800" />
        <span className="block h-11 rounded-2xl bg-slate-800" />
        <span className="block h-11 rounded-2xl bg-slate-800" />
        <span className="block h-44 rounded-2xl bg-slate-800" />
      </div>
    </section>
  )
}
