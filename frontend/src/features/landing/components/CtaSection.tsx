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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_32rem)]" />

      <SectionContainer className="flex flex-col items-center">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[rgba(15,23,42,0.88)] px-6 py-12 shadow-[var(--shadow-xl)] backdrop-blur-xl sm:px-12 sm:py-16">
          <div
            className="absolute -right-12 -top-12 h-40 w-40 rounded-[var(--radius-full)] bg-[var(--color-primary-soft)] blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -left-16 h-48 w-48 rounded-[var(--radius-full)] bg-[var(--color-accent-muted-soft)] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <LandingBadge icon={<Sparkles className="h-3.5 w-3.5" />}>
              IEEE Computer Society UNI
            </LandingBadge>

            <h2
              id="cta-title"
              className="mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl"
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
                className="shadow-[var(--shadow-auth-button)]"
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
