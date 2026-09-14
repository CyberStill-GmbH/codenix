import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  CheckCheck,
  CheckCircle2,
  CircleDotDashed,
  Copy,
  Cpu,
  ListChecks,
  Plus,
  Terminal,
  Timer,
  Trash2,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { JudgeStatusBadge } from '@/features/coding/components/JudgeStatusBadge'
import { getJudgeStatusLabel } from '@/features/coding/utils/judgeStatus'
import {
  formatTestcaseInput,
  formatTestcaseOutput,
  serializeHumanInput,
  serializeHumanOutput,
} from '@/features/coding/utils/testcasePresentation'
import type {
  RunCodeResponse,
  SubmitCodeResponse,
  TestcaseRunResult,
  CodingTestcase,
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
  testcases?: CodingTestcase[]
  onTestcasesChange?: (testcases: CodingTestcase[]) => void
  sourceCode?: string
  language?: string
  avatarUrl?: string | null
  username?: string
}

type ResultTab = 'testcases' | 'test-result' | 'output'

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
      <pre className="min-h-10 overflow-auto rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-muted)] p-3 font-mono text-xs text-[var(--color-text-soft)]">
        {value || '-'}
      </pre>
    </div>
  )
}

function TestcaseField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 'min-h-20',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  minHeight?: string
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className={`${minHeight} resize-y rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-muted)] p-3 font-mono text-xs leading-6 text-[var(--color-text-soft)] outline-none transition placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20`}
      />
    </label>
  )
}

function TestcaseResultRow({ result }: { result: TestcaseRunResult }) {
  const isPending = result.status === 'pending'
  const isHidden = result.visibility === 'hidden' && !result.input && !result.expectedOutput

  return (
    <article className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isPending ? (
            <CircleDotDashed className="h-4 w-4 animate-spin text-[var(--color-accent)]" aria-hidden="true" />
          ) : result.passed ? (
            <Check className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
          ) : (
            <X className="h-4 w-4 text-[var(--color-error)]" aria-hidden="true" />
          )}
          <span className="text-sm font-bold text-[var(--color-text)]">
            Caso {result.index}
          </span>
        </div>
        <span className="text-xs font-semibold text-[var(--color-text-muted)]">
          {formatRuntime(result.executionTimeMs)} · {formatMemory(result.memoryKb)}
        </span>
      </div>
      {isHidden ? (
        <p className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-3 text-sm font-semibold text-[var(--color-text-muted)]">
          Caso oculto. El backend no expone entrada ni salida esperada para este caso.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <CodeBlock label="Entrada" value={formatTestcaseInput(result.input)} />
          <CodeBlock label="Esperada" value={formatTestcaseOutput(result.expectedOutput)} />
          <CodeBlock
            label="Got"
            value={
              isPending
                ? 'Ejecutando…'
                : formatTestcaseOutput(result.actualOutput ?? result.stdout)
            }
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
              ? `${passedCases}/${totalCases || passedCases} casos superados`
              : submitResult.failedCase
                ? `Falla en caso ${submitResult.failedCase.index}/${totalCases || '?'}`
                : 'Revisa el detalle del resultado abajo.'}
          </p>
        </div>
        <div className="text-right text-xs font-bold">
          <p>Tiempo: {formatRuntime(submitResult.executionTimeMs)}</p>
          <p>Memoria: {formatMemory(submitResult.memoryKb)}</p>
        </div>
      </div>
    </div>
  )
}

type PerformanceMetric = 'runtime' | 'memory'

function formatMetricValue(metric: PerformanceMetric, value: number) {
  return metric === 'runtime' ? `${value} ms` : `${(value / 1024).toFixed(1)} MB`
}

