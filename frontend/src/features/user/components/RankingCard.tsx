import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts'

import { profilePillClassName } from '@/features/user/components/profileStyles'

type RankingDistributionPoint = {
  bucket: string
  count: number
}

type RankingCardProps = {
  rank: number
  percentile: number
  totalUsers: number
  solvedProblems: number
  distribution: RankingDistributionPoint[]
}

export function RankingCard({
  rank,
  percentile,
  totalUsers,
  solvedProblems,
  distribution,
}: RankingCardProps) {
  const userBucket = getBucketForSolvedCount(distribution, solvedProblems)

  return (
    <div className="flex h-full flex-col p-3.5">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Ranking global
      </p>
      <p className="mt-1.5 font-mono text-2xl font-bold leading-none text-[var(--color-accent)]">
        Top {percentile.toFixed(2)}%
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
        <span className="font-mono font-bold text-[var(--color-text)]">
          #{rank.toLocaleString()}
        </span>{' '}
        de {totalUsers.toLocaleString()} usuarios
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
        por problemas resueltos
      </p>

      <div className="mt-3 min-h-[96px] flex-1" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} barGap={2}>
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {distribution.map((bar) => (
                <Cell
                  key={bar.bucket}
                  fill={
                    bar.bucket === userBucket
                      ? 'var(--color-accent)'
                      : 'var(--color-border)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className={profilePillClassName}>
          <span className="h-2 w-2 rounded-sm bg-[var(--color-text-subtle)]" />
          Distribucion
        </span>
        <span className={profilePillClassName}>
          <span className="h-2 w-2 rounded-sm bg-[var(--color-accent)]" />
          Tu posicion
        </span>
      </div>
    </div>
  )
}

function getBucketForSolvedCount(distribution: RankingDistributionPoint[], solvedCount: number) {
  return distribution.find((point) => {
    if (point.bucket === String(solvedCount)) return true

    const [min, max] = point.bucket.split('-').map(Number)
    return Number.isFinite(min) && Number.isFinite(max) && solvedCount >= min && solvedCount <= max
  })?.bucket
}
