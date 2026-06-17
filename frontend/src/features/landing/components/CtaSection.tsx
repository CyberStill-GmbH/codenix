import { ArrowRight, Sparkles } from 'lucide-react'

import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { LandingButton } from '@/features/landing/components/common/LandingButton'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden border-b border-[var(--color-border-soft)] bg-[var(--color-bg)] py-20 sm:py-28"
      aria-labelledby="cta-title"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_30rem)]" />

      <SectionContainer className="flex flex-col items-center">
        {/* Tarjeta interior */}
        <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[rgba(15,23,42,0.8)] px-6 py-12 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:px-12 sm:py-16">
          {/* Glows decorativos */}
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--color-primary-soft)] blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--color-secondary-soft)] blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <LandingBadge icon={<Sparkles className="h-3.5 w-3.5" />}>
              IEEE Computer Society UNI
            </LandingBadge>

            <h2
              id="cta-title"
              className="mt-5 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl"
            >
              Empieza a construir tu ritmo de práctica.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-base">
              Codenix busca centralizar la práctica de algoritmos, el progreso
              técnico y la preparación para competencias de programación en una
              plataforma propia de la comunidad.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LandingButton
                to="/login"
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Empezar a practicar
              </LandingButton>

              <LandingButton href="#vision" variant="ghost">
                Conocer la visión
              </LandingButton>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}