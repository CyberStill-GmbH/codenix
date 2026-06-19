import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'

import { CodeEditor } from '@/features/coding/components/CodeEditor'
import { ResizableSplitPane } from '@/features/coding/components/ResizableSplitPane'
import { ResultPanel } from '@/features/coding/components/ResultPanel'
import {
  getRunResult,
  getSubmissionResult,
  runProblemCode,
  submitProblemCode,
} from '@/features/coding/services/codingApi'
import type {
  CodingTestcase,
  RunCodeResponse,
  SubmitCodeResponse,
  TestcaseRunResult,
} from '@/features/coding/types/coding.types'
import { readStoredSplitPercent } from '@/features/coding/utils/splitPaneStorage'
import { useAuth } from '@/features/auth/context/useAuth'
import { ApiError } from '@/shared/api/apiClient'
import type {
  ProblemCodeLanguage,
  ProblemCodeTemplate,
} from '@/features/problems/types/problem.types'

type CodeLoadRequest = {
  code: string
  language: ProblemCodeLanguage
  submissionId: string
}

type CodeWorkspaceProps = {
  problemId: string | number
  codeTemplates: ProblemCodeTemplate[]
  testcases: CodingTestcase[]
  initialCodeLoad?: CodeLoadRequest | null
  onRunResultsChange: (results: TestcaseRunResult[]) => void
  onAcceptedSubmit: () => void
  onActionStateChange: (state: CodeWorkspaceActionState) => void
}

export type CodeWorkspaceActionState = {
  isRunning: boolean
  isSubmitting: boolean
  isBusy: boolean
  isEditorEmpty: boolean
}

export type CodeWorkspaceHandle = {
  run: () => void
  submit: () => void
}

const fallbackTemplate: ProblemCodeTemplate = {
  language: 'typescript',
  label: 'TypeScript',
  starterCode: 'function solve(input: string): string {\n  return ""\n}\n',
}

const POLL_INTERVAL_MS = 1000
const POLL_TIMEOUT_MS = 30000

function getTemplates(codeTemplates: ProblemCodeTemplate[]) {
  return codeTemplates.length > 0 ? codeTemplates : [fallbackTemplate]
}

function getInitialTemplate(codeTemplates: ProblemCodeTemplate[]) {
  const templates = getTemplates(codeTemplates)
  return (
    templates.find((template) => template.language === 'typescript') ??
    templates[0]
  )
}

function createDraftKey(
  userId: string | undefined,
  problemId: string | number,
  language: ProblemCodeLanguage,
) {
  return `codenix:draft:${userId ?? 'guest'}:${problemId}:${language}`
}

