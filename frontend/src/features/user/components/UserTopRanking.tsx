import { RankingCard } from '@/features/user/components/RankingCard'
import type { UserStats } from '@/features/user/types/user.types'

type UserTopRankingProps = {
  stats: UserStats
}

export function UserTopRanking({ stats }: UserTopRankingProps) {
  return (
    <RankingCard
      rank={stats.rank}
      percentile={stats.percentile}
      totalUsers={stats.totalUsers}
      solvedProblems={stats.solvedProblems}
      distribution={stats.distribution}
    />
  )
}
