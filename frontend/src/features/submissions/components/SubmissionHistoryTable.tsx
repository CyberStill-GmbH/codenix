import { Link } from 'react-router-dom'
import { Check, ChevronDown, XCircle } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'
import { es } from 'date-fns/locale'

import type {
  Difficulty,
  Submission,
  SubmissionResult,
} from '@/features/submissions/types/submission.types'

type SubmissionHistoryTableProps = {
  submissions: Submission[]
}

const difficultyClassName: Record<Difficulty, string> = {
  Easy: 'text-[var(--color-difficulty-easy)]',
  Medium: 'text-[var(--color-difficulty-medium)]',
  Hard: 'text-[var(--color-difficulty-hard)]',
}

const resultClassName: Record<SubmissionResult, string> = {
  Accepted: 'text-[var(--color-success)]',
  'Wrong Answer': 'text-[var(--color-error)]',
  'Runtime Error': 'text-[var(--color-warning)]',
  'Time Limit Exceeded': 'text-[var(--color-warning)]',
  'Compilation Error': 'text-[var(--color-text-muted)]',
}

function formatSubmittedAt(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true, locale: es })
}

export function SubmissionHistoryTable({ submissions }: SubmissionHistoryTableProps) {
  if (submissions.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-lg)]">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Aun no hay envios.
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Resuelve tu primer problema para empezar tu historial.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
      <div className="hidden grid-cols-[10rem_minmax(0,1fr)_10rem_8rem] border-b border-[var(--color-border-soft)] px-5 py-4 md:grid">
        {['Last Submitted', 'Problem', 'Last Result', 'Submissions'].map((heading) => (
          <span
            key={heading}
            className="text-xs font-semibold text-[var(--color-text-muted)]"
          >
            {heading}
          </span>
        ))}
      </div>

      <div className="space-y-2 p-3">
        {submissions.map((submission, index) => {
          const rowSurface = index % 2 === 0 ? 'bg-[var(--color-surface-soft)]' : 'bg-[var(--color-surface-elevated)]'
          const isAccepted = submission.result === 'Accepted'
          const problemSlug = submission.problemSlug ?? submission.problemId

          return (
            <Link
              key={submission.id}
              to={`/problems/${problemSlug}?submission=${submission.id}`}
              className={`grid w-full gap-3 rounded-xl px-4 py-4 text-left transition hover:bg-[var(--color-surface-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:grid-cols-[10rem_minmax(0,1fr)_10rem_8rem] md:items-center ${rowSurface}`}
            >
              <time
                dateTime={submission.submittedAt}
                className="text-sm text-[var(--color-text-muted)]"
              >
                {formatSubmittedAt(submission.submittedAt)}
              </time>

              <div className="grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
                <span className="pt-0.5">
                  {isAccepted ? (
                    <Check className="h-4 w-4 text-[var(--color-success)]" aria-label="Accepted" />
                  ) : (
                    <XCircle className="h-4 w-4 text-[var(--color-text-subtle)]" aria-label={submission.result} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                    {submission.problemTitle}
                  </span>
                  <span className={`mt-1 block text-sm font-semibold ${difficultyClassName[submission.difficulty]}`}>
                    {submission.difficulty}
                  </span>
                </span>
              </div>

              <span className={`text-sm font-medium ${resultClassName[submission.result]}`}>
                {submission.result}
              </span>

              <span className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-text-muted)]">
                {submission.submissionsCount}
                <ChevronDown className="h-4 w-4 text-[var(--color-text-subtle)]" aria-hidden="true" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
