import { useMemo, useState } from 'react'
import { AlertTriangle, Check, CircleDotDashed, X } from 'lucide-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { JudgeStatusBadge } from '@/features/coding/components/JudgeStatusBadge'
import { getJudgeStatusLabel } from '@/features/coding/utils/judgeStatus'
import type {
  RunCodeResponse,
  SubmitCodeResponse,
  TestcaseRunResult,
} from '@/features/coding/types/coding.types'

type ResultPanelProps = {
  activeAction: 'run' | 'submit' | null
  isRunning: boolean
  isSubmitting: boolean
  runResult: RunCodeResponse | null
  submitResult: SubmitCodeResponse | null
  errorMessage: string
  canRetry: boolean
  onRetry: () => void
}

type ResultTab = 'test-result' | 'output'

function formatMemory(memoryKb?: number) {
  if (!memoryKb) return '-'
  return `${(memoryKb / 1024).toFixed(1)} MB`
}

function formatRuntime(ms?: number) {
  if (ms === undefined) return '-'
  return `${ms} ms`
}

function CodeBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </p>
      <pre className="min-h-10 overflow-auto rounded-lg border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs text-[var(--color-text-soft)]">
        {value || '-'}
      </pre>
    </div>
  )
}

function TestcaseResultRow({ result }: { result: TestcaseRunResult }) {
  const isPending = result.status === 'pending'
  const isHidden = result.visibility === 'hidden' && !result.input && !result.expectedOutput

  return (
    <article className="rounded-xl border border-slate-800/90 bg-slate-950/55 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isPending ? (
            <CircleDotDashed className="h-4 w-4 animate-spin text-sky-300" aria-hidden="true" />
          ) : result.passed ? (
            <Check className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
          ) : (
            <X className="h-4 w-4 text-[var(--color-error)]" aria-hidden="true" />
          )}
          <span className="text-sm font-bold text-[var(--color-text)]">
            Case {result.index}
          </span>
        </div>
        <span className="text-xs font-semibold text-[var(--color-text-muted)]">
          {formatRuntime(result.executionTimeMs)} · {formatMemory(result.memoryKb)}
        </span>
      </div>
      {isHidden ? (
        <p className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-sm font-semibold text-[var(--color-text-muted)]">
          Caso oculto. El backend no expone input ni output esperado para este testcase.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <CodeBlock label="Input" value={result.input} />
          <CodeBlock label="Expected" value={result.expectedOutput} />
          <CodeBlock
            label="Got"
            value={isPending ? 'Ejecutando...' : result.actualOutput ?? result.stdout}
          />
        </div>
      )}
      {result.error && (
        <pre className="mt-3 overflow-auto rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-3 font-mono text-xs text-[var(--color-error)]">
          {result.error}
        </pre>
      )}
    </article>
  )
}

function SubmitBanner({ submitResult }: { submitResult: SubmitCodeResponse }) {
  const status = submitResult.status
  const passedCases = submitResult.passedCases ?? 0
  const totalCases = submitResult.totalCases ?? 0
  const isAccepted = status === 'accepted'
  const isWarning = status === 'time_limit_exceeded' || status === 'memory_limit_exceeded'
  const className = isAccepted
    ? 'border-[var(--color-success)]/35 bg-[var(--color-success-soft)] text-[var(--color-success)]'
    : isWarning
      ? 'border-[var(--color-warning)]/35 bg-[var(--color-warning-soft)] text-[var(--color-warning)]'
      : 'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]'

  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-black">{getJudgeStatusLabel(status)}</p>
          <p className="mt-1 text-sm font-semibold">
            {isAccepted
              ? `${passedCases}/${totalCases || passedCases} cases passed`
              : submitResult.failedCase
                ? `Falla en caso ${submitResult.failedCase.index}/${totalCases || '?'}`
                : 'Revisa el detalle del resultado abajo.'}
          </p>
        </div>
        <div className="text-right text-xs font-bold">
          <p>Runtime: {formatRuntime(submitResult.executionTimeMs)}</p>
          <p>Memory: {formatMemory(submitResult.memoryKb)}</p>
        </div>
      </div>
    </div>
  )
}

export function ResultPanel({
  activeAction,
  isRunning,
  isSubmitting,
  runResult,
  submitResult,
  errorMessage,
  canRetry,
  onRetry,
}: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>('test-result')

  const currentRunLikeResult = useMemo(() => {
    if (activeAction === 'submit' && submitResult) {
      return submitResult.failedCase ? [submitResult.failedCase] : []
    }

    return runResult?.testcases ?? []
  }, [activeAction, runResult?.testcases, submitResult])

  const stdout = runResult?.stdout ?? submitResult?.stdout ?? ''
  const stderr =
    runResult?.stderr ??
    runResult?.error?.stderr ??
    runResult?.error?.message ??
    submitResult?.stderr ??
    submitResult?.error?.stderr ??
    submitResult?.error?.message ??
    ''

  const distribution = submitResult?.runtimeDistribution ?? []
  const hasRuntimeDistribution = distribution.length > 0

  const isBusy = isRunning || isSubmitting

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-bg-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-2">
        <div className="flex items-center gap-2">
          {(['test-result', 'output'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-8 rounded-lg px-3 text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-sky-400/12 text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-slate-900 hover:text-white'
              }`}
            >
              {tab === 'test-result' ? 'Test Result' : 'Output'}
            </button>
          ))}
        </div>

        {isBusy && (
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-text-muted)]">
            <CircleDotDashed className="h-4 w-4 animate-spin" aria-hidden="true" />
            {isSubmitting ? 'Submitting...' : 'Running...'}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-[var(--color-error)]/35 bg-[var(--color-error-soft)] p-4 text-sm font-semibold text-[var(--color-error)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="flex min-w-0 items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </span>
              {canRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-8 rounded-lg border border-[var(--color-error)]/35 px-3 text-xs font-black transition hover:bg-[var(--color-error)]/10"
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>
        )}

        {submitResult && activeAction === 'submit' && (
          <div className="mb-4 space-y-4">
            <SubmitBanner submitResult={submitResult} />
            {submitResult.status === 'accepted' && hasRuntimeDistribution && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text)]">
                      Runtime distribution
                    </h3>
                  </div>
                  {submitResult.runtimePercentile && (
                    <p className="text-xs font-bold text-[var(--color-success)]">
                      Faster than {submitResult.runtimePercentile}% of submissions
                    </p>
                  )}
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution}>
                      <XAxis dataKey="runtimeMs" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: '#020617',
                          border: '1px solid rgba(148,163,184,0.25)',
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="submissions" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test-result' ? (
          <div className="space-y-3">
            {runResult && <JudgeStatusBadge status={runResult.status} />}
            {currentRunLikeResult.length > 0 ? (
              currentRunLikeResult.map((result) => (
                <TestcaseResultRow key={result.id} result={result} />
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">
                Ejecuta tu codigo para ver los resultados por testcase.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            <CodeBlock label="stdout" value={stdout} />
            <CodeBlock label="stderr" value={stderr} />
          </div>
        )}
      </div>
    </div>
  )
}
