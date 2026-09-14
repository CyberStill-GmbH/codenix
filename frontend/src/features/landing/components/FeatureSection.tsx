import { CanvasText } from '@/components/ui/canvas-text'
import FeaturesSectionDemo from '@/components/features-section-demo-3'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

export function FeatureSection() {
  return (
    <section className="relative z-10 overflow-hidden border-b border-[var(--color-border-soft)] bg-transparent py-20 sm:py-28" aria-labelledby="features-title">
      <SectionContainer>
        <div className="relative mx-auto max-w-5xl text-center">
          <LandingBadge>¿Qué es Codenix?</LandingBadge>
          <h2 id="features-title" className="mx-auto mt-7 max-w-5xl text-balance text-4xl font-black leading-[0.98] tracking-[-0.055em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
            Entrena algoritmos con una{' '}
            <CanvasText text="señal clara" backgroundClassName="bg-[var(--color-primary)]" colors={['rgba(255,255,255,1)', 'rgba(224,242,254,0.92)', 'rgba(186,230,253,0.82)']} lineGap={4} animationDuration={20} />{' '}
            de avance.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[var(--color-text-soft)] sm:text-lg">Problemas, editor y veredictos en un solo flujo para practicar sin perder el hilo.</p>
          <div className="pointer-events-none absolute -right-2 top-0 hidden w-24 rotate-[-4deg] sm:block lg:right-8">
            <img src="/ieee-logo.png" alt="IEEE Computer Society UNI" className="h-20 w-20 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.2)]" />
            <span className="-mt-1 block whitespace-nowrap font-[cursive] text-[0.68rem] font-semibold italic text-[#0b76b9]">¡Una iniciativa de IEEE CS UNI!</span>
          </div>
        </div>

        <FeaturesSectionDemo />
      </SectionContainer>
    </section>
  )
}
