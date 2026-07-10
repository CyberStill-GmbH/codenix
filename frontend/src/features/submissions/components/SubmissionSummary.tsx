import type { Submission } from '@/features/submissions/types/submission.types'

type SubmissionSummaryProps = {
  submissions: Submission[]
}

export function SubmissionSummary({ submissions }: SubmissionSummaryProps) {
  const accepted = submissions.filter((submission) => submission.result === 'Accepted')
  const solvedIds = new Set(accepted.map((submission) => submission.problemId))
  const solvedByDifficulty = {
    Easy: new Set(accepted.filter((item) => item.difficulty === 'Easy').map((item) => item.problemId)).size,
    Medium: new Set(accepted.filter((item) => item.difficulty === 'Medium').map((item) => item.problemId)).size,
    Hard: new Set(accepted.filter((item) => item.difficulty === 'Hard').map((item) => item.problemId)).size,
  }
  const totalAttempts = submissions.reduce((total, submission) => total + submission.submissionsCount, 0)
  const acceptance = submissions.length > 0 ? (accepted.length / submissions.length) * 100 : 0

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-lg)]">
      <p className="text-sm font-semibold text-[var(--color-text-muted)]">Total Solved</p>
      <div className="mt-4 flex items-end gap-2">
        <span className="font-mono text-4xl font-bold leading-none text-[var(--color-primary-hover)]">
          {solvedIds.size}
        </span>
        <span className="text-sm text-[var(--color-text-muted)]">Problems</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-[var(--color-surface-elevated)] px-3 py-2">
          <span className="text-xs font-semibold text-[var(--color-difficulty-easy)]">Easy</span>
          <p className="font-mono text-lg font-semibold text-[var(--color-text)]">{solvedByDifficulty.Easy}</p>
        </div>
        <div className="rounded-lg bg-[var(--color-surface-elevated)] px-3 py-2">
          <span className="text-xs font-semibold text-[var(--color-difficulty-medium)]">Med.</span>
          <p className="font-mono text-lg font-semibold text-[var(--color-text)]">{solvedByDifficulty.Medium}</p>
        </div>
        <div className="rounded-lg bg-[var(--color-surface-elevated)] px-3 py-2">
          <span className="text-xs font-semibold text-[var(--color-difficulty-hard)]">Hard</span>
          <p className="font-mono text-lg font-semibold text-[var(--color-text)]">{solvedByDifficulty.Hard}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Submissions</p>
          <p className="mt-3 font-mono text-3xl font-bold text-violet-400">{totalAttempts}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Acceptance</p>
          <p className="mt-3 font-mono text-3xl font-bold text-[var(--color-success)]">
            {acceptance.toFixed(1)}%
          </p>
        </div>
      </div>
    </section>
  )
}
