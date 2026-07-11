import { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ClipboardList, FilePenLine, LayoutDashboard, Plus, ShieldCheck } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { landingTokens } from '@/features/landing/theme/tokens'
import { cn } from '@/shared/lib/utils'
import { rememberAdminPath } from '@/shared/utils/adminConsolePath'
import { preloadRoute, type PreloadRouteKey } from '@/routes/routePreload'

const adminNavItems = [
  {
    label: 'Problems',
    href: '/admin/problems',
    icon: LayoutDashboard,
    preload: 'adminProblems',
    match: (pathname: string) => pathname === '/admin' || pathname === '/admin/problems',
  },
  {
    label: 'Create',
    href: '/admin/problems/new',
    icon: Plus,
    preload: 'adminProblemForm',
    match: (pathname: string) => pathname === '/admin/problems/new',
  },
] satisfies Array<{
  label: string
  href: string
  icon: typeof LayoutDashboard
  preload: PreloadRouteKey
  match: (pathname: string) => boolean
}>

const preloadProblemsRoute = () => preloadRoute('problems')

export function AdminNavbar() {
  const location = useLocation()

  useEffect(() => {
    rememberAdminPath(location.pathname)
  }, [location.pathname])

  const contextualProblemId = useMemo(() => {
    const match = location.pathname.match(/^\/admin\/problems\/([^/]+)\/(edit|testcases)$/)
    return match?.[1] ?? null
  }, [location.pathname])

  const contextualNavItems = contextualProblemId
    ? [
        {
          label: 'Edit',
          href: `/admin/problems/${contextualProblemId}/edit`,
          icon: FilePenLine,
          preload: 'adminProblemForm' as const,
          match: (pathname: string) => pathname.endsWith('/edit'),
        },
        {
          label: 'Testcases',
          href: `/admin/problems/${contextualProblemId}/testcases`,
          icon: ClipboardList,
          preload: 'adminProblemTestcases' as const,
          match: (pathname: string) => pathname.endsWith('/testcases'),
        },
      ]
    : []

  const navItems = [...adminNavItems, ...contextualNavItems]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-soft)] bg-[var(--color-navbar-bg)] shadow-[var(--shadow-navbar)] backdrop-blur-xl">
      <nav
        className="codenix-app-shell flex min-h-16 flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between"
        aria-label="Navegacion de administracion de Codenix"
      >
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Link
            to="/admin/problems"
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-[var(--radius-md)]',
              landingTokens.focus,
            )}
            aria-label="Codenix admin"
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
            <span className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-accent-muted)]">
              Admin
            </span>
          </Link>

          <Link
            to="/problems"
            onMouseEnter={preloadProblemsRoute}
            onFocus={preloadProblemsRoute}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-3 text-xs font-semibold text-[var(--color-text-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:hidden"
          >
            Preview
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.match(location.pathname)

            return (
              <Link
                key={item.href}
                to={item.href}
                onMouseEnter={() => preloadRoute(item.preload)}
                onFocus={() => preloadRoute(item.preload)}
                className={cn(
                  'inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition duration-200',
                  isActive
                    ? 'border-sky-400/45 bg-sky-400/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'border-slate-700/50 bg-slate-950/40 text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:border-sky-400/45 hover:bg-slate-800/70 hover:text-white',
                  landingTokens.focus,
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}

          <span className="hidden h-6 w-px bg-slate-800 md:block" aria-hidden="true" />

          <Link
            to="/problems"
            onMouseEnter={preloadProblemsRoute}
            onFocus={preloadProblemsRoute}
            className="hidden h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-950/50 px-3 text-sm font-semibold text-[var(--color-text-soft)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Preview user app
          </Link>
        </div>
      </nav>
    </header>
  )
}
