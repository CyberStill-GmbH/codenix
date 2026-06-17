import { Link } from 'react-router-dom'
import { formatDistanceToNowStrict } from 'date-fns'
import { es } from 'date-fns/locale'

import { UserCard } from '@/features/user/components/UserCard'
import type { Submission } from '@/features/user/types/user.types'

type UserRecentSubmissionsProps = {
  submissions: Submission[]
}

function formatRelativeDate(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true, locale: es })
}

export function UserRecentSubmissions({ submissions }: UserRecentSubmissionsProps) {
  // TODO: API - GET /api/submissions?userId={id}&limit=10&sort=desc
  if (submissions.length === 0) {
    return (
      <UserCard>
        <div className="p-6 text-center">
          <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
            Aun no hay envios.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
            Resuelve tu primer problema para empezar tu historial.
          </p>
          <Link
            to="/problems"
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            Ir a Problems
          </Link>
        </div>
      </UserCard>
    )
  }

  return (
    <UserCard>
      <div className="p-5">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
            Ultimos envios
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Tus soluciones mas recientes
          </p>
        </header>

        <div className="hidden px-4 pb-3 md:grid md:grid-cols-[minmax(0,1fr)_9rem]">
          {['Problema', 'Enviado'].map((heading) => (
            <span
              key={heading}
              className={`text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] ${
                heading === 'Enviado' ? 'text-right' : ''
              }`}
            >
              {heading}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              type="button"
              onClick={() => console.log('Row clicked: ', submission.id)}
              className="grid w-full cursor-pointer gap-2 rounded-xl bg-slate-900/50 px-4 py-4 text-left transition hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:grid-cols-[minmax(0,1fr)_9rem] md:items-center"
            >
              <p className="min-w-0 truncate text-sm font-semibold text-[var(--color-text)]">
                {submission.problemName}
              </p>

              <time
                dateTime={submission.submittedAt}
                className="whitespace-nowrap text-sm text-[var(--color-text-muted)] md:text-right"
              >
                {formatRelativeDate(submission.submittedAt)}
              </time>
            </button>
          ))}
        </div>
      </div>
    </UserCard>
  )
}
