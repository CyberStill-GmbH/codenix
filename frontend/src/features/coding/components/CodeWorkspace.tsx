import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { CodeEditor } from '@/features/coding/components/CodeEditor'
import { ResizeHandleVertical } from '@/features/coding/components/ResizeHandles'
import { ResultPanel } from '@/features/coding/components/ResultPanel'
import { useWorkspace } from '@/features/coding/context/WorkspaceContext'
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
import { useJudgePolling } from '@/features/coding/hooks/useJudgePolling'
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
  onTestcasesChange?: (testcases: CodingTestcase[]) => void
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

const LAST_LANGUAGE_KEY = 'codenix-last-language'

function getTemplates(codeTemplates: ProblemCodeTemplate[]) {
  return codeTemplates.length > 0 ? codeTemplates : [fallbackTemplate]
}

function getInitialTemplate(codeTemplates: ProblemCodeTemplate[]) {
  const templates = getTemplates(codeTemplates)
  // Prefer the user's last-used language if the problem supports it
  try {
    const lastLang = window.localStorage.getItem(LAST_LANGUAGE_KEY) as ProblemCodeLanguage | null
    if (lastLang) {
      const match = templates.find((t) => t.language === lastLang)
      if (match) return match
    }
  } catch {
    // ignore
  }
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

function isTerminalResponse(response: RunCodeResponse | SubmitCodeResponse) {
  return response.status !== 'pending' && response.status !== 'running'
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getApiErrorMessage(error: unknown, action: 'run' | 'submit') {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 422) return error.message
    if (error.status === 401) return 'Tu sesion expiro. Vuelve a iniciar sesion para continuar.'
    if (error.status === 429) return 'Has hecho demasiados envios, espera unos segundos.'
    if (error.status >= 500) {
      return action === 'run'
        ? 'Hubo un problema al ejecutar tu codigo, intenta de nuevo.'
        : 'Hubo un problema al enviar tu solucion, intenta de nuevo.'
    }

    return error.message
  }

  if (error instanceof Error && error.name === 'InvalidJudgeResponseError') {
    return 'El servidor devolvio una respuesta inesperada. Intenta de nuevo.'
  }

  return error instanceof Error
    ? error.message
    : 'No pudimos completar la accion. Intenta de nuevo.'
}

function canRetryAfterError(error: unknown) {
  return error instanceof ApiError
    ? error.status === 429 || error.status >= 500
    : error instanceof Error && error.name === 'InvalidJudgeResponseError'
}

function createPendingResults(testcases: CodingTestcase[]): TestcaseRunResult[] {
  return testcases.map((testcase, index) => ({
    id: testcase.id,
    index: index + 1,
    passed: null,
    status: 'pending',
    input: testcase.input,
    expectedOutput: testcase.expectedOutput,
  }))
}

