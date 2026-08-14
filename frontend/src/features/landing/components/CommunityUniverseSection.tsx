import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type CSSProperties, type SVGProps } from 'react'
import { motion } from 'framer-motion'

import { CommunityStars } from '@/features/landing/components/community/CommunityStars'

const CommunityGlobe = lazy(() => import('@/features/landing/components/community/CommunityGlobe'))

type SocialLink = { label: string; href: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }

const socialLinks: SocialLink[] = [
  { label: 'Discord', href: 'https://discord.com', Icon: DiscordIcon },
  { label: 'WhatsApp', href: 'https://whatsapp.com', Icon: WhatsAppIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

export function CommunityUniverseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.section ref={sectionRef} id="community" className="relative z-10 overflow-hidden border-b border-[var(--color-border-soft)] bg-[var(--color-auth-brand-bg)] py-24 text-white sm:py-32" aria-label="Canales de comunidad Codenix" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <CommunityStars active={active} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="relative z-20 max-w-xl">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">Comunidad</p>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">Únete a la comunidad que entrena contigo.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">Sigue novedades, retos y conversaciones de práctica competitiva desde los espacios donde IEEE CS UNI ya se mueve.</p>
        </div>
        <div className="relative mx-auto flex min-h-[32rem] w-full max-w-[38rem] items-center justify-center overflow-hidden rounded-[var(--radius-2xl)]">
          <Suspense fallback={<div className="h-[min(82vw,26rem)] w-full max-w-[26rem]" aria-hidden="true" />}>
            <CommunityGlobe active={active} />
          </Suspense>
          {socialLinks.map((link, index) => <OrbitLogo key={link.label} link={link} index={index} />)}
        </div>
      </div>
    </motion.section>
  )
}

function OrbitLogo({ link, index }: { link: SocialLink; index: number }) {
  const colors = ['#5865F2', '#25D366', '#0A66C2', '#FF0000']
  const radius = 148
  const angle = index * 90
  return (
    <div className="community-orbit absolute left-1/2 top-1/2 z-20" style={{ '--orbit-start': `${angle}deg`, '--orbit-duration': '34s', '--orbit-delay': '0s' } as CSSProperties}>
      <div style={{ transform: `translateX(${radius}px)` }}>
        <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.label} className="group relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-3 transition-transform duration-150 hover:scale-110" aria-label={`Abrir ${link.label}`}>
          <link.Icon className="h-8 w-8" style={{ color: colors[index] }} aria-hidden="true" />
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-[var(--radius-sm)] bg-white px-2 py-1 text-[0.625rem] font-semibold text-slate-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{link.label}</span>
        </a>
      </div>
    </div>
  )
}

function DiscordIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.251-.19.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" /></svg> }
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg> }
function LinkedInIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 .16.774.16 1.729v20.542C.16 23.2.792 24 1.771 24h20.451C23.2 24 24 23.2 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" /></svg> }
function YouTubeIcon(props: SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" /></svg> }
