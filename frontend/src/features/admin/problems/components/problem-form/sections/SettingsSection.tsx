import type { ProblemStatus } from '@/features/admin/problems/types/problem.types'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'

type SettingsSectionProps = {
  timeLimitMs: number
  memoryLimitMb: number
  status: ProblemStatus
  timeError?: string
  memoryError?: string
  onTimeLimitChange: (value: number) => void
  onMemoryLimitChange: (value: number) => void
  onStatusChange: (value: ProblemStatus) => void
}

export function SettingsSection({
  timeLimitMs,
  memoryLimitMb,
  status,
  timeError,
  memoryError,
  onTimeLimitChange,
  onMemoryLimitChange,
  onStatusChange,
}: SettingsSectionProps) {
  return (
    <FormSection
      title="Configuración"
      description="Límites de ejecución y estado de publicación."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Límite de tiempo: {timeLimitMs} ms
          </span>
          <input type="range" min={500} max={10000} step={100} value={timeLimitMs} onChange={(event) => onTimeLimitChange(Number(event.target.value))} />
          <input type="number" min={500} max={10000} value={timeLimitMs} onChange={(event) => onTimeLimitChange(Number(event.target.value))} className="h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
          {timeError && <span className="text-xs font-semibold text-[var(--color-error)]">{timeError}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Límite de memoria: {memoryLimitMb} MB
          </span>
          <input type="range" min={64} max={512} step={32} value={memoryLimitMb} onChange={(event) => onMemoryLimitChange(Number(event.target.value))} />
          <input type="number" min={64} max={512} value={memoryLimitMb} onChange={(event) => onMemoryLimitChange(Number(event.target.value))} className="h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" />
          {memoryError && <span className="text-xs font-semibold text-[var(--color-error)]">{memoryError}</span>}
        </label>

        <div className="grid content-start gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            Estado
          </span>
          <div className="flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1">
            {(['draft', 'published'] as ProblemStatus[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onStatusChange(option)}
                className={`h-9 flex-1 rounded-full text-xs font-bold transition ${
                  status === option
                    ? option === 'published'
                      ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                      : 'bg-[var(--color-surface-soft)] text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {option === 'published' ? 'PUBLICADO' : 'BORRADOR'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
