import { useState } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

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

type RankingTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: RankingDistributionPoint }>
  totalUsers: number
}

function RankingTooltip({ active, payload, totalUsers }: RankingTooltipProps) {
  if (!active || !payload?.length) return null

  const point = payload[0].payload
  const percentage = totalUsers > 0 ? (point.count / totalUsers) * 100 : 0

  return (
    <div className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-3 py-2 text-xs shadow-[var(--shadow-lg)]">
      <p className="font-semibold text-[var(--color-text)]">Nivel {point.bucket} resueltos</p>
      <p className="mt-1 text-[var(--color-text-muted)]">
        {point.count.toLocaleString()} usuarios · {percentage.toFixed(1)}% del total
      </p>
    </div>
  )
}

export function RankingCard({
  rank,
  percentile: _percentile,
  totalUsers,
  solvedProblems,
  distribution,
}: RankingCardProps) {
  const userBucket = getBucketForSolvedCount(distribution, solvedProblems)
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null)
  const topPercentage = totalUsers > 0 ? (rank / totalUsers) * 100 : 0
  const focusedBucket = hoveredBucket ?? userBucket
  const focusedPoint = distribution.find((point) => point.bucket === focusedBucket)
  const focusedPercentage = focusedPoint && totalUsers > 0
    ? (focusedPoint.count / totalUsers) * 100
    : 0

  return (
    <div className="flex h-full flex-col p-3.5">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Ranking global
      </p>
      <p className="mt-1.5 font-mono text-2xl font-bold leading-none text-[var(--color-accent)]">
        Top {topPercentage.toFixed(1)}%
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

      <div className="mt-3 min-h-[96px] flex-1" role="img" aria-label="Distribución de usuarios por problemas resueltos">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} barGap={2} onMouseLeave={() => setHoveredBucket(null)}>
            <Tooltip
              cursor={false}
              content={<RankingTooltip totalUsers={totalUsers} />}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} animationDuration={350}>
              {distribution.map((bar) => (
                <Cell
                  key={bar.bucket}
                  fill={bar.bucket === hoveredBucket || (!hoveredBucket && bar.bucket === userBucket)
                    ? 'var(--color-accent)'
                    : 'var(--color-border)'}
                  fillOpacity={hoveredBucket && bar.bucket !== hoveredBucket ? 0.55 : 1}
                  style={{ transition: 'fill 220ms ease, opacity 220ms ease' }}
                  onMouseEnter={() => setHoveredBucket(bar.bucket)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className={`${profilePillClassName} transition-colors duration-300`}>
          <span className={`h-2 w-2 rounded-sm transition-colors duration-300 ${hoveredBucket ? 'bg-[var(--color-border)]' : 'bg-[var(--color-accent)]'}`} />
          {hoveredBucket ? `Nivel ${hoveredBucket}` : 'Tu posición'}
        </span>
        <span className={`${profilePillClassName} transition-all duration-300`}>
          {focusedPoint
            ? `${focusedPoint.count.toLocaleString()} usuarios · ${focusedPercentage.toFixed(1)}%`
            : 'Sin datos de distribución'}
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
