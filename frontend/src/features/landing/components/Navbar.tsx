import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Menu, X } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { navItems } from '@/features/landing/constants/landingContent'
import type { NavItem } from '@/features/landing/types/landing.types'
import { landingTokens } from '@/features/landing/theme/tokens'

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

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

export function Navbar() {
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
    <header data-landing-navbar className={landingTokens.nav.shell}>
      <nav className={landingTokens.nav.inner} aria-label="Navegación principal">
        <Link
          to="/"
          className={cx(
            'flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80',
            landingTokens.focus,
          )}
          aria-label="Codenix — Inicio"
          onClick={closeMenu}
        >
          <span
            className={cx('h-7 w-7 shrink-0', landingTokens.color.logo)}
            style={{
              mask: `url(${logo}) center / contain no-repeat`,
              WebkitMask: `url(${logo}) center / contain no-repeat`,
            }}
            aria-hidden="true"
          />

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
          <Link to="/login" className={cx(landingTokens.nav.cta, landingTokens.focus)}>
            Empezar
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className={cx(landingTokens.nav.menuButton, landingTokens.focus)}
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
          className={landingTokens.nav.mobileMenu}
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

            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-glass-border)] pt-4">
              <Link
                to="/login"
                className={cx(landingTokens.nav.mobileCta, landingTokens.focus)}
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
    <span className={landingTokens.nav.badge}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    return (
      <button
        type="button"
        className={cx(landingTokens.nav.link, landingTokens.focus)}
        onClick={() => onAnchorClick(item.href)}
      >
        <span>{item.label}</span>
        {badge}
      </button>
    )
  }

  return (
    <Link to={item.href} className={cx(landingTokens.nav.link, landingTokens.focus)}>
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
    <span className={landingTokens.nav.badge}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    return (
      <button
        type="button"
        className={cx(landingTokens.nav.mobileLink, landingTokens.focus)}
        onClick={() => onAnchorClick(item.href)}
      >
        <span>{item.label}</span>
        {badge}
      </button>
    )
  }

  return (
    <Link
      to={item.href}
      className={cx(landingTokens.nav.mobileLink, landingTokens.focus)}
      onClick={onClick}
    >
      <span>{item.label}</span>
      {badge}
    </Link>
  )
}