function AcceptedPerformancePanel({
  submitResult,
  sourceCode,
  language,
  avatarUrl,
  username,
}: {
  submitResult: SubmitCodeResponse
  sourceCode?: string
  language?: string
  avatarUrl?: string | null
  username?: string
}) {
  const [metric, setMetric] = useState<PerformanceMetric>('runtime')
  const [copied, setCopied] = useState(false)
  const runtimeData = submitResult.runtimeDistribution ?? []
  const memoryData = submitResult.memoryDistribution ?? []
  const data = metric === 'runtime' ? runtimeData : memoryData
  const currentValue = metric === 'runtime' ? submitResult.executionTimeMs : submitResult.memoryKb
  const percentile = metric === 'runtime' ? submitResult.runtimePercentile : submitResult.memoryPercentile

  async function copyCode() {
    if (!sourceCode) return
    await navigator.clipboard?.writeText(sourceCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="overflow-hidden rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-surface)]"
      aria-labelledby="accepted-performance-title"
    >
      <div className="border-b border-[var(--color-border-soft)] bg-[var(--color-success-soft)]/30 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-[var(--color-success)]">
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              Envío aceptado
            </p>
            <h3 id="accepted-performance-title" className="mt-1 text-xs text-[var(--color-text-muted)]">
              Tu solución pasó todos los casos y ya forma parte de la comparación.
            </h3>
          </div>
          {avatarUrl ? (
            <img src={avatarUrl} alt={username ? `Avatar de ${username}` : 'Tu avatar'} className="h-9 w-9 rounded-full border border-[var(--color-success)]/50 object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-success)]/50 bg-[var(--color-success-soft)] text-xs font-black text-[var(--color-success)]" aria-hidden="true">
              {(username?.[0] ?? 'T').toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { id: 'runtime' as const, label: 'Tiempo', icon: Timer, value: submitResult.executionTimeMs, percentile: submitResult.runtimePercentile },
            { id: 'memory' as const, label: 'Memoria', icon: Cpu, value: submitResult.memoryKb, percentile: submitResult.memoryPercentile },
          ]).map((item) => {
            const Icon = item.icon
            const selected = metric === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMetric(item.id)}
                className={`group min-h-24 rounded-lg border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/50 shadow-[var(--shadow-sm)]' : 'border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] hover:border-[var(--color-border-strong)]'}`}
              >
                <span className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-muted)]">
                  <Icon className={`h-4 w-4 ${selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-subtle)]'}`} aria-hidden="true" />
                  {item.label}
                </span>
                <span className="mt-2 block text-xl font-black text-[var(--color-text)]">
                  {item.value == null ? '-' : formatMetricValue(item.id, item.value)}
                </span>
                {item.percentile != null && <span className="mt-1 block text-xs font-semibold text-[var(--color-success)]">Mejor que el {item.percentile}%</span>}
              </button>
            )
          })}
        </div>

        {data.length > 0 && currentValue != null ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={metric} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }} className="mt-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-[var(--color-text-muted)]">Comparación con envíos aceptados</p>
                {percentile != null && <p className="text-xs font-bold text-[var(--color-success)]">Percentil {percentile}</p>}
              </div>
              <div className="h-48 w-full" role="img" aria-label={`Distribución de ${metric === 'runtime' ? 'tiempo' : 'memoria'} de envíos aceptados`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 12, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-border-soft)" vertical={false} />
                    <XAxis dataKey="value" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} tickFormatter={(value) => metric === 'runtime' ? `${value}ms` : `${(Number(value) / 1024).toFixed(0)}MB`} />
                    <YAxis allowDecimals={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <Tooltip formatter={(value: number | string) => [`${value} envíos`, 'Cantidad']} labelFormatter={(value) => formatMetricValue(metric, Number(value))} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }} />
                    <ReferenceLine x={currentValue} stroke="var(--color-success)" strokeDasharray="4 4" label={{ value: 'Tu envío', fill: 'var(--color-success)', fontSize: 10, position: 'top' }} />
                    <Bar dataKey="submissions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} animationDuration={450} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="mt-5 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-3 text-xs text-[var(--color-text-muted)]">
            Aún no hay suficientes envíos aceptados para construir una comparación.
          </p>
        )}

        {sourceCode && (
          <div className="mt-5 overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-muted)]">
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <p className="text-xs font-bold text-[var(--color-text-muted)]">Código enviado · {language ?? 'solución'}</p>
              <button type="button" onClick={() => void copyCode()} className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]" aria-label="Copiar código">
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="max-h-72 overflow-auto border-t border-[var(--color-border-soft)] p-3 font-mono text-xs leading-6 text-[var(--color-text-soft)]"><code>{sourceCode}</code></pre>
          </div>
        )}
      </div>
    </motion.section>
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
  testcases = [],
  onTestcasesChange,
  sourceCode,
  language,
  avatarUrl,
  username,
}: ResultPanelProps) {
  const [userTab, setUserTab] = useState<ResultTab>('testcases')
  const isBusy = isRunning || isSubmitting
  const activeTab: ResultTab = isBusy ? 'test-result' : userTab
  const currentRunLikeResult = useMemo(() => {
    if (activeAction === 'submit' && submitResult) {
      return submitResult.failedCase ? [submitResult.failedCase] : []
    }
    return runResult?.testcases ?? []
  }, [activeAction, runResult?.testcases, submitResult])

  const resultByCaseId = useMemo(
    () => new Map(currentRunLikeResult.map((result) => [result.id, result])),
    [currentRunLikeResult],
  )

  function updateTestcase(id: string, field: 'input' | 'expectedOutput', value: string) {
    if (!onTestcasesChange) return
    onTestcasesChange(
      testcases.map((testcase) =>
        testcase.id === id ? { ...testcase, [field]: value } : testcase,
      ),
    )
  }

  function addCustomTestcase() {
    if (!onTestcasesChange) return
    onTestcasesChange([
      ...testcases,
      {
        id: `custom-${Date.now()}`,
        input: '',
        expectedOutput: '',
        isCustom: true,
      },
    ])
  }

  function removeCustomTestcase(id: string) {
    if (!onTestcasesChange) return
    onTestcasesChange(testcases.filter((testcase) => testcase.id !== id))
  }

  const stdout = runResult?.stdout ?? submitResult?.stdout ?? ''
  const stderr =
    runResult?.stderr ??
    runResult?.error?.stderr ??
    runResult?.error?.message ??
    submitResult?.stderr ??
    submitResult?.error?.stderr ??
    submitResult?.error?.message ??
    ''

  const isFullyAccepted = submitResult?.status === 'accepted' && (submitResult.totalCases ?? 0) > 0 && submitResult.passedCases === submitResult.totalCases

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--color-bg-soft)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-soft)] px-4 py-2">
        <div className="flex items-center gap-2" role="tablist" aria-label="Resultados de ejecución">
          {(['testcases', 'test-result', 'output'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setUserTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                activeTab === tab
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab === 'testcases' ? (
                <ListChecks className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden="true" />
              ) : tab === 'test-result' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden="true" />
              ) : (
                <Terminal className="h-3.5 w-3.5 text-[var(--color-success)]" aria-hidden="true" />
              )}
              {tab === 'testcases' ? 'Casos de prueba' : tab === 'test-result' ? 'Resultado' : 'Salida'}
            </button>
          ))}
        </div>

        {isBusy && (
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-text-muted)]">
            <CircleDotDashed className="h-4 w-4 animate-spin" aria-hidden="true" />
            {isSubmitting ? 'Enviando…' : 'Ejecutando…'}
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
            {isFullyAccepted && <AcceptedPerformancePanel submitResult={submitResult} sourceCode={sourceCode} language={language} avatarUrl={avatarUrl} username={username} />}
          </div>
        )}

        {activeTab === 'testcases' ? (
          <section className="space-y-3">
            <p className="text-xs text-[var(--color-text-subtle)]">
              Introduce los argumentos de la función. Codenix prepara los valores y ejecuta tu solución de forma segura.
            </p>
            {testcases.map((testcase, index) => {
              const result = resultByCaseId.get(testcase.id)
              return (
                <article
                  key={testcase.id}
                  className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-[var(--color-text)]">
                      Caso {index + 1}
                    </h2>
                    {testcase.isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustomTestcase(testcase.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-error)] transition hover:bg-[var(--color-error-soft)]"
                        aria-label="Remove testcase"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <TestcaseField
                    label="Entrada"
                    value={formatTestcaseInput(testcase.input)}
                    placeholder={'nums = [2, 7, 11, 15]\ntarget = 9'}
                    onChange={(value) =>
                      updateTestcase(testcase.id, 'input', serializeHumanInput(value))
                    }
                  />
                  <div className="mt-3">
                    <TestcaseField
                      label="Salida esperada"
                      value={formatTestcaseOutput(testcase.expectedOutput)}
                      placeholder="[0, 1]"
                      minHeight="min-h-16"
                      onChange={(value) =>
                        updateTestcase(
                          testcase.id,
                          'expectedOutput',
                          serializeHumanOutput(value),
                        )
                      }
                    />
                  </div>
                  {result && (
                    <div className="mt-3 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-3">
                      <p className="text-xs font-bold text-[var(--color-text-muted)]">
                        Obtenida
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-[var(--color-text-soft)]">
                        {formatTestcaseOutput(result.actualOutput ?? result.stdout) || '-'}
                      </pre>
                    </div>
                  )}
                </article>
              )
            })}

            <button
              type="button"
              onClick={addCustomTestcase}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-bold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar caso
            </button>
          </section>
        ) : activeTab === 'test-result' ? (
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
