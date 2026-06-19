import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List, Shuffle } from 'lucide-react'

import logo from '@/assets/icons/logo.png'
import type { Problem } from '@/features/problems/types/problem.types'

type ProblemNavigatorProps = {
  previousProblem?: Problem
  nextProblem?: Problem
  canNavigateRandom: boolean
  onNavigateToProblem: (slug: string) => void
  onNavigateToRandomProblem: () => void
}

function IconButton({
  label,
  title,
  disabled,
  children,
  onClick,
  hideOnMobile = false,
}: {
  label: string
  title: string
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  hideOnMobile?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-slate-950/50 text-[var(--color-text-muted)] transition hover:bg-slate-900/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-950/50 disabled:hover:text-[var(--color-text-muted)] ${
        hideOnMobile ? 'hidden md:inline-flex' : ''
      }`}
    >
      {children}
    </button>
  )
}

export function ProblemNavigator({
  previousProblem,
  nextProblem,
  canNavigateRandom,
  onNavigateToProblem,
  onNavigateToRandomProblem,
}: ProblemNavigatorProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.altKey) return

      if (event.key === 'ArrowLeft' && previousProblem) {
        event.preventDefault()
        onNavigateToProblem(previousProblem.slug)
      }

      if (event.key === 'ArrowRight' && nextProblem) {
        event.preventDefault()
        onNavigateToProblem(nextProblem.slug)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextProblem, onNavigateToProblem, previousProblem])

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Link
        to="/problems"
        aria-label="Volver a problemas"
        title="Volver a problemas"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition hover:bg-slate-900/80"
      >
        <span
          className="h-6 w-6 bg-[var(--color-logo-mark)]"
          style={{
            mask: `url(${logo}) center / contain no-repeat`,
            WebkitMask: `url(${logo}) center / contain no-repeat`,
          }}
          aria-hidden="true"
        />
      </Link>

      <span className="hidden h-6 w-px bg-[var(--color-border-soft)] md:block" />

      {/* TODO: MVP-PENDING - lista de problemas */}
      <IconButton
        label="Lista de problemas"
        title="Próximamente"
        disabled
        hideOnMobile
      >
        <List className="h-3.5 w-3.5" aria-hidden="true" />
      </IconButton>

      <div className="flex items-center gap-1">
        <IconButton
          label="Problema anterior"
          title={previousProblem ? previousProblem.title : 'No hay problema anterior'}
          disabled={!previousProblem}
          onClick={() => previousProblem && onNavigateToProblem(previousProblem.slug)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </IconButton>
        <IconButton
          label="Problema siguiente"
          title={nextProblem ? nextProblem.title : 'No hay problema siguiente'}
          disabled={!nextProblem}
          onClick={() => nextProblem && onNavigateToProblem(nextProblem.slug)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>

      <IconButton
        label="Problema aleatorio"
        title={canNavigateRandom ? 'Problema aleatorio' : 'Próximamente'}
        disabled={!canNavigateRandom}
        hideOnMobile
        onClick={onNavigateToRandomProblem}
      >
        <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
      </IconButton>
    </div>
  )
}
