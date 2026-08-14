import {
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
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
  const reducedMotion = useReducedMotion()

  return (
    <motion.section
      id="vision"
      className="relative z-10 overflow-hidden border-b border-[var(--color-border-soft)] bg-transparent py-24 sm:py-32"
      aria-labelledby="vision-title"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="vision-grid pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_82%)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.72 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ backgroundImage: 'radial-gradient(ellipse at 50% 28%, rgba(11,127,195,0.11), transparent 58%), linear-gradient(rgba(11,127,195,0.085) 1px, transparent 1px), linear-gradient(90deg, rgba(11,127,195,0.085) 1px, transparent 1px)', backgroundSize: '100% 100%, 48px 48px, 48px 48px' }}
        aria-hidden="true"
      />
      <SectionContainer className="flex flex-col items-center">
        <div className="mb-16 flex max-w-3xl flex-col items-center text-center">
          <LandingBadge>
            Visión del proyecto
          </LandingBadge>

          <h2
            id="vision-title"
            className="mt-6 text-3xl font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl lg:text-5xl"
          >
            Una plataforma para entrenar con dirección.
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-[1.0625rem]">
            Codenix organiza práctica, progreso y comunidad en un flujo propio
            para que cada sesión tenga un propósito claro.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-8 text-left lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
            <div className="mb-6 flex items-center gap-3">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Principios
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Lo que guía la plataforma
                </h3>
              </div>
            </div>

            <div className="relative grid gap-7 lg:grid-cols-3 lg:gap-6">
              <motion.svg
                className="pointer-events-none absolute left-[10%] right-[10%] top-[0.55rem] hidden h-px w-[80%] lg:block"
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

              {visionCards.map((card, index) => (
                <VisionCardRow key={card.title} card={card} index={index} />
              ))}
            </div>
          </div>

          <div
            id="roadmap"
            className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]"
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

            <div className="relative pt-3">
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-[1.15rem] h-px border-t border-dashed border-[var(--color-border-soft)]" aria-hidden="true" />
              <div className="pointer-events-none absolute left-[8%] top-[1.15rem] h-px w-[28%] bg-[var(--color-success)]" aria-hidden="true" />
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
    </motion.section>
  )
}

function VisionCardRow({ card, index }: { card: VisionCard; index: number }) {
  return (
    <article className="relative z-10 min-w-0 bg-[var(--color-surface)] lg:pr-2">
      <p className="font-mono text-[0.6875rem] font-semibold tracking-[0.12em] text-[var(--color-text-subtle)]">
        {String(index + 1).padStart(2, '0')} / 03
      </p>
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

  return (
    <article className="relative min-w-0">
      <button type="button" onClick={() => setExpanded((value) => !value)} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} className="group flex w-full flex-col items-start text-left sm:items-center sm:text-center" aria-expanded={expanded}>
      <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--color-surface)] ${isComplete ? 'border-[var(--color-success)]' : 'border-[var(--color-border-strong)]'}`}>
        <StatusIcon
          className={`h-3 w-3 ${isComplete ? 'text-[var(--color-success)]' : 'text-[var(--color-primary)]'}`}
          aria-hidden="true"
        />
      </div>
      <h4 className="mt-4 text-xs font-semibold leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] sm:min-h-8">{item.title}</h4>
      <span className={`mt-2 text-[0.625rem] font-semibold ${config.badgeClass.replace('bg-[var(--color-success-soft)] ', '').replace('bg-[var(--color-primary-soft)] ', '')}`}>{config.label}</span>
      <span className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out ${expanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
        <span className="min-h-0 overflow-hidden text-xs leading-relaxed text-[var(--color-text-muted)]">{item.description}</span>
      </span>
      </button>
    </article>
  )
}
