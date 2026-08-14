import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, BookOpen, Code2, Trophy } from 'lucide-react'

import { features } from '@/features/landing/constants/landingContent'
import type { FeatureIconKey, FeatureItem } from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

const iconMap: Record<FeatureIconKey, ReactNode> = {
  code2: <Code2 className="h-5 w-5" aria-hidden="true" />,
  'bar-chart3': <BarChart3 className="h-5 w-5" aria-hidden="true" />,
  trophy: <Trophy className="h-5 w-5" aria-hidden="true" />,
  'book-open': <BookOpen className="h-5 w-5" aria-hidden="true" />,
}

const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function FeatureSection() {
  return (
    <section
      className="relative z-10 border-b border-[var(--color-border-soft)] bg-transparent py-24 sm:py-32"
      aria-labelledby="features-title"
    >
      <SectionContainer>
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-24">
          <motion.div
            className="max-w-xl"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <LandingBadge>¿Qué es Codenix?</LandingBadge>
            <h2
              id="features-title"
              className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.055em] text-[var(--color-text)] sm:text-5xl"
            >
              Entrena algoritmos con una señal clara de avance.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--color-text-soft)]">
              Problemas, editor y veredictos en un solo flujo para practicar sin perder el hilo.
            </p>
          </motion.div>

          <motion.div
            className="divide-y divide-[var(--color-border-soft)] border-y border-[var(--color-border-soft)]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            transition={{ staggerChildren: 0.07 }}
          >
            {features.map((feature) => (
              <FeatureRow key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  )
}

function FeatureRow({ feature }: { feature: FeatureItem }) {
  const isUpcoming = Boolean(feature.status === 'Próximamente' || feature.status === 'PrÃ³ximamente')

  return (
    <motion.article
      className={`group flex items-center gap-4 py-5 sm:gap-5 ${isUpcoming ? 'opacity-60' : ''}`}
      variants={reveal}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-primary)] transition-colors duration-150 group-hover:text-[var(--color-accent)]">
        {iconMap[feature.icon]}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
          {feature.title}
        </p>
        {feature.status && (
          <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[var(--color-text-subtle)]">
            {feature.status}
          </span>
        )}
      </div>
    </motion.article>
  )
}
