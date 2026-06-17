import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { navItems } from '@/features/landing/constants/landingContent'
import type { NavItem } from '@/features/landing/types/landing.types'

const navLinkClassName =
  'flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

const mobileNavLinkClassName =
  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

const navBadgeClassName =
  'rounded-full border border-[rgba(245,158,11,0.16)] bg-[rgba(245,158,11,0.07)] px-2 py-0.5 text-[0.625rem] font-semibold text-[rgba(251,191,36,0.82)]'

const ctaClassName =
  'inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition duration-300 hover:border-[var(--color-primary)] hover:bg-[rgba(56,189,248,0.2)] hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

const mobileCtaClassName =
  'inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition duration-300 hover:border-[var(--color-primary)] hover:bg-[rgba(56,189,248,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

const getNavbarOffset = () => {
  const navbar = document.querySelector('[data-landing-navbar]')
  const navbarHeight = navbar?.getBoundingClientRect().height ?? 56

  return navbarHeight + 12
}

const scrollToSection = (href: string) => {
  const sectionId = href.replace('#', '')
  const section = document.getElementById(sectionId)

  if (!section) return

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const targetPosition = sectionTop - getNavbarOffset()

  window.scrollTo({
    top: Math.max(targetPosition, 0),
    behavior: 'smooth',
  })

  window.history.pushState(null, '', href)
}

export function NavbarSection() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleAnchorClick = (href: string) => {
    scrollToSection(href)
  }

  const handleMobileAnchorClick = (href: string) => {
    closeMenu()

    window.setTimeout(() => {
      scrollToSection(href)
    }, 120)
  }

  return (
    <header
      data-landing-navbar
      className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(7,11,20,0.82)] shadow-[0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl"
    >
      <nav
        className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)]"
          aria-label="Codenix — Inicio"
          onClick={closeMenu}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center">
            <img
              src={logo}
              alt=""
              className="h-full w-full object-contain"
            />
          </span>

          <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
            Codenix
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              onAnchorClick={handleAnchorClick}
            />
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className={ctaClassName}>
            Empezar
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[rgba(15,23,42,0.72)] text-[var(--color-text-muted)] transition-colors duration-200 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:hidden"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="landing-mobile-menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </nav>

      {isOpen && (
        <div
          id="landing-mobile-menu"
          className="border-t border-white/[0.07] bg-[rgba(7,11,20,0.96)] px-4 py-3 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-label="Menú de navegación"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <MobileNavLink
                key={item.label}
                item={item}
                onClick={closeMenu}
                onAnchorClick={handleMobileAnchorClick}
              />
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.07] pt-4">
              <Link
                to="/login"
                className={mobileCtaClassName}
                onClick={closeMenu}
              >
                Empezar
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({
  item,
  onAnchorClick,
}: {
  item: NavItem
  onAnchorClick: (href: string) => void
}) {
  const badge = item.badge ? (
    <span className={navBadgeClassName}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    return (
      <button
        type="button"
        className={navLinkClassName}
        onClick={() => onAnchorClick(item.href)}
      >
        <span>{item.label}</span>
        {badge}
      </button>
    )
  }

  return (
    <Link to={item.href} className={navLinkClassName}>
      <span>{item.label}</span>
      {badge}
    </Link>
  )
}

function MobileNavLink({
  item,
  onClick,
  onAnchorClick,
}: {
  item: NavItem
  onClick: () => void
  onAnchorClick: (href: string) => void
}) {
  const badge = item.badge ? (
    <span className={navBadgeClassName}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    return (
      <button
        type="button"
        className={mobileNavLinkClassName}
        onClick={() => onAnchorClick(item.href)}
      >
        <span>{item.label}</span>
        {badge}
      </button>
    )
  }

  return (
    <Link to={item.href} className={mobileNavLinkClassName} onClick={onClick}>
      <span>{item.label}</span>
      {badge}
    </Link>
  )
}