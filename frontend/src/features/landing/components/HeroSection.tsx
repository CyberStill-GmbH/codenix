import { ArrowRight, Sparkles } from 'lucide-react'

import { heroStats } from '@/features/landing/constants/landingContent'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { LandingButton } from '@/features/landing/components/common/LandingButton'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'
import { HeroBackground } from '@/features/landing/components/common/HeroBackground'
import { HeroProjectCard } from '@/features/landing/components/common/HeroProjectCard'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden border-b border-[var(--color-border-soft)]"
      aria-labelledby="hero-title"
    >
      <HeroBackground />

      <SectionContainer className="py-10 lg:py-16">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.9fr)] lg:gap-16">
          <div className="flex max-w-2xl flex-col items-start text-left">
            <LandingBadge icon={<Sparkles className="h-3.5 w-3.5" />}>
              Iniciativa de IEEE Computer Society UNI
            </LandingBadge>

            <h1
              id="hero-title"
              className="mt-6 max-w-2xl text-balance text-[var(--color-text)]"
            >
              Entrena algoritmos, mide tu progreso y compite con enfoque.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-text-soft)] sm:text-[1.0625rem]">
              Codenix centraliza la práctica de programación competitiva mediante
              problemas, envíos de soluciones y seguimiento de avance para
              estudiantes que quieren mejorar con disciplina.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <LandingButton
                to="/login"
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Empezar a practicar
              </LandingButton>

              <LandingButton href="#vision" variant="ghost">
                Ver visión del proyecto
              </LandingButton>
            </div>

            <div className="mt-12 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.07] bg-[rgba(15,23,42,0.38)] px-4 py-3 backdrop-blur transition duration-300 hover:border-[rgba(11,127,195,0.28)] hover:bg-[rgba(15,23,42,0.52)]"
                >
                  <p className="text-lg font-bold leading-none text-[var(--color-text)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.6875rem] font-medium text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroProjectCard />
        </div>
      </SectionContainer>
    </section>
  )
}