import type { Submission } from '@/features/submissions/types/submission.types'

type TopicDistributionProps = {
  submissions: Submission[]
}

export function TopicDistribution({ submissions }: TopicDistributionProps) {
  const topicProblems = submissions.reduce<Record<string, Set<string | number>>>((counts, submission) => {
    if (submission.result !== 'accepted') return counts
    for (const topic of submission.topics) {
      counts[topic] ??= new Set()
      counts[topic].add(submission.problemId)
    }
    return counts
  }, {})

  const topics = Object.entries(topicProblems)
    .map(([topic, problemIds]) => [topic, problemIds.size] as const)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const max = Math.max(...topics.map(([, count]) => count), 1)

  if (topics.length === 0) return null

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Distribución por tema
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Temas más frecuentes en tu historial
        </p>
      </div>

      <div className="space-y-4">
        {topics.map(([topic, count]) => (
          <div key={topic}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--color-text-soft)]">{topic}</span>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-elevated)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)]"
                style={{ width: `${Math.max(12, Math.round((count / max) * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
