import { useState } from 'react'
import { Link } from 'react-router-dom'

import { UserCard } from '@/features/user/components/UserCard'
import {
  profileInsetSurfaceClassName,
  profileInteractiveSurfaceClassName,
  profilePillClassName,
} from '@/features/user/components/profileStyles'
import type { Submission } from '@/features/user/types/user.types'
import { formatRelativeDate } from '@/shared/utils/date'

type UserRecentSubmissionsProps = {
  submissions: Submission[]
}

type SubmissionStatus = Submission['status']
type SubmissionTab = 'accepted' | 'all'

const statusMeta: Record<SubmissionStatus, { label: string; className: string }> = {
  accepted: {
    label: 'Accepted',
    className: 'border-[var(--color-success)]/30 bg-[var(--color-success-soft)] text-[var(--color-success)]',
  },
  wrong_answer: {
    label: 'Wrong Answer',
    className: 'border-[var(--color-error)]/30 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  time_limit_exceeded: {
    label: 'Time Limit Exceeded',
    className: 'border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  },
  runtime_error: {
    label: 'Runtime Error',
    className: 'border-[var(--color-error)]/30 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  compilation_error: {
    label: 'Compilation Error',
    className: 'border-[var(--color-error)]/30 bg-[var(--color-error-soft)] text-[var(--color-error)]',
  },
  pending: {
    label: 'Pending',
    className: 'border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
  },
}

const tabs = [
  { id: 'accepted', label: 'Recientes AC' },
  { id: 'all', label: 'Todos' },
] satisfies Array<{ id: SubmissionTab; label: string }>

function slugFromName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function UserRecentSubmissions({ submissions }: UserRecentSubmissionsProps) {
  const [activeTab, setActiveTab] = useState<SubmissionTab>('accepted')
  const visibleSubmissions =
    activeTab === 'accepted'
      ? submissions.filter((submission) => submission.status === 'accepted')
      : submissions

  if (submissions.length === 0) {
    return (
      <UserCard>
        <div className="p-4 text-center">
          <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
            Aun no hay envios.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
            Resuelve tu primer problema para empezar tu historial.
          </p>
          <Link
            to="/problems"
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-semibold text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-hover)]"
          >
            Ir a Problems
          </Link>
        </div>
      </UserCard>
    )
  }

  return (
    <UserCard>
      <div className="p-4">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
              Ultimos envios
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Tus soluciones mas recientes
            </p>
          </div>

          <div className={`inline-flex rounded-lg p-1 ${profileInsetSurfaceClassName}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-8 rounded-md px-3 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-[#1b222c] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {/* TODO: MVP-PENDING - tabs Solutions y Discuss fuera del alcance actual. */}
          </div>
        </header>

        <div className="space-y-2">
          {visibleSubmissions.map((submission) => {
            const meta = statusMeta[submission.status]
            const problemSlug = submission.problemSlug ?? slugFromName(submission.problemName)

            return (
              <Link
                key={submission.id}
                to={`/problems/${problemSlug}`}
                className={`grid gap-2 rounded-xl px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${profileInteractiveSurfaceClassName}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {submission.problemName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex min-h-6 items-center rounded-full border px-2 text-[0.6875rem] font-bold ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      {submission.language}
                    </span>
                  </div>
                </div>

                <time
                  dateTime={submission.submittedAt}
                  className="whitespace-nowrap text-sm text-[var(--color-text-muted)] md:text-right"
                >
                  {formatRelativeDate(submission.submittedAt)}
                </time>
              </Link>
            )
          })}
        </div>

        <Link
          to="/submissions"
          className={`${profilePillClassName} mt-4 font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-muted)]`}
        >
          Ver todos los envios
        </Link>
      </div>
    </UserCard>
  )
}
