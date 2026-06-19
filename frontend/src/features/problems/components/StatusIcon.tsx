import { Check } from 'lucide-react'

import { t } from '@/features/problems/utils/problemsI18n'

type StatusIconProps = {
  solved: boolean
}

export function StatusIcon({ solved }: StatusIconProps) {
  if (solved) {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
        aria-label={t('status.solved')}
      >
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    )
  }

  return (
    <span
      className="inline-flex h-5 w-5 rounded-full border border-slate-600"
      aria-label={t('status.pending')}
    />
  )
}
