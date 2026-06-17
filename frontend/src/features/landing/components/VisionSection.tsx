import { BookOpen, CheckCircle2, Circle, Clock, Trophy } from 'lucide-react'

import { roadmapItems } from '@/features/landing/constants/landingContent'
import type { RoadmapItem, RoadmapStatus } from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

// Configuración visual por estado del roadmap
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
    label: 'Próximamente',
    dotClass: 'bg-[var(--color-warning)]',
    badgeClass: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.07),transparent_50%)]" />

      <SectionContainer className="flex flex-col items-center">
        {/* ── Encabezado centrado ── */}
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
            Codenix busca centralizar la práctica de algoritmos, el progreso
            técnico y la preparación para competencias dentro de una
            plataforma propia de la comunidad IEEE CS UNI.
          </p>
        </div>

        {/* Layout 2 columnas centrado para el contenido */}
        <div className="w-full max-w-5xl grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 text-left">

          {/* ── Columna izquierda: Pilares y Comunidad ── */}
          <div className="flex flex-col gap-10">
            {/* Pilares (lista limpia sin cards) */}
            <ul className="flex flex-col gap-6" role="list">
              {[
                { label: 'Plataforma propia', desc: 'Un espacio diseñado desde la comunidad, no adaptado de otra herramienta.' },
                { label: 'Práctica algorítmica', desc: 'El núcleo: resolver problemas, entrenar estructuras de datos y mejorar el razonamiento.' },
                { label: 'Progreso técnico', desc: 'Centralizar el avance para que entrenar sea constante, no disperso.' },
              ].map((pilar) => (
                <li key={pilar.label} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{pilar.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">{pilar.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Columna derecha: Roadmap ── */}
          <div id="roadmap">
            {/* Header del roadmap */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
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

            {/* Timeline */}
            <div className="relative flex flex-col gap-0">
              {/* Línea vertical conectora */}
              <div
                className="absolute left-[0.6875rem] top-5 bottom-5 w-px bg-[var(--color-border-soft)]"
                aria-hidden="true"
              />

              {roadmapItems.map((item, i) => (
                <RoadmapRow key={item.title} item={item} isLast={i === roadmapItems.length - 1} />
              ))}
            </div>

            {/* Leyenda */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--color-border-soft)] pt-5">
              {(Object.entries(statusConfig) as [RoadmapStatus, typeof statusConfig[RoadmapStatus]][]).map(
                ([status, config]) => (
                  <span key={status} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <span className={`h-2 w-2 rounded-full ${config.dotClass}`} aria-hidden="true" />
                    {config.label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}

// ── Subcomponente interno ─────────────────────────

function RoadmapRow({ item, isLast }: { item: RoadmapItem; isLast: boolean }) {
  const config = statusConfig[item.status]
  const StatusIcon = config.Icon

  return (
    <article className={`relative flex items-start gap-5 py-4 ${!isLast ? 'pb-6' : ''}`}>
      {/* Dot con ícono de estado */}
      <div className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <StatusIcon
          className={`h-3.5 w-3.5 ${
            item.status === 'Base V1'
              ? 'text-[var(--color-success)]'
              : item.status === 'Próximamente'
                ? 'text-[var(--color-warning)]'
                : 'text-[var(--color-primary)]'
          }`}
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