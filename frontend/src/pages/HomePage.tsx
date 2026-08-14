import { NavbarSection } from '@/features/landing/components/NavbarSection'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeatureSection } from '@/features/landing/components/FeatureSection'
import { VisionSection } from '@/features/landing/components/VisionSection'
import { CommunityUniverseSection } from '@/features/landing/components/CommunityUniverseSection'
import { CtaSection } from '@/features/landing/components/CtaSection'
import { FooterSection } from '@/features/landing/components/FooterSection'
import { ProblemsSection } from '@/features/landing/components/ProblemsSection'

export function HomePage() {
  return (
    <div
      data-theme="dark"
      className="codenix-landing min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <NavbarSection />
      <HeroSection />
      <FeatureSection />
      <VisionSection />
      <ProblemsSection />
      <CommunityUniverseSection />
      <CtaSection />
      <FooterSection />
    </div>
  )
}
