import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'

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

const legalNavItems = [
  { label: 'Términos de uso', href: '/terms' },
  { label: 'Política de privacidad', href: '/privacy' },
] as const

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

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
          <img
            src="/favicon.svg"
            className={cx('h-7 w-7 shrink-0', landingTokens.color.logo)}
            alt=""
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
              isLandingPage={location.pathname === '/'}
              onAnchorClick={handleAnchorClick}
            />
          ))}
          <LegalNavDropdown currentPath={location.pathname} />
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
                isLandingPage={location.pathname === '/'}
                onClick={closeMenu}
                onAnchorClick={handleMobileAnchorClick}
              />
            ))}
            <MobileLegalNavDropdown
              currentPath={location.pathname}
              onNavigate={closeMenu}
            />

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

function LegalNavDropdown({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const closeTimerRef = useRef<number | null>(null)
  const legalId = 'landing-legal-menu'
  const isCurrent = legalNavItems.some((item) => item.href === currentPath)

  const clearCloseTimer = () => {
    if (closeTimerRef.current === null) return

    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }

  const openMenu = () => {
    clearCloseTimer()
    setIsOpen(true)
  }

  const closeMenu = () => {
    clearCloseTimer()
    setIsOpen(false)
  }

  const scheduleCloseMenu = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
      closeTimerRef.current = null
    }, 220)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleDocumentPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [])

  const focusMenuItem = (index: number) => {
    itemRefs.current[index]?.focus()
  }

  const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      closeMenu()
      rootRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu()
      window.setTimeout(() => focusMenuItem(0), 0)
    }
  }

  const handleItemKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const nextIndex =
        (index + direction + legalNavItems.length) % legalNavItems.length
      focusMenuItem(nextIndex)
    }
  }

  return (
    <div
      ref={rootRef}
      className="legal-nav"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleCloseMenu}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeMenu()
        }
      }}
      onKeyDown={handleRootKeyDown}
    >
      <button
        type="button"
        className={cx(
          'legal-nav__trigger',
          isOpen && 'legal-nav__trigger--open',
          isCurrent && 'legal-nav__trigger--current',
          landingTokens.focus,
        )}
        aria-expanded={isOpen}
        aria-controls={legalId}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>Información legal</span>
        <ChevronDown className="legal-nav__chevron" aria-hidden="true" />
      </button>

      <div
        id={legalId}
        className={cx('legal-nav__menu', isOpen && 'legal-nav__menu--open')}
        role="menu"
        aria-label="Información legal"
      >
        {legalNavItems.map((item, index) => {
          const isSelected = item.href === currentPath

          return (
            <Link
              key={item.href}
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              to={item.href}
              className={cx(
                'legal-nav__item',
                isSelected && 'legal-nav__item--selected',
              )}
              role="menuitem"
              aria-current={isSelected ? 'page' : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={closeMenu}
              onKeyDown={(event) => handleItemKeyDown(event, index)}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function MobileLegalNavDropdown({
  currentPath,
  onNavigate,
}: {
  currentPath: string
  onNavigate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const isCurrent = legalNavItems.some((item) => item.href === currentPath)

  return (
    <div className="mobile-legal-nav">
      <button
        type="button"
        className={cx(
          'mobile-legal-nav__trigger',
          isOpen && 'mobile-legal-nav__trigger--open',
          isCurrent && 'mobile-legal-nav__trigger--current',
          landingTokens.focus,
        )}
        aria-expanded={isOpen}
        aria-controls="landing-mobile-legal-menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>Información legal</span>
        <ChevronDown className="mobile-legal-nav__chevron" aria-hidden="true" />
      </button>

      <div
        id="landing-mobile-legal-menu"
        className={cx(
          'mobile-legal-nav__menu',
          isOpen && 'mobile-legal-nav__menu--open',
        )}
      >
        {legalNavItems.map((item) => {
          const isSelected = item.href === currentPath

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cx(
                'mobile-legal-nav__item',
                isSelected && 'mobile-legal-nav__item--selected',
                landingTokens.focus,
              )}
              aria-current={isSelected ? 'page' : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function NavLink({
  item,
  isLandingPage,
  onAnchorClick,
}: {
  item: NavItem
  isLandingPage: boolean
  onAnchorClick: (href: string) => void
}) {
  const badge = item.badge ? (
    <span className={landingTokens.nav.badge}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    if (!isLandingPage) {
      return (
        <Link
          to={`/${item.href}`}
          className={cx(landingTokens.nav.link, landingTokens.focus)}
        >
          <span>{item.label}</span>
          {badge}
        </Link>
      )
    }

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
  isLandingPage,
  onClick,
  onAnchorClick,
}: {
  item: NavItem
  isLandingPage: boolean
  onClick: () => void
  onAnchorClick: (href: string) => void
}) {
  const badge = item.badge ? (
    <span className={landingTokens.nav.badge}>{item.badge}</span>
  ) : null

  if (item.href.startsWith('#')) {
    if (!isLandingPage) {
      return (
        <Link
          to={`/${item.href}`}
          className={cx(landingTokens.nav.mobileLink, landingTokens.focus)}
          onClick={onClick}
        >
          <span>{item.label}</span>
          {badge}
        </Link>
      )
    }

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
