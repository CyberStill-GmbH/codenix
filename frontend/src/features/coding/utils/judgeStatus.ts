import type { JudgeStatus } from '@/features/coding/types/coding.types'

export const judgeStatusMeta: Record<
  JudgeStatus,
  { label: string; className: string }
> = {
  accepted: {
    label: 'Accepted',
    className:
      'border-[var(--color-success)]/35 bg-[var(--color-success-soft)] text-[var(--color-success)]',
  },
  wrong_answer: {
    label: 'Respuesta incorrecta',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  runtime_error: {
    label: 'Error de ejecución',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  time_limit_exceeded: {
    label: 'Tiempo excedido',
    className:
      'border-[var(--color-warning)]/35 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
  compilation_error: {
    label: 'Error de compilación',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  memory_limit_exceeded: {
    label: 'Memoria excedida',
    className:
      'border-[var(--color-warning)]/35 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
  internal_error: {
    label: 'Error interno',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  running: {
    label: 'Ejecutando',
    className: 'border-sky-400/35 bg-sky-400/10 text-sky-300',
  },
  pending: {
    label: 'Intentado',
    className:
      'border-[var(--color-warning)]/40 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
}

export function normalizeJudgeStatus(status: string): JudgeStatus {
  const normalized = status.toLowerCase().replace(/\s+/g, '_') as JudgeStatus
  return normalized in judgeStatusMeta ? normalized : 'pending'
}

export function getJudgeStatusLabel(status: JudgeStatus | string) {
  return judgeStatusMeta[normalizeJudgeStatus(status)].label
}
