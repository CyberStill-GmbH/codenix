import { Pencil } from 'lucide-react'

import type { Submission, User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserCard } from '@/features/user/components/UserCard'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

type LangEntry = {
  id: string
  label: string
  icon: string
  solved: number
}

const SUPPORTED_LANGS = [
  { id: 'JavaScript', label: 'JavaScript', icon: '/javascript.svg' },
  { id: 'Python', label: 'Python', icon: '/python.svg' },
  { id: 'Java', label: 'Java', icon: '/java.svg' },
]

const skillsGroups = [
  {
    label: 'Temas dominados',
    color: '#818cf8',
    tags: [{ label: 'Dynamic Programming', count: 3 }, { label: 'Graphs', count: 2 }],
  },
  {
    label: 'En progreso',
    color: 'var(--color-difficulty-medium)',
    tags: [{ label: 'Binary Search', count: 4 }, { label: 'Sorting', count: 5 }, { label: 'Hash Table', count: 3 }],
  },
  {
    label: 'Fundamentos',
    color: 'var(--color-difficulty-easy)',
    tags: [{ label: 'Arrays', count: 8 }, { label: 'Strings', count: 6 }, { label: 'Math', count: 4 }],
  },
]

function buildLanguageStats(submissions: Submission[]): LangEntry[] {
  const solved: Record<string, Set<number>> = {}

  for (const submission of submissions) {
    if (submission.status === 'accepted') {
      if (!solved[submission.language]) solved[submission.language] = new Set()
      solved[submission.language].add(submission.problemId)
    }
  }

  return SUPPORTED_LANGS.map((language) => ({
    ...language,
    solved: solved[language.id]?.size ?? 0,
  })).filter((language) => language.solved > 0)
}

function LanguageIcon({ src, label }: { src: string; label: string }) {
  return (
    <span
      className="h-5 w-5 shrink-0 bg-[var(--color-accent)]"
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
      role="img"
      aria-label={label}
    />
  )
}

function solvedLabel(count: number) {
  return `${count} ${count === 1 ? 'resuelto' : 'resueltos'}`
}

function Divider() {
  return <div className="border-t border-slate-700/40" />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
      {children}
    </p>
  )
}

type UserProfileCardProps = {
  user: User
  submissions?: Submission[]
}

export function UserProfileCard({ user, submissions = [] }: UserProfileCardProps) {
  const langEntries = buildLanguageStats(submissions)
  const solvedTotal = langEntries.reduce((total, language) => total + language.solved, 0)

  const profileLinks = [
    { label: user.githubUrl ? 'GitHub' : 'Añadir GitHub', href: user.githubUrl, Icon: GithubIcon },
    { label: user.linkedinUrl ? 'LinkedIn' : 'Añadir LinkedIn', href: user.linkedinUrl, Icon: LinkedinIcon },
  ]

  return (
    <UserCard as="article">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-4">
          <UserAvatar src={user.avatarUrl} name={user.name} size="lg" />
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold leading-tight text-[var(--color-text)]">
              {user.name}
            </h1>
            <p className="mt-1 text-sm leading-snug text-[var(--color-text-muted)]">
              {user.degree}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-subtle)]">
              @{user.username}
              {user.memberSince ? ` · Miembro desde ${user.memberSince}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          aria-label="Editar perfil"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border border-slate-600/70 bg-slate-900/60 px-3 text-xs font-medium text-[var(--color-text-muted)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-80"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Editar
        </button>
      </div>

      <div className="px-5 pb-5">
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/45 px-3 py-2 text-sm text-[var(--color-text-muted)]">
          <span className="font-mono font-semibold text-[var(--color-text)]">{solvedTotal}</span> problemas resueltos
          <span className="text-[var(--color-text-subtle)]"> · </span>
          <span className="font-mono font-semibold text-[var(--color-text)]">67</span> dias activos
          <span className="text-[var(--color-text-subtle)]"> · </span>
          racha maxima <span className="font-mono font-semibold text-[var(--color-text)]">3</span> dias
        </div>
      </div>

      <Divider />
      <div className="grid grid-cols-2 gap-2 p-5">
        {profileLinks.map(({ label, href, Icon }) => {
          const content = (
            <>
              <Icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              {label}
            </>
          )

          return href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 px-3 text-sm font-medium text-[var(--color-text-muted)] transition hover:bg-slate-800/70 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              {content}
            </a>
          ) : (
            <button
              key={label}
              type="button"
              disabled
              className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-950/30 px-3 text-sm font-medium text-[var(--color-text-subtle)]"
            >
              {content}
            </button>
          )
        })}
      </div>

      <Divider />
      <div className="px-5 pb-5 pt-5">
        <SectionLabel>Languages</SectionLabel>
        <ul className="flex flex-col gap-3">
          {langEntries.map((language) => (
            <li key={language.id} className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3">
              <LanguageIcon src={language.icon} label={language.label} />
              <span className="text-sm font-semibold text-[var(--color-text-soft)]">{language.label}</span>
              <span className="font-mono text-xs tabular-nums text-[var(--color-text-muted)]">
                {solvedLabel(language.solved)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Divider />
      <div className="px-5 pb-5 pt-5">
        <SectionLabel>Skills</SectionLabel>
        <div className="flex flex-col gap-4">
          {skillsGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: group.color }} />
                <span className="text-xs font-semibold" style={{ color: group.color }}>
                  {group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)]"
                  >
                    {tag.label}
                    <span className="text-[var(--color-text-subtle)]">×{tag.count}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserCard>
  )
}
