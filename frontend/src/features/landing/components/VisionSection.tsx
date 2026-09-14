import {
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  GitBranch,
  LineChart,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import {
  roadmapItems,
  visionCards,
} from '@/features/landing/constants/landingContent'
import type { RoadmapItem, RoadmapStatus, VisionCard } from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'
import { LampContainer } from '@/components/ui/lamp'
import { CardSkeletonContainer } from '@/components/cards-demo-3'

const statusConfig: Record<
  RoadmapStatus,
  { label: string; dotClass: string; badgeClass: string; Icon: typeof Circle }
> = {
  'Base V1': {
    label: 'Base V1',
    dotClass: 'bg-[var(--color-primary)]',
    badgeClass: 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
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
    dotClass: 'bg-[var(--color-warning)]',
    badgeClass: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
    Icon: Clock,
  },
}

export function VisionSection() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.section
      id="vision"
      className="relative z-10 overflow-hidden border-b border-[var(--color-border-soft)] bg-transparent py-20 sm:py-28"
      aria-labelledby="vision-title"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <SectionContainer className="flex flex-col items-center">
        <LampContainer className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0.35, y: 64 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <LandingBadge variant="primary">Visión del proyecto</LandingBadge>
            <h2 id="vision-title" className="mt-5 max-w-4xl text-center text-4xl font-black leading-[0.94] tracking-[-0.06em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
              Una plataforma para entrenar con dirección.
            </h2>
            <p className="mt-6 max-w-2xl text-center text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-lg">
              Codenix organiza práctica, progreso y comunidad en un flujo propio para que cada sesión tenga un propósito claro.
            </p>
          </motion.div>
        </LampContainer>

        <div className="grid w-full max-w-5xl gap-8 text-left lg:grid-cols-2 lg:items-start lg:gap-10">
          <article className="min-w-0 border-t border-[var(--color-border-strong)] pt-5">
            <CardSkeletonContainer className="mb-7 h-36 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-primary-soft)]" showGradient={false}>
              <img src="/landing/ieee-cs-uni.png" alt="IEEE Computer Society de la Universidad Nacional de Ingeniería" className="h-full w-full bg-white object-contain object-center" />
            </CardSkeletonContainer>
            <div className="mb-6 flex items-center gap-3">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Cómo trabajamos
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Lo que guía la plataforma
                </h3>
              </div>
            </div>

            <div className="relative grid gap-7 lg:grid-cols-3 lg:gap-6">
              <motion.svg
                className="pointer-events-none absolute left-[10%] right-[10%] top-[0.65rem] hidden h-px w-[80%] lg:block"
                viewBox="0 0 100 1"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <motion.path
                  d="M0 0.5H100"
                  fill="none"
                  stroke="var(--color-border-strong)"
                  strokeWidth="0.8"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: reducedMotion ? 0 : 100 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </motion.svg>

              {visionCards.map((card) => (
                <VisionCardRow key={card.title} card={card} />
              ))}
            </div>
          </article>

          <div id="roadmap" className="lg:translate-y-10">
            <article className="min-w-0 border-t border-[var(--color-border-strong)] pt-5">
            <CardSkeletonContainer className="mb-7 h-36 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-accent-soft)]" showGradient={false}>
              <img src="/landing/community-next-steps.png" alt="Comunidad de estudiantes reunida en una actividad de IEEE Computer Society UNI" className="h-full w-full object-cover object-center" />
            </CardSkeletonContainer>
            <div className="mb-7">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Próximos pasos
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  De práctica a ecosistema de entrenamiento
                </h3>
              </div>
            </div>

            <div className="relative pt-3">
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-[1.15rem] h-px border-t border-dashed border-[var(--color-border-soft)]" aria-hidden="true" />
              <div className="pointer-events-none absolute left-[8%] top-[1.15rem] h-px w-[28%] bg-[var(--color-primary)]" aria-hidden="true" />
              <div className="relative grid gap-5 sm:grid-cols-4 sm:gap-3">
                {roadmapItems.map((item) => <RoadmapRow key={item.title} item={item} />)}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--color-border-soft)] pt-5">
              {(Object.entries(statusConfig) as [
                RoadmapStatus,
                (typeof statusConfig)[RoadmapStatus],
              ][]).map(([status, config]) => (
                <span
                  key={status}
                  className="flex items-center gap-1.5 font-[cursive] text-xs italic tracking-[0.02em] text-[var(--color-text-muted)]"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${config.dotClass}`}
                    aria-hidden="true"
                  />
                  {config.label}
                </span>
              ))}
            </div>
            </article>
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  )
}

const visionIcons = { 'git-branch': GitBranch, code2: Code2, 'line-chart': LineChart }

function VisionCardRow({ card }: { card: VisionCard }) {
  const Icon = visionIcons[card.icon]

  return (
    <article className="relative z-10 min-w-0 lg:pr-2">
      <div className="relative z-10 flex w-fit items-center bg-[var(--color-bg)] pr-3">
        <Icon className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">
        {card.title}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
        {card.description}
      </p>
    </article>
  )
}

function RoadmapRow({ item }: { item: RoadmapItem }) {
  const [expanded, setExpanded] = useState(false)
  const config = statusConfig[item.status]
  const StatusIcon = config.Icon
  const isComplete = item.status === 'Base V1'
  const tooltipId = `roadmap-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <article className={`relative min-w-0 ${expanded ? 'z-30' : 'z-10'}`}>
      <button type="button" onClick={() => setExpanded((value) => !value)} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} onFocus={() => setExpanded(true)} onBlur={() => setExpanded(false)} className="group flex w-full flex-col items-start text-left sm:items-center sm:text-center" aria-expanded={expanded} aria-describedby={expanded ? tooltipId : undefined}>
      <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-surface)] ${isComplete ? 'border-[var(--color-primary)]' : 'border-[var(--color-border-strong)]'}`}>
        <StatusIcon
          className="h-3 w-3 text-[var(--color-primary)]"
          aria-hidden="true"
        />
      </div>
      <h4 className="mt-4 text-xs font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] sm:min-h-8">{item.title}</h4>
      <span className={`mt-2 font-[cursive] text-[0.625rem] font-semibold italic tracking-[0.02em] ${config.badgeClass.replace('bg-[var(--color-success-soft)] ', '').replace('bg-[var(--color-primary-soft)] ', '').replace('bg-[var(--color-warning-soft)] ', '')}`}>{config.label}</span>
      <span id={tooltipId} role="tooltip" className={`pointer-events-none absolute left-1/2 top-full mt-3 w-[min(13rem,calc(100vw-3rem))] -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-3 py-2 text-left text-xs leading-relaxed text-[var(--color-text-muted)] shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-200 ease-out ${expanded ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}>
        {item.description}
      </span>
      </button>
    </article>
  )
}
