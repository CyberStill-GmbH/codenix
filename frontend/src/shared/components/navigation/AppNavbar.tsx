import { useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { useAuth } from '@/features/auth/context/useAuth'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserMenu } from '@/features/user/components/UserMenu'
import { landingTokens } from '@/features/landing/theme/tokens'
import { getLastAdminPath } from '@/shared/utils/adminConsolePath'
import { preloadRoute, type PreloadRouteKey } from '@/routes/routePreload'
import { ProblemSearchBox } from '@/shared/components/navigation/ProblemSearchBox'

const appNavItems = [
  { label: 'Problemas', href: '/problems', preload: 'problems' },
  { label: 'Envios', href: '/submissions', preload: 'submissions' },
  { label: 'Perfil', href: '/profile', preload: 'profile' },
] satisfies Array<{ label: string; href: string; preload: PreloadRouteKey }>

const preloadAdminRoute = () => preloadRoute('adminProblems')

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

// AppNavbar belongs to authenticated internal routes only.
// Keep it separate from the public landing NavbarSection.
export function AppNavbar() {
  const location = useLocation()
  const { user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)
  const adminHref = getLastAdminPath()

  const activePath = useMemo(() => {
    const currentPath = location.pathname
    return appNavItems.find((item) => currentPath.startsWith(item.href))?.href
  }, [location.pathname])
  const isProfileRoute = location.pathname.startsWith('/profile')

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-navbar-bg)] shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <nav
        className={cx(
          'mx-auto flex h-[50px] w-full items-center justify-between gap-6 px-6',
          isProfileRoute
            ? 'md:max-w-[888px] lg:max-w-screen-xl'
            : 'max-w-[90rem]',
        )}
        aria-label="Navegacion interna de Codenix"
      >
        <div className="flex min-w-0 items-center gap-8">
          <Link
            to="/problems"
            className={cx(
              'flex shrink-0 items-center gap-2.5 rounded-[var(--radius-md)]',
              landingTokens.focus,
            )}
            aria-label="Codenix app"
          >
            <span
              className="h-8 w-8 shrink-0 bg-[var(--color-logo-mark)]"
              style={{
                mask: `url(${logo}) center / contain no-repeat`,
                WebkitMask: `url(${logo}) center / contain no-repeat`,
              }}
              aria-hidden="true"
            />
            <span className="font-display text-lg font-bold tracking-normal text-[var(--color-text)]">
              Codenix
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {appNavItems.map((item) => {
              const isActive = activePath === item.href

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onMouseEnter={() => preloadRoute(item.preload)}
                  onFocus={() => preloadRoute(item.preload)}
                  className={cx(
                    'relative rounded-[var(--radius-lg)] px-1 py-2 text-sm font-semibold tracking-normal transition duration-200',
                    isActive
                      ? 'text-[var(--color-text)] after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                    landingTokens.focus,
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {user?.role === 'admin' && (
            <Link
              to={adminHref}
              onMouseEnter={preloadAdminRoute}
              onFocus={preloadAdminRoute}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] px-2.5 text-xs font-semibold text-[var(--color-accent-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Administrar
            </Link>
          )}

          <ProblemSearchBox />

          <div className="relative">
            <button
              ref={userMenuButtonRef}
              type="button"
              className={cx(
                'rounded-full border border-slate-700/50 bg-slate-950/50 p-0.5 transition duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]',
                landingTokens.focus,
              )}
              aria-label="Abrir menu de usuario"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((current) => !current)}
            >
              <UserAvatar src={user?.avatarUrl} name={user?.name ?? 'Usuario'} size="sm" />
            </button>

            {isUserMenuOpen && user && (
              <div
                className="absolute right-0 top-12"
                role="menu"
                aria-label="Menu de usuario"
              >
                <UserMenu
                  user={user}
                  onClose={() => setIsUserMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