function isPendingResponse(response: RunCodeResponse | SubmitCodeResponse) {
  return response.status === 'pending' && Boolean(response.id)
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getApiUnavailableMessage(error: unknown, action: 'Run' | 'Submit') {
  if (error instanceof ApiError && error.status === 404) {
    return `El backend de ${action} todavia no esta disponible. La interfaz ya esta lista para consumir el endpoint real.`
  }

  return error instanceof Error
    ? error.message
    : `No pudimos completar ${action}. Intenta de nuevo.`
}

export const CodeWorkspace = forwardRef<CodeWorkspaceHandle, CodeWorkspaceProps>(
function CodeWorkspace(
  {
    problemId,
    codeTemplates,
    testcases,
    initialCodeLoad,
    onRunResultsChange,
    onAcceptedSubmit,
    onActionStateChange,
  },
  ref,
) {
  const { user } = useAuth()
  const templates = useMemo(() => getTemplates(codeTemplates), [codeTemplates])
  const initialTemplate = useMemo(
    () => getInitialTemplate(codeTemplates),
    [codeTemplates],
  )

  const initialLanguage = initialCodeLoad?.language ?? initialTemplate.language
  const [language, setLanguage] = useState<ProblemCodeLanguage>(initialLanguage)
  const [code, setCode] = useState(() => {
    if (initialCodeLoad) return initialCodeLoad.code

    return (
      window.localStorage.getItem(
        createDraftKey(user?.id, problemId, initialTemplate.language),
      ) ?? initialTemplate.starterCode
    )
  })
  const [pendingLanguage, setPendingLanguage] = useState<ProblemCodeLanguage | null>(null)
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null)
  const [submitResult, setSubmitResult] = useState<SubmitCodeResponse | null>(null)
  const [activeAction, setActiveAction] = useState<'run' | 'submit' | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [editorPanelPercent, setEditorPanelPercent] = useState(() =>
    readStoredSplitPercent('codenix_split_vertical', 88),
  )

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.language === language) ??
      initialTemplate,
    [initialTemplate, language, templates],
  )

  const isBusy = isRunning || isSubmitting
  const isEditorEmpty = code.trim().length === 0
  const hasEditedCurrentTemplate = code !== selectedTemplate.starterCode

  const expandResultPanel = useCallback(() => {
    setEditorPanelPercent((current) => (current > 76 ? 70 : current))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(createDraftKey(user?.id, problemId, language), code)
  }, [code, language, problemId, user?.id])

  const pollRunResult = useCallback(async (runId: string) => {
    const startedAt = Date.now()

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      await delay(POLL_INTERVAL_MS)
      const response = await getRunResult(runId)
      if (!isPendingResponse(response)) return response
    }

    throw new Error('El servidor tardo demasiado, intenta de nuevo.')
  }, [])

  const pollSubmissionResult = useCallback(async (submissionId: string) => {
    const startedAt = Date.now()

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      await delay(POLL_INTERVAL_MS)
      const response = await getSubmissionResult(submissionId)
      if (!isPendingResponse(response)) return response
    }

    throw new Error('El servidor tardo demasiado, intenta de nuevo.')
  }, [])

  const handleRun = useCallback(async () => {
    if (isBusy || isEditorEmpty) return

    try {
      setIsRunning(true)
      setActiveAction('run')
      setErrorMessage('')
      setRunResult(null)
      setSubmitResult(null)
      onRunResultsChange([])
      expandResultPanel()

      const response = await runProblemCode(problemId, {
        language,
        sourceCode: code,
        testcases: testcases.map(({ input, expectedOutput }) => ({
          input,
          expectedOutput,
        })),
      })
      const finalResponse =
        isPendingResponse(response) && response.id
          ? await pollRunResult(response.id)
          : response

      setRunResult(finalResponse)
      onRunResultsChange(finalResponse.testcases ?? [])
    } catch (error) {
      setErrorMessage(getApiUnavailableMessage(error, 'Run'))
    } finally {
      setIsRunning(false)
    }
  }, [
    code,
    expandResultPanel,
    isEditorEmpty,
    isBusy,
    language,
    onRunResultsChange,
    pollRunResult,
    problemId,
    testcases,
  ])

  const handleSubmit = useCallback(async () => {
    if (isBusy || isEditorEmpty) return

    try {
      setIsSubmitting(true)
      setActiveAction('submit')
      setErrorMessage('')
      setRunResult(null)
      setSubmitResult(null)
      expandResultPanel()

      const response = await submitProblemCode(problemId, {
        language,
        sourceCode: code,
      })
      const finalResponse =
        isPendingResponse(response) && response.id
          ? await pollSubmissionResult(response.id)
          : response

      setSubmitResult(finalResponse)

      if (finalResponse.status === 'accepted') {
        window.localStorage.removeItem(createDraftKey(user?.id, problemId, language))
        onAcceptedSubmit()
      }
    } catch (error) {
      setErrorMessage(getApiUnavailableMessage(error, 'Submit'))
    } finally {
      setIsSubmitting(false)
    }
  }, [
    code,
    expandResultPanel,
    isEditorEmpty,
    isBusy,
    language,
    onAcceptedSubmit,
    pollSubmissionResult,
    problemId,
    user?.id,
  ])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return

      event.preventDefault()

      if (event.shiftKey) {
        handleSubmit()
      } else {
        handleRun()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun, handleSubmit])

  useImperativeHandle(
    ref,
    () => ({
      run: handleRun,
      submit: handleSubmit,
    }),
    [handleRun, handleSubmit],
  )

  useEffect(() => {
    onActionStateChange({
      isRunning,
      isSubmitting,
      isBusy,
      isEditorEmpty,
    })
  }, [isBusy, isEditorEmpty, isRunning, isSubmitting, onActionStateChange])

  function requestLanguageChange(nextLanguage: ProblemCodeLanguage) {
    if (nextLanguage === language) return

    if (hasEditedCurrentTemplate) {
      setPendingLanguage(nextLanguage)
      return
    }

    applyLanguageChange(nextLanguage)
  }

  function applyLanguageChange(nextLanguage: ProblemCodeLanguage) {
    const nextTemplate =
      templates.find((template) => template.language === nextLanguage) ??
      fallbackTemplate
    const savedDraft = window.localStorage.getItem(
      createDraftKey(user?.id, problemId, nextTemplate.language),
    )

    setLanguage(nextTemplate.language)
    setCode(savedDraft ?? nextTemplate.starterCode)
    setPendingLanguage(null)
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/70 shadow-[0_18px_50px_rgba(2,8,23,0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/80 px-4 py-2">
        <label className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Language
          </span>
          <select
            value={language}
            disabled={isBusy}
            onChange={(event) =>
              requestLanguageChange(event.target.value as ProblemCodeLanguage)
            }
            className="h-9 rounded-lg border border-slate-700/70 bg-slate-900/90 px-3 text-sm font-semibold text-[var(--color-text)] outline-none transition hover:border-slate-600 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[rgba(14,165,233,0.22)] disabled:opacity-60"
          >
            {templates.map((template) => (
              <option key={template.language} value={template.language}>
                {template.label}
              </option>
            ))}
          </select>
        </label>

        <span className="text-xs font-semibold text-[var(--color-text-subtle)]">
          Ctrl+Enter Run / Ctrl+Shift+Enter Submit
        </span>
      </div>

      {pendingLanguage && (
        <div className="border-b border-[var(--color-warning)]/25 bg-[var(--color-warning-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-warning)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Cambiar lenguaje? El codigo actual se perdera si no fue guardado como draft.</span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => applyLanguageChange(pendingLanguage)}
                className="rounded-full border border-[var(--color-warning)]/40 px-3 py-1 text-xs font-bold"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => setPendingLanguage(null)}
                className="rounded-full border border-slate-700/60 px-3 py-1 text-xs font-bold text-[var(--color-text-muted)]"
              >
                Cancelar
              </button>
            </span>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1">
        <ResizableSplitPane
          orientation="vertical"
          storageKey="codenix_split_vertical"
          defaultPrimaryPercent={88}
          primaryPercent={editorPanelPercent}
          onPrimaryPercentChange={setEditorPanelPercent}
          minPrimaryPx={120}
          minSecondaryPx={80}
          className="h-full"
          primaryClassName="border-b border-slate-800/80"
          ariaLabel="Redimensionar editor y consola"
          onHandleDoubleClick={({ currentPercent, setPercent }) => {
            setPercent(currentPercent > 76 ? 70 : 88)
          }}
          primary={
            <CodeEditor
              language={selectedTemplate.language}
              value={code}
              onChange={setCode}
            />
          }
          secondary={
            <ResultPanel
              activeAction={activeAction}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              runResult={runResult}
              submitResult={submitResult}
              errorMessage={errorMessage}
            />
          }
        />
      </div>
    </section>
  )
})
