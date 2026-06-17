import { NavbarSection } from '@/features/landing/components/NavbarSection'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeatureSection } from '@/features/landing/components/FeatureSection'
import { VisionSection } from '@/features/landing/components/VisionSection'
import { CommunitySection } from '@/features/landing/components/CommunitySection'
import { CtaSection } from '@/features/landing/components/CtaSection'
import { FooterSection } from '@/features/landing/components/FooterSection'
import { ProblemsSection } from '@/features/landing/components/ProblemsSection'

export function HomePage() {
    return (
        <>
            <NavbarSection />
            <HeroSection />
            <FeatureSection />
            <VisionSection />
            <ProblemsSection />
            <CommunitySection />
            <CtaSection />
            <FooterSection />
        </>
    )
}