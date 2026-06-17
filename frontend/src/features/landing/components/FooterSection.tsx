import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Code2, GitBranch, Sparkles } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import { footerGroups } from '@/features/landing/constants/landingContent'
import type { FooterLink } from '@/features/landing/types/landing.types'

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">

          {/* ── Identidad de marca ── */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md outline-none transition-opacity duration-200 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              aria-label="Codenix — Inicio"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-sm font-bold tracking-tight text-[var(--color-text)]">
                Codenix
              </span>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Plataforma de IEEE Computer Society UNI para centralizar la
              práctica de algoritmos, el progreso técnico y la preparación para
              competencias de programación.
            </p>

            {/* Badges institucionales (máx. 2) */}
            <div className="mt-5 flex flex-wrap gap-2">
              <FooterBadge
                icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
                text="IEEE CS UNI"
              />
              <FooterBadge
                icon={<Code2 className="h-3.5 w-3.5" aria-hidden="true" />}
                text="Práctica algorítmica"
              />
            </div>
          </div>

          {/* ── Grupos de enlaces ── */}
          <div className="grid gap-6 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                {/*
                  Usamos <p> con role="heading" para evitar que el global
                  h3 { font-size: clamp(...) } agrande estos títulos de footer.
                  Mantenemos semántica de encabezado sin depender del cascade.
                */}
                <p
                  role="heading"
                  aria-level={3}
                  className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]"
                >
                  {group.title}
                </p>

                <ul className="mt-3 space-y-2.5" role="list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Barra inferior ── */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border-soft)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-text-subtle)]">
            © {currentYear} Codenix — IEEE Computer Society UNI.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
            <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Construido como plataforma propia de práctica.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Subcomponentes internos ───────────────────────

function FooterBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-2.5 py-1 text-[0.6875rem] font-medium text-[var(--color-text-muted)]">
      <span className="text-[var(--color-primary)]">{icon}</span>
      {text}
    </span>
  )
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    'inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-primary)]'

  const badge = link.badge ? (
    <span className="rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[0.5625rem] font-medium text-[var(--color-text-subtle)]">
      {link.badge}
    </span>
  ) : null

  if (link.href.startsWith('#')) {
    return (
      <a href={link.href} className={className}>
        {link.label}
        {badge}
      </a>
    )
  }

  return (
    <Link to={link.href} className={className}>
      {link.label}
      {badge}
    </Link>
  )
}