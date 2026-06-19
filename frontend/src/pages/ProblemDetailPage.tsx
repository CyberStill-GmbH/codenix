import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { PageSection } from '@/components/motion/PageSection'
import {
  CodeWorkspace,
  type CodeWorkspaceActionState,
  type CodeWorkspaceHandle,
} from '@/features/coding/components/CodeWorkspace'
import { EditorNavbar } from '@/features/coding/components/editor/navbar'
import { ProblemContentTabs } from '@/features/coding/components/ProblemContentTabs'
import { ResizableSplitPane } from '@/features/coding/components/ResizableSplitPane'
import type {
  CodingTestcase,
  TestcaseRunResult,
} from '@/features/coding/types/coding.types'
import { readStoredSplitPercent } from '@/features/coding/utils/splitPaneStorage'
import { useAuth } from '@/features/auth/context/useAuth'
import { getProblemBySlug, getProblems } from '@/features/problems/services/problemsApi'
import type { Problem, ProblemCodeLanguage } from '@/features/problems/types/problem.types'
import { AppNavbar } from '@/shared/components/navigation/AppNavbar'

type CodeLoadState = {
  request: {
    code: string
    language: ProblemCodeLanguage
    submissionId: string
  } | null
  version: number
}

function createInitialTestcases(problem: Problem) {
  return problem.examples.map<CodingTestcase>((example, index) => ({
    id: example.id || `example-${index + 1}`,
    input: example.input,
    expectedOutput: example.output,
  }))
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

const initialActionState: CodeWorkspaceActionState = {
  isRunning: false,
  isSubmitting: false,
  isBusy: false,
  isEditorEmpty: false,
}

export function ProblemDetailPage() {
  const { problemSlug } = useParams<{ problemSlug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const workspaceRef = useRef<CodeWorkspaceHandle>(null)
  const [problem, setProblem] = useState<Problem | undefined>()
  const [problemCatalog, setProblemCatalog] = useState<Problem[]>([])
  const [isLoadingProblem, setIsLoadingProblem] = useState(true)
  const [problemError, setProblemError] = useState('')
  const problemIndex = problem
    ? problemCatalog.findIndex((item) => item.slug === problem.slug)
    : -1
  const previousProblem = problemIndex > 0 ? problemCatalog[problemIndex - 1] : undefined
  const nextProblem =
    problemIndex >= 0 && problemIndex < problemCatalog.length - 1
      ? problemCatalog[problemIndex + 1]
      : undefined
  const initialTestcases = useMemo(
    () => (problem ? createInitialTestcases(problem) : []),
    [problem],
  )
  const isMobile = useIsMobileViewport()
  const [testcases, setTestcases] = useState<CodingTestcase[]>(initialTestcases)
  const [runResults, setRunResults] = useState<TestcaseRunResult[]>([])
  const [submissionsRefreshKey, setSubmissionsRefreshKey] = useState(0)
  const [codeLoadState, setCodeLoadState] = useState<CodeLoadState>({
    request: null,
    version: 0,
  })
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const [horizontalPanelPercent, setHorizontalPanelPercent] = useState(() =>
    readStoredSplitPercent(
      'codenix_split_horizontal',
      window.innerWidth >= 1024 ? 50 : 40,
    ),
  )
  const [actionState, setActionState] =
    useState<CodeWorkspaceActionState>(initialActionState)

  useEffect(() => {
    if (!problemSlug) return

    let isMounted = true
    const slug = problemSlug

    async function loadProblem() {
      try {
        setIsLoadingProblem(true)
        setProblemError('')
        const [nextProblem, nextCatalog] = await Promise.all([
          getProblemBySlug(slug),
          getProblems({
            query: '',
            difficulty: 'All',
            topic: 'All Topics',
            sort: 'id-asc',
          }),
        ])

        if (isMounted) {
          setProblem(nextProblem)
          setProblemCatalog(nextCatalog)
          if (nextProblem) {
            setTestcases(createInitialTestcases(nextProblem))
            setRunResults([])
            setCodeLoadState({ request: null, version: 0 })
          }
        }
      } catch (error) {
        if (isMounted) {
          setProblemError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar este problema.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingProblem(false)
        }
      }
    }

    loadProblem()

    return () => {
      isMounted = false
    }
  }, [problemSlug])

  const handleNavigateToProblem = useCallback(
    (slug: string) => {
      navigate(`/problems/${slug}`)
    },
    [navigate],
  )

  const handleNavigateToRandomProblem = useCallback(() => {
    if (!problem || problemCatalog.length <= 1) return

    const candidates = problemCatalog.filter((item) => item.slug !== problem.slug)
    const nextProblem = candidates[Math.floor(Math.random() * candidates.length)]
    if (nextProblem) navigate(`/problems/${nextProblem.slug}`)
  }, [navigate, problem, problemCatalog])

  const handleRun = useCallback(() => {
    workspaceRef.current?.run()
  }, [])

  const handleSubmit = useCallback(() => {
    workspaceRef.current?.submit()
  }, [])

  if (!problem) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <AppNavbar />
        <main className="codenix-app-shell codenix-user-main">
          <EmptyState
            title={isLoadingProblem ? 'Loading problem' : 'Problem not found'}
            description={
              isLoadingProblem
                ? 'Estamos cargando el enunciado desde la API.'
                : problemError || 'The requested problem is not available in the current catalog.'
            }
          />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <EditorNavbar
        problemId={problem.id}
        user={user}
        previousProblem={previousProblem}
        nextProblem={nextProblem}
        canNavigateRandom={problemCatalog.length > 1}
        isRunning={actionState.isRunning}
        isSubmitting={actionState.isSubmitting}
        isEditorEmpty={actionState.isEditorEmpty}
        onRun={handleRun}
        onSubmit={handleSubmit}
        onNavigateToProblem={handleNavigateToProblem}
        onNavigateToRandomProblem={handleNavigateToRandomProblem}
      />

      <main className="min-h-0 flex-1 px-3 pb-3 pt-0 md:px-4">
        {isMobile ? (
        <div className="flex h-full min-h-0 flex-col gap-3">
          <button
            type="button"
            onClick={() => setIsDescriptionOpen((current) => !current)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 text-sm font-bold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:text-white"
          >
            {isDescriptionOpen ? 'Ocultar descripcion' : 'Ver descripcion'}
          </button>

          {isDescriptionOpen && (
            <PageSection className="h-[42vh] min-h-0">
              <ProblemContentTabs
                problem={problem}
                testcases={testcases}
                runResults={runResults}
                submissionsRefreshKey={submissionsRefreshKey}
                onTestcasesChange={setTestcases}
                onLoadSubmissionCode={(request) =>
                  setCodeLoadState((current) => ({
                    request,
                    version: current.version + 1,
                  }))
                }
              />
            </PageSection>
          )}

          <PageSection delay={100} className="min-h-0 flex-1">
            <CodeWorkspace
              ref={workspaceRef}
              key={`${problem.slug}:${codeLoadState.version}`}
              problemId={problem.apiId ?? problem.id}
              codeTemplates={problem.codeTemplates}
              initialCodeLoad={codeLoadState.request}
              onRunResultsChange={setRunResults}
              onAcceptedSubmit={() =>
                setSubmissionsRefreshKey((current) => current + 1)
              }
              onActionStateChange={setActionState}
            />
          </PageSection>
        </div>
        ) : (

        <ResizableSplitPane
          orientation="horizontal"
          storageKey="codenix_split_horizontal"
          defaultPrimaryPercent={window.innerWidth >= 1024 ? 50 : 40}
          primaryPercent={horizontalPanelPercent}
          onPrimaryPercentChange={setHorizontalPanelPercent}
          minPrimaryPx={280}
          minSecondaryPx={400}
          maxPrimaryPercent={50}
          className="hidden h-full md:flex"
          ariaLabel="Redimensionar paneles"
          onHandleDoubleClick={({ setPercent }) =>
            setPercent(window.innerWidth >= 1024 ? 50 : 40)
          }
          primary={
            <PageSection className="h-full min-h-0">
              <ProblemContentTabs
                problem={problem}
                testcases={testcases}
                runResults={runResults}
                submissionsRefreshKey={submissionsRefreshKey}
                onTestcasesChange={setTestcases}
                onLoadSubmissionCode={(request) =>
                  setCodeLoadState((current) => ({
                    request,
                    version: current.version + 1,
                  }))
                }
              />
            </PageSection>
          }
          secondary={
            <PageSection delay={100} className="h-full min-h-0">
              <CodeWorkspace
                ref={workspaceRef}
                key={`${problem.slug}:${codeLoadState.version}`}
                problemId={problem.apiId ?? problem.id}
                codeTemplates={problem.codeTemplates}
                initialCodeLoad={codeLoadState.request}
                onRunResultsChange={setRunResults}
                onAcceptedSubmit={() =>
                  setSubmissionsRefreshKey((current) => current + 1)
                }
                onActionStateChange={setActionState}
              />
            </PageSection>
          }
        />
        )}
      </main>
    </div>
  )
}