export const CodeWorkspace = forwardRef<CodeWorkspaceHandle, CodeWorkspaceProps>(
function CodeWorkspace(
  {
    problemId,
    codeTemplates,
    testcases,
    initialCodeLoad,
    onTestcasesChange,
    onRunResultsChange,
    onAcceptedSubmit,
    onActionStateChange,
  },
  ref,
) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { bottomHeightPx, setBottomHeightPx } = useWorkspace()
  const actionSequenceRef = useRef(0)
  const { cancelPolling, pollUntilTerminal } = useJudgePolling()
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
  const [canRetry, setCanRetry] = useState(false)

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
    if (bottomHeightPx < 200) {
       setBottomHeightPx(240)
    }
  }, [bottomHeightPx, setBottomHeightPx])

  useEffect(() => {
    window.localStorage.setItem(createDraftKey(user?.id, problemId, language), code)
  }, [code, language, problemId, user?.id])

  const handleRun = useCallback(async () => {
    if (isBusy || isEditorEmpty) return
    const actionId = actionSequenceRef.current + 1
    actionSequenceRef.current = actionId

    try {
      cancelPolling()
      setIsRunning(true)
      setActiveAction('run')
      setErrorMessage('')
      setCanRetry(false)
      setRunResult(null)
      setSubmitResult(null)
      onRunResultsChange(createPendingResults(testcases))
      expandResultPanel()

      const response = await runProblemCode(problemId, {
        language,
        sourceCode: code,
        testcases: testcases.map(({ input, expectedOutput }) => ({
          input,
          expectedOutput,
        })),
      })
      const finalResponse = isTerminalResponse(response)
        ? await getRunResult(response.id)
        : await pollUntilTerminal({
            id: response.id,
            fetchResult: getRunResult,
          })

      if (actionSequenceRef.current !== actionId) return

      setRunResult(finalResponse)
      onRunResultsChange(finalResponse.testcases ?? [])
    } catch (error) {
      if (isAbortError(error)) return
      setErrorMessage(getApiErrorMessage(error, 'run'))
      setCanRetry(canRetryAfterError(error))

      if (error instanceof ApiError && error.status === 401) {
        navigate('/login', { replace: true, state: { returnTo: location.pathname } })
      }
    } finally {
      if (actionSequenceRef.current === actionId) setIsRunning(false)
    }
  }, [
    cancelPolling,
    code,
    expandResultPanel,
    isEditorEmpty,
    isBusy,
    language,
    location.pathname,
    navigate,
    onRunResultsChange,
    pollUntilTerminal,
    problemId,
    testcases,
  ])

  const handleSubmit = useCallback(async () => {
    if (isBusy || isEditorEmpty) return
    const actionId = actionSequenceRef.current + 1
    actionSequenceRef.current = actionId

    try {
      cancelPolling()
      setIsSubmitting(true)
      setActiveAction('submit')
      setErrorMessage('')
      setCanRetry(false)
      setRunResult(null)
      setSubmitResult(null)
      expandResultPanel()

      const response = await submitProblemCode(problemId, {
        language,
        sourceCode: code,
      })
      const finalResponse = isTerminalResponse(response)
        ? await getSubmissionResult(response.id)
        : await pollUntilTerminal({
            id: response.id,
            fetchResult: getSubmissionResult,
          })

      if (actionSequenceRef.current !== actionId) return

      setSubmitResult(finalResponse)

      if (finalResponse.status === 'accepted') {
        window.localStorage.removeItem(createDraftKey(user?.id, problemId, language))
        onAcceptedSubmit()
      }
    } catch (error) {
      if (isAbortError(error)) return
      setErrorMessage(getApiErrorMessage(error, 'submit'))
      setCanRetry(canRetryAfterError(error))

      if (error instanceof ApiError && error.status === 401) {
        navigate('/login', { replace: true, state: { returnTo: location.pathname } })
      }
    } finally {
      if (actionSequenceRef.current === actionId) setIsSubmitting(false)
    }
  }, [
    cancelPolling,
    code,
    expandResultPanel,
    isEditorEmpty,
    isBusy,
    language,
    location.pathname,
    navigate,
    onAcceptedSubmit,
    pollUntilTerminal,
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
    // Persist last-used language preference
    try {
      window.localStorage.setItem(LAST_LANGUAGE_KEY, nextTemplate.language)
    } catch {
      // ignore
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)] px-4 py-2">
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
            className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 text-sm font-semibold text-[var(--color-text)] outline-none transition hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60"
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
                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-bold text-[var(--color-text-muted)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
              >
                Cancelar
              </button>
            </span>
          </div>
        </div>
      )}

      <div 
        className="min-h-0 flex-1 grid"
        style={{ gridTemplateRows: `1fr 8px var(--bottom-height, ${bottomHeightPx}px)` }}
      >
        <div className="min-h-0 min-w-0 border-b border-[var(--color-border-soft)]">
          <CodeEditor
            language={selectedTemplate.language}
            value={code}
            onChange={setCode}
          />
        </div>
        <ResizeHandleVertical />
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <ResultPanel
            activeAction={activeAction}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            runResult={runResult}
            submitResult={submitResult}
            errorMessage={errorMessage}
            canRetry={canRetry}
            onRetry={activeAction === 'submit' ? handleSubmit : handleRun}
            testcases={testcases}
            onTestcasesChange={onTestcasesChange}
          />
        </div>
      </div>
    </section>
  )
})
