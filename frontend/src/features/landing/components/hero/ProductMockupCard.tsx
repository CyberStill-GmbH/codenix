import { Code2, LineChart, ListChecks, Target, Trophy } from 'lucide-react'

import { FloatingBadge } from '@/features/landing/components/hero/FloatingBadge'
import { ProblemListItem } from '@/features/landing/components/hero/ProblemListItem'
import { ProgressBarRow } from '@/features/landing/components/hero/ProgressBarRow'
import { StatCard } from '@/features/landing/components/hero/StatCard'
import { landingTokens } from '@/features/landing/theme/tokens'

const progressItems = [
  { label: 'Arrays', value: '84%' },
  { label: 'Hash Map', value: '72%' },
  { label: 'DP', value: '38%' },
]

const problemRows = [
  { title: 'Two Sum', status: 'Aceptado', difficulty: 'Fácil' },
  { title: 'Binary Search', status: 'En progreso', difficulty: 'Medio' },
  { title: 'Dynamic Paths', status: 'Pendiente', difficulty: 'Difícil' },
]

const metricCards = [
  { icon: Target, label: 'Objetivo', value: 'CP Base' },
  { icon: Trophy, label: 'Rating', value: '800' },
  { icon: ListChecks, label: 'Racha', value: '12 días' },
]

export function ProductMockupCard() {
  return (
    <div className={landingTokens.hero.mockupShell} aria-hidden="true">
      <div className="absolute -left-8 top-8 h-40 w-40 rounded-[var(--radius-full)] bg-[var(--color-primary-soft)] blur-3xl" />
      <div className="absolute -right-10 bottom-4 h-44 w-44 rounded-[var(--radius-full)] bg-[var(--color-accent-muted-soft)] blur-3xl" />

      <div className={landingTokens.hero.mockupPerspective}>
        <div className="absolute inset-0 translate-x-5 translate-y-6 rounded-[var(--radius-mockup)] bg-[rgba(2,6,23,0.48)] blur-xl" />

        <div className={landingTokens.hero.mockupPanel}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(11,127,195,0.22),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(56,189,248,0.12),transparent_32%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className={landingTokens.hero.mockupInner}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-glass-border)] bg-[var(--color-glass-highlight)] text-[var(--color-primary)]">
                  <Code2 className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Codenix Practice
                  </p>
                  <p className="font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                    algorithm workspace
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border-soft)] bg-[rgba(13,24,43,0.58)] px-2.5 py-1 font-mono text-[0.6875rem] font-medium text-[var(--color-text-muted)]">
                preview
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {metricCards.map((card) => (
                <StatCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                />
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
              <div className={landingTokens.hero.dashboardCard}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Problems
                  </p>
                  <Code2 className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                </div>

                <div className="space-y-2">
                  {problemRows.map((problem) => (
                    <ProblemListItem key={problem.title} {...problem} />
                  ))}
                </div>
              </div>

              <div className={landingTokens.hero.dashboardCard}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    Progress
                  </p>
                  <LineChart className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                </div>

                <div className="space-y-3">
                  {progressItems.map((item) => (
                    <ProgressBarRow key={item.label} {...item} />
                  ))}
                </div>

                <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-stat-border)] bg-[var(--color-stat-icon-bg)] p-3">
                  <p className="font-mono text-[0.625rem] text-[var(--color-accent)]">
                    next target
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
                    Resolver 20 problemas base
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FloatingBadge label="Accepted" value="68.3% AC" />
      </div>
    </div>
  )
}
