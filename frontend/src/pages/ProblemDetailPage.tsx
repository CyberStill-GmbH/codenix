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
import { Button } from '@/shared/components/ui/Button'
import { ChevronUp, ChevronDown } from 'lucide-react'

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

  const handleAcceptedSubmit = useCallback(() => {
    setSubmissionsRefreshKey((current) => current + 1)
    setProblem((currentProblem) =>
      currentProblem ? { ...currentProblem, solved: true } : currentProblem,
    )
    setProblemCatalog((currentCatalog) =>
      currentCatalog.map((catalogProblem) =>
        catalogProblem.slug === problem?.slug
          ? { ...catalogProblem, solved: true }
          : catalogProblem,
      ),
    )
  }, [problem?.slug])

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
        <div className="flex h-full min-h-0 flex-col relative">
          <PageSection delay={100} className="min-h-0 flex-1 relative z-0 pb-16">
            <CodeWorkspace
              ref={workspaceRef}
              key={`${problem.slug}:${codeLoadState.version}`}
              problemId={problem.apiId ?? problem.id}
              codeTemplates={problem.codeTemplates}
              testcases={testcases}
              initialCodeLoad={codeLoadState.request}
              onRunResultsChange={setRunResults}
              onAcceptedSubmit={handleAcceptedSubmit}
              onActionStateChange={setActionState}
            />
          </PageSection>

          {/* Bottom Sheet Drawer Toggle */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
             <Button
                variant="primary"
                onClick={() => setIsDescriptionOpen(true)}
                className="rounded-full shadow-floating pointer-events-auto"
                aria-label="Ver descripcion"
             >
                <ChevronUp className="w-4 h-4" />
                Problem Description
             </Button>
          </div>

          {/* Bottom Sheet Drawer Content */}
          <div
            className={`absolute inset-x-0 bottom-0 z-30 flex flex-col bg-surface-elevated border-t border-border-soft rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
              isDescriptionOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ height: '85vh' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border-soft shrink-0">
               <h3 className="font-bold text-text-base">Description & Testcases</h3>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setIsDescriptionOpen(false)}
                 aria-label="Close"
                 className="rounded-full"
               >
                 <ChevronDown className="w-5 h-5" />
               </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
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
            </div>
          </div>
          
          {/* Backdrop */}
          {isDescriptionOpen && (
            <div 
              className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsDescriptionOpen(false)}
            />
          )}
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
                testcases={testcases}
                initialCodeLoad={codeLoadState.request}
                onRunResultsChange={setRunResults}
                onAcceptedSubmit={handleAcceptedSubmit}
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
