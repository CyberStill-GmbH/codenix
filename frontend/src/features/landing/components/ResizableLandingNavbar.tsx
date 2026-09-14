import { useLocation } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  Navbar as ResizableNavbar,
  NavBody,
} from '@/components/ui/resizable-navbar'
import { navItems } from '@/features/landing/constants/landingContent'
import type { NavItem } from '@/features/landing/types/landing.types'
import { landingTokens } from '@/features/landing/theme/tokens'
import logo from '@/assets/icons/logo.png'
import { useEffect, useState } from 'react'

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ')

export function ResizableLandingNavbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    if (!isLandingPage) return

    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isLandingPage])

  const scrollToSection = (href: string) => {
    const section = document.getElementById(href.slice(1))
    if (!section) return
    const navbar = document.querySelector('[data-landing-navbar]')
    const offset = (navbar?.getBoundingClientRect().height ?? 56) + 12
    window.scrollTo({ top: Math.max(section.getBoundingClientRect().top + window.scrollY - offset, 0), behavior: 'smooth' })
    window.history.pushState(null, '', href)
    setActiveSection(href.slice(1))
    setIsOpen(false)
  }

  return (
    <header data-landing-navbar className="relative z-50 bg-[#050914]">
      <ResizableNavbar className="!top-0">
        <NavBody className="border border-transparent bg-[#050914]/90 px-4 py-2 shadow-none backdrop-blur-xl lg:px-6">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {navItems.map((item) => (
              <LandingNavItem key={item.label} item={item} active={activeSection === item.href.slice(1)} isLandingPage={isLandingPage} onAnchorClick={scrollToSection} />
            ))}
          </nav>
          <a href="/login" className={cx(landingTokens.nav.cta, landingTokens.focus, 'shrink-0')}>
            Empezar <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </NavBody>

        <MobileNav className="border border-transparent bg-[#050914]/90 px-4 shadow-none backdrop-blur-xl">
          <MobileNavHeader>
            <Brand />
            <button
              type="button"
              className={cx(landingTokens.nav.menuButton, landingTokens.focus)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="landing-mobile-menu"
              onClick={() => setIsOpen((value) => !value)}
            >
              {isOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)} className="border border-[var(--color-glass-border)] bg-[#050914]">
            {navItems.map((item) => (
              <LandingNavItem key={item.label} item={item} active={activeSection === item.href.slice(1)} isLandingPage={isLandingPage} onAnchorClick={scrollToSection} mobile />
            ))}
            <div className="mt-3 grid gap-2 border-t border-[var(--color-glass-border)] pt-4">
              <a href="/terms" onClick={() => setIsOpen(false)} className={cx(landingTokens.nav.mobileLink, landingTokens.focus)}>Términos de uso</a>
              <a href="/privacy" onClick={() => setIsOpen(false)} className={cx(landingTokens.nav.mobileLink, landingTokens.focus)}>Política de privacidad</a>
              <a href="/login" onClick={() => setIsOpen(false)} className={cx(landingTokens.nav.mobileCta, landingTokens.focus)}>Empezar <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </header>
  )
}

function Brand() {
  return (
    <a href="/" className={cx('relative z-20 flex shrink-0 items-center gap-3', landingTokens.focus)} aria-label="Codenix — Inicio">
      <span className={cx('h-7 w-7 shrink-0', landingTokens.color.logo)} style={{ mask: `url(${logo}) center / contain no-repeat`, WebkitMask: `url(${logo}) center / contain no-repeat` }} aria-hidden="true" />
      <span className="text-xl font-bold tracking-tight text-white">Codenix</span>
    </a>
  )
}

function LandingNavItem({ item, active, isLandingPage, onAnchorClick, mobile = false }: { item: NavItem; active: boolean; isLandingPage: boolean; onAnchorClick: (href: string) => void; mobile?: boolean }) {
  const className = cx(mobile ? landingTokens.nav.mobileLink : landingTokens.nav.link, active && landingTokens.nav.activeLink, landingTokens.focus)
  const content = <><span>{item.label}</span>{item.badge && <span className={landingTokens.nav.badge}>{item.badge}</span>}</>

  if (item.href.startsWith('#') && isLandingPage) {
    return <button type="button" className={className} aria-current={active ? 'location' : undefined} onClick={() => onAnchorClick(item.href)}>{content}</button>
  }

  return <a href={item.href.startsWith('#') ? `/${item.href}` : item.href} className={className} aria-current={active ? 'location' : undefined}>{content}</a>
}
