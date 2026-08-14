import { Sparkles } from 'lucide-react'

import { heroStats } from '@/features/landing/constants/landingContent'
import { HeroBackground } from '@/features/landing/components/common/HeroBackground'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'
import { HeroBadge } from '@/features/landing/components/hero/HeroBadge'
import { HeroCTAs } from '@/features/landing/components/hero/HeroCTAs'
import { HeroDescription } from '@/features/landing/components/hero/HeroDescription'
import { HeroHeadline } from '@/features/landing/components/hero/HeroHeadline'
import { ProductMockupCard } from '@/features/landing/components/hero/ProductMockupCard'
import { TrustBadges } from '@/features/landing/components/hero/TrustBadges'
import { landingTokens } from '@/features/landing/theme/tokens'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className={landingTokens.hero.section}
      aria-labelledby="hero-title"
    >
      <HeroBackground />

      <SectionContainer className="py-10 lg:py-16">
        <div className={landingTokens.hero.grid}>
          <div className={landingTokens.hero.copyColumn}>
            <HeroBadge icon={<Sparkles className="h-3.5 w-3.5" />}>
              Codenix | Plataforma de Práctica Algorítmica
            </HeroBadge>

            <HeroHeadline id="hero-title">
              Codenix | Plataforma de Práctica Algorítmica
            </HeroHeadline>

            <HeroDescription>
              Practica algoritmos, resuelve problemas y prepárate para competir.
              Codenix es una plataforma de práctica de programación competitiva
              para estudiantes y desarrolladores que quieren mejorar su
              razonamiento algorítmico. Puedes explorar problemas, escribir
              código, enviar soluciones y seguir tu avance por temas y dificultad.
            </HeroDescription>

            <HeroCTAs
              primaryLabel="Empezar a practicar"
              primaryTo="/login"
              secondaryLabel="Ver visión del proyecto"
              secondaryHref="#vision"
            />

            <TrustBadges items={heroStats} />
          </div>

          <ProductMockupCard />
        </div>
      </SectionContainer>
    </section>
  )
}
