import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  GitBranch,
  LineChart,
  Trophy,
} from 'lucide-react'

import {
  roadmapItems,
  visionCards,
} from '@/features/landing/constants/landingContent'
import type {
  RoadmapItem,
  RoadmapStatus,
  VisionCard,
  VisionIconKey,
} from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

const visionIcons: Record<VisionIconKey, typeof Circle> = {
  'git-branch': GitBranch,
  code2: Code2,
  'line-chart': LineChart,
}

const statusConfig: Record<
  RoadmapStatus,
  { label: string; dotClass: string; badgeClass: string; Icon: typeof Circle }
> = {
  'Base V1': {
    label: 'Base V1',
    dotClass: 'bg-[var(--color-success)]',
    badgeClass: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
    Icon: CheckCircle2,
  },
  Visión: {
    label: 'Visión',
    dotClass: 'bg-[var(--color-primary)]',
    badgeClass: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
    Icon: Circle,
  },
  Próximamente: {
    label: 'En construcción',
    dotClass: 'bg-[var(--color-primary)]',
    badgeClass: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
    Icon: Clock,
  },
}

export function VisionSection() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden border-b border-[var(--color-border-soft)] bg-[var(--color-bg)] py-16 sm:py-24"
      aria-labelledby="vision-title"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(11,127,195,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.07),transparent_50%)]" />

      <SectionContainer className="flex flex-col items-center">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <LandingBadge icon={<BookOpen className="h-3.5 w-3.5" />}>
            Visión del proyecto
          </LandingBadge>

          <h2
            id="vision-title"
            className="mt-6 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl lg:text-4xl"
          >
            Una plataforma para entrenar con dirección.
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-[1.0625rem]">
            Codenix organiza práctica, progreso y comunidad en un flujo propio
            para que cada sesión tenga un propósito claro.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-8 text-left lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-[rgba(15,23,42,0.42)] p-5 shadow-[var(--shadow-md)] backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <GitBranch className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Principios
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Lo que guía la plataforma
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {visionCards.map((card) => (
                <VisionCardRow key={card.title} card={card} />
              ))}
            </div>
          </div>

          <div
            id="roadmap"
            className="rounded-[var(--radius-2xl)] border border-[var(--color-border-soft)] bg-[rgba(15,23,42,0.42)] p-5 shadow-[var(--shadow-md)] backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Trophy className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Roadmap
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  De práctica a ecosistema de entrenamiento
                </h3>
              </div>
            </div>

            <div className="relative flex flex-col gap-0">
              <div
                className="absolute bottom-5 left-[0.6875rem] top-5 w-px bg-[var(--color-border-soft)]"
                aria-hidden="true"
              />

              {roadmapItems.map((item, index) => (
                <RoadmapRow
                  key={item.title}
                  item={item}
                  isLast={index === roadmapItems.length - 1}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--color-border-soft)] pt-5">
              {(Object.entries(statusConfig) as [
                RoadmapStatus,
                (typeof statusConfig)[RoadmapStatus],
              ][]).map(([status, config]) => (
                <span
                  key={status}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${config.dotClass}`}
                    aria-hidden="true"
                  />
                  {config.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}

function VisionCardRow({ card }: { card: VisionCard }) {
  const Icon = visionIcons[card.icon]

  return (
    <article className="rounded-[var(--radius-xl)] border border-white/[0.07] bg-[rgba(7,18,37,0.58)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-stat-border)] bg-[var(--color-stat-icon-bg)] text-[var(--color-primary)]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {card.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  )
}

function RoadmapRow({ item, isLast }: { item: RoadmapItem; isLast: boolean }) {
  const config = statusConfig[item.status]
  const StatusIcon = config.Icon
  const isActive = item.status === 'Próximamente'

  return (
    <article
      className={`relative flex items-start gap-5 py-4 ${!isLast ? 'pb-6' : ''} ${
        isActive
          ? 'rounded-[var(--radius-xl)] border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-3 shadow-[var(--shadow-glow-primary)]'
          : ''
      }`}
    >
      <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <StatusIcon
          className={`h-3.5 w-3.5 ${
            item.status === 'Base V1'
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-primary)]'
          } ${isActive ? 'motion-safe:animate-pulse' : ''}`}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-[var(--color-text)]">
            {item.title}
          </h4>
          <span className={`rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {item.description}
        </p>
      </div>
    </article>
  )
}
