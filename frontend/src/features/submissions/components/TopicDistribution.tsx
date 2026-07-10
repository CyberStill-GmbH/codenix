import type { Submission } from '@/features/submissions/types/submission.types'

type TopicDistributionProps = {
  submissions: Submission[]
}

export function TopicDistribution({ submissions }: TopicDistributionProps) {
  const topicCounts = submissions.reduce<Record<string, number>>((counts, submission) => {
    for (const topic of submission.topics) {
      counts[topic] = (counts[topic] ?? 0) + 1
    }
    return counts
  }, {})

  const topics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const max = Math.max(...topics.map(([, count]) => count), 1)

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
          Topic Distribution
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Temas mas frecuentes en tu historial
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
