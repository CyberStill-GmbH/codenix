import { useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { mockUser } from '@/features/user/constants/userMockData'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserMenu } from '@/features/user/components/UserMenu'
import { landingTokens } from '@/features/landing/theme/tokens'

const appNavItems = [
  { label: 'Problems', href: '/problems' },
  { label: 'Submissions', href: '/submissions' },
  { label: 'Profile', href: '/profile' },
]

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(' ')

// AppNavbar belongs to authenticated internal routes only.
// Keep it separate from the public landing NavbarSection.
export function AppNavbar() {
  const location = useLocation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)

  const activePath = useMemo(() => {
    const currentPath = location.pathname
    return appNavItems.find((item) => currentPath.startsWith(item.href))?.href
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-soft)] bg-[var(--color-navbar-bg)] shadow-[var(--shadow-navbar)] backdrop-blur-xl">
      <nav
        className="codenix-app-shell flex h-16 items-center justify-between gap-6 px-6"
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
          <div className="hidden min-w-0 w-[22rem] lg:block">
            <label className="relative block">
              <span className="sr-only">Buscar problemas</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-auth-icon)]"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search problems"
                // TODO: API - GET /api/problems/search?q=
                className="h-11 w-full rounded-full border border-slate-700/60 bg-slate-950/70 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-auth-placeholder)] transition duration-200 hover:border-slate-600/80 focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-auth-focus)]"
              />
            </label>
          </div>

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
              <UserAvatar src={mockUser.avatarUrl} name={mockUser.name} size="sm" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-12"
                role="menu"
                aria-label="Menu de usuario"
              >
                <UserMenu
                  user={mockUser}
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
