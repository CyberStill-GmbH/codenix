import type { JudgeStatus } from '@/features/coding/types/coding.types'
import { judgeStatusMeta, normalizeJudgeStatus } from '@/features/coding/utils/judgeStatus'

type JudgeStatusBadgeProps = {
  status: JudgeStatus | string
}

export function JudgeStatusBadge({ status }: JudgeStatusBadgeProps) {
  const normalized = normalizeJudgeStatus(status)
  const meta = judgeStatusMeta[normalized]

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}
