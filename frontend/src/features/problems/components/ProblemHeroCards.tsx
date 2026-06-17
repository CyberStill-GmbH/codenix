import { BookOpen, Brain, Trophy } from 'lucide-react'

import type { Problem } from '@/features/problems/types/problem.types'

type ProblemHeroCardsProps = {
  problems: Problem[]
}

export function ProblemHeroCards({ problems }: ProblemHeroCardsProps) {
  const solved = problems.filter((problem) => problem.solved).length
  const total = problems.length
  const mediumAndHard = problems.filter((problem) => problem.difficulty !== 'Easy').length

  const cards = [
    {
      title: 'Practica algoritmos',
      description: `${total} problemas DSA curados para V1.`,
      Icon: Brain,
    },
    {
      title: 'Progreso real',
      description: `${solved}/${total} problemas resueltos.`,
      Icon: Trophy,
    },
    {
      title: 'Preparacion CP',
      description: `${mediumAndHard} retos Medium/Hard disponibles.`,
      Icon: BookOpen,
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de problemas">
      {cards.map(({ title, description, Icon }) => (
        <article
          key={title}
          className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/70 text-[var(--color-accent)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-[var(--color-text)]">
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        </article>
      ))}
    </section>
  )
}
