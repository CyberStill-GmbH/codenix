import type { JudgeStatus } from '@/features/coding/types/coding.types'
import { judgeStatusMeta, normalizeJudgeStatus } from '@/features/coding/utils/judgeStatus'
import { CircleDashed } from 'lucide-react'

type JudgeStatusBadgeProps = {
  status: JudgeStatus | string
}

export function JudgeStatusBadge({ status }: JudgeStatusBadgeProps) {
  const normalized = normalizeJudgeStatus(status)
  const meta = judgeStatusMeta[normalized]

  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold ${meta.className}`}
    >
      {normalized === 'pending' && <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />}
      {meta.label}
    </span>
  )
}
