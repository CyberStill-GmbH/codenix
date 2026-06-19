import { BookOpen, Brain } from 'lucide-react'

import { DifficultySelector } from '@/features/problems/components/DifficultySelector'
import { ProblemTable } from '@/features/problems/components/ProblemTable'
import { SearchBar } from '@/features/problems/components/SearchBar'
import { SortSelector } from '@/features/problems/components/SortSelector'
import { StatusSelector } from '@/features/problems/components/StatusSelector'
import { TopicFilters } from '@/features/problems/components/TopicFilters'
import type {
  Difficulty,
  Problem,
  ProblemSort,
  ProblemStatusFilter,
} from '@/features/problems/types/problem.types'
import { t } from '@/features/problems/utils/problemsI18n'

type ProblemsViewProps = {
  problems: Problem[]
  allProblems: Problem[]
  topics: string[]
  query: string
  selectedTopic: string
  difficulty: Difficulty | 'All'
  status: ProblemStatusFilter
  sort: ProblemSort
  isLoading: boolean
  error: string
  onSearch: (query: string) => void
  onTopicChange: (topic: string) => void
  onDifficultyChange: (difficulty: Difficulty | 'All') => void
  onStatusChange: (status: ProblemStatusFilter) => void
  onSortChange: (sort: ProblemSort) => void
}

export function ProblemsView({
  problems,
  allProblems,
  topics,
  query,
  selectedTopic,
  difficulty,
  status,
  sort,
  isLoading,
  error,
  onSearch,
  onTopicChange,
  onDifficultyChange,
  onStatusChange,
  onSortChange,
}: ProblemsViewProps) {
  const solvedCount = allProblems.filter((problem) => problem.solved).length
  const totalCount = allProblems.length
  const mediumAndHard = allProblems.filter((problem) => problem.difficulty !== 'Easy').length

  const cards = [
    {
      title: t('hero.practiceTitle'),
      description: t('hero.practiceDescription', { total: totalCount }),
      Icon: Brain,
    },
    {
      title: t('hero.progressTitle'),
      imageSrc: '/contests-upcoming.webp',
      imageAlt: 'Proximo concurso',
    },
    {
      title: t('hero.preparationTitle'),
      description: t('hero.preparationDescription', { count: mediumAndHard }),
      Icon: BookOpen,
    },
  ]

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de problemas">
        {cards.map(({ title, description, Icon, imageSrc, imageAlt }) => (
          <article
            key={title}
            className={`overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.22)] ${
              imageSrc ? 'relative min-h-[12.5rem]' : 'min-h-[12.5rem] p-5'
            }`}
          >
            {imageSrc ? (
              <>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="absolute inset-0 h-full w-full object-fill"
                />
                <div className="invisible p-5" aria-hidden="true">
                  <div className="h-10 w-10" />
                  <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>
                  <p className="mt-2 text-sm">Proximo concurso disponible</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/70 text-[var(--color-accent)]">
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-[var(--color-text)]">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
              </>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
        <TopicFilters topics={topics} selected={selectedTopic} onSelect={onTopicChange} />

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={query} onSearch={onSearch} />
          <div className="flex flex-wrap items-center gap-2">
            <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
            <StatusSelector value={status} onChange={onStatusChange} />
            <SortSelector value={sort} onChange={onSortChange} />
          </div>
        </div>

        {totalCount > 0 && (
          <div className="mt-4 flex items-center justify-end gap-2 text-sm text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full border border-emerald-300/40 bg-emerald-400/20" />
            <span>{t('status.solvedCount', { solved: solvedCount, total: totalCount })}</span>
          </div>
        )}
      </section>

      {isLoading && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-400">
          {t('feedback.loading')}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)]">
          {error}
        </div>
      )}
      <ProblemTable problems={problems} />
    </div>
  )
}
