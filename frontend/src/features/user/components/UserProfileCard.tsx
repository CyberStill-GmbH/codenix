import { useState, type ReactNode } from 'react'
import { ChevronDown, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { Submission, User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserCard } from '@/features/user/components/UserCard'
import {
  profileDividerClassName,
  profileInteractiveSurfaceClassName,
  profileInsetSurfaceClassName,
  profilePillClassName,
} from '@/features/user/components/profileStyles'
import { formatDate } from '@/shared/utils/date'

type LangEntry = {
  id: string
  label: string
  icon: string
  color: string
  solved: number
}

type SkillGroup = {
  label: string
  color: string
  tags: Array<{ label: string; count: number }>
}

const supportedLanguages = [
  { id: 'javascript', label: 'JavaScript', icon: '/javascript.svg', color: '#f7df1e' },
  { id: 'typescript', label: 'TypeScript', icon: '/typescript.svg', color: '#3178c6' },
  { id: 'python', label: 'Python', icon: '/python.svg', color: '#3776ab' },
  { id: 'c', label: 'C', icon: '/c.svg', color: '#a8b9cc' },
  { id: 'rust', label: 'Rust', icon: '/rust.svg', color: '#dea584' },
]

const skillLevels = [
  { label: 'Avanzado', color: 'var(--color-success)' },
  { label: 'Intermedio', color: 'var(--color-difficulty-medium)' },
  { label: 'Fundamental', color: 'var(--color-accent)' },
] as const

type ProfileLink = {
  label: string
  href: string
  emptyLabel: string
  Icon: ({ className }: { className?: string }) => ReactNode
}

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

function buildLanguageStats(submissions: Submission[]): LangEntry[] {
  const solved: Record<string, Set<string | number>> = {}

  for (const submission of submissions) {
    if (submission.status === 'accepted') {
      const langKey = submission.language.toLowerCase()
      if (!solved[langKey]) solved[langKey] = new Set()
      solved[langKey].add(submission.problemId)
    }
  }

  return supportedLanguages
    .map((language) => ({
      ...language,
      solved: solved[language.id]?.size ?? 0,
    }))
    .filter((language) => language.solved > 0)
    .slice(0, 3)
}

function buildSkillGroups(submissions: Submission[]): SkillGroup[] {
  const tagCounts = new Map<string, Set<string | number>>()

  for (const submission of submissions) {
    if (submission.status !== 'accepted') continue

    for (const topic of submission.topics ?? []) {
      if (!tagCounts.has(topic)) tagCounts.set(topic, new Set())
      tagCounts.get(topic)?.add(submission.problemId)
    }
  }

  const tags = Array.from(tagCounts.entries())
    .map(([label, problemIds]) => ({ label, count: problemIds.size }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  return skillLevels.map((level, index) => ({
    ...level,
    tags: tags.filter((tag) => {
      if (level.label === 'Avanzado') return tag.count >= 3
      if (level.label === 'Intermedio') return tag.count === 2
      return tag.count <= 1
    }).slice(0, index === 2 ? 6 : 3),
  }))
}

function getHandle(url: string) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.replace(/^\/|\/$/g, '')
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  }
}

function solvedLabel(count: number) {
  return `x${count}`
}

function LanguageIcon({ src, label, color }: { src: string; label: string; color: string }) {
  return (
    <span
      className="h-5 w-5 shrink-0"
      style={{
        backgroundColor: color,
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
      role="img"
      aria-label={label}
    />
  )
}

function Divider() {
  return <div className={profileDividerClassName} />
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
  const navigate = useNavigate()
  const [showAllSkills, setShowAllSkills] = useState(false)
  const langEntries = buildLanguageStats(submissions)
  const skillGroups = buildSkillGroups(submissions)
  const solvedTotal = new Set(
    submissions
      .filter((submission) => submission.status === 'accepted')
      .map((submission) => submission.problemId),
  ).size
  const activeDays = new Set(submissions.map((submission) => submission.submittedAt.slice(0, 10))).size
  const maxStreak = 3
  const profileLinks: ProfileLink[] = [
    { label: 'github.com', href: user.githubUrl, emptyLabel: 'Añadir GitHub', Icon: GithubIcon },
    { label: 'linkedin.com', href: user.linkedinUrl, emptyLabel: 'Añadir LinkedIn', Icon: LinkedinIcon },
  ]

  return (
    <UserCard as="article" className="!border-none !bg-transparent !shadow-none">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <UserAvatar src={user.avatarUrl} name={user.name} size="lg" />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold leading-tight text-[var(--color-text)]">
                {user.name}
              </h1>
              <p className="mt-1 truncate text-sm font-medium text-[var(--color-text-muted)]">
                @{user.username}
              </p>
              <p className="mt-1 text-sm leading-snug text-[var(--color-text-muted)]">
                {user.degree}
              </p>
              {user.memberSince && (
                <p className="mt-2 text-xs text-[var(--color-text-subtle)]">
                  Miembro desde {formatDate(user.memberSince)}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Editar perfil"
            onClick={() => navigate('/settings')}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 text-xs font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-text)]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>
        </div>

        <div className={`mt-4 grid grid-cols-3 gap-2 rounded-xl p-3 ${profileInsetSurfaceClassName}`}>
          {[
            { label: 'Resueltos', value: solvedTotal },
            { label: 'Dias activos', value: activeDays },
            { label: 'Racha max.', value: maxStreak },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="font-mono text-xl font-bold text-[var(--color-text)]">
                {metric.value}
              </p>
              <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid max-w-[15rem] grid-cols-2 gap-2 px-4 pb-4">
        {profileLinks.map(({ label, href, emptyLabel, Icon }) => {
          const handle = getHandle(href)
          const content = (
            <>
              <Icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <span className="min-w-0 truncate">{handle ? `${label}/${handle}` : emptyLabel}</span>
            </>
          )

          return href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-[var(--color-text-muted)] ${profileInteractiveSurfaceClassName}`}
            >
              {content}
            </a>
          ) : (
            <button
              key={label}
              type="button"
              disabled
              className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-[var(--color-text-subtle)] ${profileInsetSurfaceClassName}`}
            >
              {content}
            </button>
          )
        })}
      </div>

      <Divider />
      <div className="px-4 pb-4 pt-4">
        <SectionLabel>Languages</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {langEntries.map((language) => (
            <span
              key={language.id}
              className={`${profilePillClassName} flex items-center gap-1.5`}
            >
              <LanguageIcon src={language.icon} label={language.label} color={language.color} />
              {language.label}
              <span className="text-[var(--color-text-subtle)]">{solvedLabel(language.solved)}</span>
            </span>
          ))}
        </div>
      </div>

      <Divider />
      <div className="px-4 pb-4 pt-4">
        <SectionLabel>Skills</SectionLabel>
        <div className="flex flex-col gap-4">
          {skillGroups.map((group) => {
            const visibleTags = showAllSkills ? group.tags : group.tags.slice(0, 3)
            if (visibleTags.length === 0) return null

            return (
              <div key={group.label}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-xs font-semibold" style={{ color: group.color }}>
                    {group.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map((tag) => (
                    <span
                      key={tag.label}
                      className={profilePillClassName}
                    >
                      {tag.label}
                      <span className="text-[var(--color-text-subtle)]">x{tag.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {skillGroups.some((group) => group.tags.length > 3) && (
          <button
            type="button"
            onClick={() => setShowAllSkills((current) => !current)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)]"
          >
            {showAllSkills ? 'Ver menos' : 'Ver mas'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${showAllSkills ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </UserCard>
  )
}
