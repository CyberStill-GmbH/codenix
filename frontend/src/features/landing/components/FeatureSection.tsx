import type { ReactNode } from 'react'
import { BarChart3, BookOpen, Code2, Trophy } from 'lucide-react'

import { features } from '@/features/landing/constants/landingContent'
import type { FeatureIconKey, FeatureItem } from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

const iconMap: Record<FeatureIconKey, ReactNode> = {
  code2: <Code2 className="h-6 w-6" aria-hidden="true" />,
  'bar-chart3': <BarChart3 className="h-6 w-6" aria-hidden="true" />,
  trophy: <Trophy className="h-6 w-6" aria-hidden="true" />,
  'book-open': <BookOpen className="h-6 w-6" aria-hidden="true" />,
}

export function FeatureSection() {
  return (
    <section
      className="relative border-b border-[var(--color-border-soft)] bg-[var(--color-bg-soft)] py-16 sm:py-24"
      aria-labelledby="features-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.06),transparent_60%)]" />

      <SectionContainer className="flex flex-col items-center">
        {/* Encabezado */}
        <div className="flex max-w-2xl flex-col items-center text-center">
          <LandingBadge>Plataforma de práctica</LandingBadge>

          <h2
            id="features-title"
            className="mt-5 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl lg:text-4xl"
          >
            Todo empieza con entrenar mejor.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-base">
            Codenix nace como iniciativa de IEEE Computer Society UNI para
            centralizar la práctica algorítmica y la preparación para
            competencias.
          </p>
        </div>

        {/* Lista editorial horizontal */}
        <div className="mt-20 w-full max-w-4xl divide-y divide-[var(--color-border-soft)]">
          {features.map((feature, index) => (
            <FeatureRow key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}

function FeatureRow({
  feature,
  index,
}: {
  feature: FeatureItem
  index: number
}) {
  return (
    <article className="group flex flex-col gap-5 py-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
      {/* Número + ícono */}
      <div className="flex shrink-0 items-center gap-4 sm:w-16 sm:flex-col sm:items-center sm:gap-3">
        <span className="font-mono text-xs font-medium tabular-nums text-[var(--color-text-subtle)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-primary)] transition duration-200 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary-soft)]">
          {iconMap[feature.icon]}
        </div>
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-[var(--color-text)] sm:text-lg">
            {feature.title}
          </h3>
          {feature.status && (
            <span className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-bg)] px-2 py-0.5 text-[0.625rem] font-semibold tracking-wide text-[var(--color-text-subtle)]">
              {feature.status}
            </span>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          {feature.description}
        </p>
      </div>
    </article>
  )
}
