import { AppNavbar } from '@/shared/components/navigation/AppNavbar'
import { UserProfileCard } from '@/features/user/components/UserProfileCard'
import { UserProgressPanel } from '@/features/user/components/UserProgressPanel'
import { UserTopRanking } from '@/features/user/components/UserTopRanking'
import { ActivityHeatmap } from '@/features/user/components/ActivityHeatmap/ActivityHeatmap'
import { UserRecentSubmissions } from '@/features/user/components/UserRecentSubmissions'
import { UserCard } from '@/features/user/components/UserCard'
// TODO: API - Reemplazar userMockData por la respuesta real de:
// GET /api/users/me
// GET /api/users/me/stats
// GET /api/users/me/progress
// GET /api/submissions?userId={id}
// cuando el backend este listo, idealmente usando un hook useUserProfile() que centralice estas llamadas
import {
  mockDifficultyProgress,
  mockRecentSubmissions,
  mockUserStats,
  mockUser,
} from '@/features/user/constants/userMockData'

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main className="codenix-app-shell codenix-user-main">
        <div className="codenix-user-grid">
          <div className="codenix-user-stack">
            <UserProfileCard user={mockUser} submissions={mockRecentSubmissions} />
          </div>
          <div className="codenix-user-stack">
            {/* Fused stats card: Progress + Top Ranking, separated by a vertical divider */}
            <UserCard as="section" className="[&>div]:flex [&>div]:flex-col sm:[&>div]:flex-row">
              <UserProgressPanel progress={mockDifficultyProgress} stats={mockUserStats} />
              <div className="hidden w-px self-stretch bg-[rgba(255,255,255,0.06)] sm:block" />
              <div className="h-px w-full self-stretch bg-[rgba(255,255,255,0.06)] sm:hidden" />
              <UserTopRanking />
            </UserCard>
            <ActivityHeatmap />
            <UserRecentSubmissions submissions={mockRecentSubmissions} />
          </div>
        </div>
      </main>
    </div>
  )
}
