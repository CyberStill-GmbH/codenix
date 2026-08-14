import { SectionContainer } from '@/features/landing/components/common/SectionContainer'
import { HeroBadge } from '@/features/landing/components/hero/HeroBadge'
import { HeroCTAs } from '@/features/landing/components/hero/HeroCTAs'
import { HeroDescription } from '@/features/landing/components/hero/HeroDescription'
import { HeroHeadline } from '@/features/landing/components/hero/HeroHeadline'
import { ProductMockupCard } from '@/features/landing/components/hero/ProductMockupCard'
import { HeroFogCanvas } from '@/features/landing/components/hero/HeroFogCanvas'
import { landingTokens } from '@/features/landing/theme/tokens'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className={landingTokens.hero.section}
      aria-labelledby="hero-title"
    >
      <HeroFogCanvas />
      <SectionContainer className="relative py-12 sm:py-16 lg:py-24">
        <div className={landingTokens.hero.grid}>
          <div className={landingTokens.hero.copyColumn}>
            <HeroBadge>Iniciativa de IEEE Computer Society UNI</HeroBadge>

            <HeroHeadline id="hero-title">
              Practica algoritmos. Mejora con evidencia.
            </HeroHeadline>

            <HeroDescription>
              Problemas reales, editor integrado y veredictos claros para entrenar mejor.
            </HeroDescription>

            <HeroCTAs
              primaryLabel="Empezar a practicar"
              primaryTo="/login"
              secondaryLabel="Explorar problemas"
              secondaryHref="#problems"
            />
          </div>

          <ProductMockupCard />
        </div>
      </SectionContainer>
    </section>
  )
}
