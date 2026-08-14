import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { LandingButton } from '@/features/landing/components/common/LandingButton'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'
import logo from '@/assets/icons/logo.png'

export function CtaSection() {
  return (
    <motion.section
      className="relative z-10 overflow-hidden border-b border-[var(--color-border-soft)] bg-[var(--color-auth-brand-bg)] py-28 sm:py-40"
      aria-labelledby="cta-title"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <CtaGrid />
      <SectionContainer className="relative z-10 flex flex-col items-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-[0.09]" style={{ mask: `url(${logo}) center / contain no-repeat`, WebkitMask: `url(${logo}) center / contain no-repeat`, backgroundColor: 'var(--color-accent)' }} aria-hidden="true" />
        <div className="relative z-10 w-full max-w-4xl px-6 py-4 sm:px-12 sm:py-8">
          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <LandingBadge>
              IEEE Computer Society UNI
            </LandingBadge>

            <h2
              id="cta-title"
              className="mt-5 max-w-2xl text-balance text-3xl font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl"
            >
              Convierte la intención de practicar en una sesión real hoy.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-base">
              Elige un problema, resuelve un caso y deja una señal de avance.
              La constancia empieza con el siguiente envío.
            </p>

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <LandingButton
                to="/login"
                variant="primary"
                className="shadow-[var(--shadow-auth-button)] hover:scale-[1.02] hover:brightness-110"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Empezar a practicar
              </LandingButton>

              <LandingButton href="/#vision" variant="ghost" className="!bg-transparent hover:bg-[rgba(11,127,195,0.06)]">
                Conocer la visión
              </LandingButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  )
}

function CtaGrid() {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lines = Array.from({ length: 17 }, (_, index) => (index - 8) * 52)
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_76%)]" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
      {lines.map((offset, index) => {
        const x = 500 + offset
        const path = `M ${x} 0 Q ${500 + offset * 0.35} 310 ${x} 620`
        return <motion.path key={`v-${index}`} d={path} fill="none" stroke="var(--color-primary)" strokeOpacity="0.06" strokeWidth="1" initial={reducedMotion ? { opacity: 0.06 } : { opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: reducedMotion ? 0 : Math.abs(index - 8) * 0.025, ease: 'easeOut' }} />
      })}
      {lines.map((offset, index) => {
        const y = 310 + offset * 0.55
        const path = `M 0 ${y} Q 500 ${310 + offset * 0.15} 1000 ${y}`
        return <motion.path key={`h-${index}`} d={path} fill="none" stroke="var(--color-primary)" strokeOpacity="0.06" strokeWidth="1" initial={reducedMotion ? { opacity: 0.06 } : { opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: reducedMotion ? 0 : Math.abs(index - 8) * 0.025, ease: 'easeOut' }} />
      })}
    </svg>
  )
}
