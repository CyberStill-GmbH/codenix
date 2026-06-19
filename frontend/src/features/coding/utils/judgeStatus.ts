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
    label: 'Wrong Answer',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  runtime_error: {
    label: 'Runtime Error',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  time_limit_exceeded: {
    label: 'Time Limit Exceeded',
    className:
      'border-[var(--color-warning)]/35 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
  compilation_error: {
    label: 'Compilation Error',
    className:
      'border-[var(--color-error)]/35 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  memory_limit_exceeded: {
    label: 'Memory Limit Exceeded',
    className:
      'border-[var(--color-warning)]/35 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
  pending: {
    label: 'Pending',
    className: 'border-slate-600/50 bg-slate-900/70 text-[var(--color-text-muted)]',
  },
}

export function normalizeJudgeStatus(status: string): JudgeStatus {
  const normalized = status.toLowerCase().replace(/\s+/g, '_') as JudgeStatus
  return normalized in judgeStatusMeta ? normalized : 'pending'
}

export function getJudgeStatusLabel(status: JudgeStatus | string) {
  return judgeStatusMeta[normalizeJudgeStatus(status)].label
}
