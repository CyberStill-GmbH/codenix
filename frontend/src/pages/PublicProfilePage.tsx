import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AppNavbar } from '@/shared/components/navigation/AppNavbar'
import { ErrorState } from '@/components/feedback/ErrorState'
import { SkeletonProfilePage } from '@/components/skeletons/SkeletonProfilePage'
import { PageSection } from '@/components/motion/PageSection'
import { UserCard } from '@/features/user/components/UserCard'
import { UserProfileCard } from '@/features/user/components/UserProfileCard'
import { UserProgressPanel } from '@/features/user/components/UserProgressPanel'
import { UserTopRanking } from '@/features/user/components/UserTopRanking'
import { ActivityHeatmap } from '@/features/user/components/ActivityHeatmap/ActivityHeatmap'
import { UserRecentSubmissions } from '@/features/user/components/UserRecentSubmissions'
import { getPublicProfile, type PublicProfile } from '@/features/user/services/userApi'
import type { User } from '@/features/user/types/user.types'

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [error, setError] = useState('')
  const [loadedUsername, setLoadedUsername] = useState('')

  useEffect(() => {
    if (!username) return
    getPublicProfile(username).then((nextProfile) => {
      setProfile(nextProfile)
      setLoadedUsername(username)
    }).catch((cause) => {
      setLoadedUsername(username)
      setError(cause instanceof Error ? cause.message : 'No pudimos encontrar este perfil.')
    })
  }, [username])

  const publicUser: User | null = profile
    ? {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        avatarUrl: profile.avatarUrl ?? '',
        degree: profile.degree ?? '',
        githubUrl: '',
        linkedinUrl: '',
        memberSince: profile.createdAt,
      }
    : null
  const isLoading = loadedUsername !== username

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />
      <main id="main-content" className="mx-auto w-full grow px-3 pb-24 pt-3 md:max-w-[888px] md:p-6 lg:max-w-screen-xl">
        {isLoading && <SkeletonProfilePage />}
        {!isLoading && error && <ErrorState title="Perfil no disponible" message={error} />}
        {!isLoading && profile && publicUser && (
          <>
            <header className="mb-4">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">Perfil público</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Progreso y actividad de @{profile.username}.</p>
            </header>
            <div className="grid min-w-0 items-start gap-2.5 md:grid-cols-[17.5rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]">
              <div className="codenix-user-stack min-w-0 !gap-3 md:w-[17.5rem] lg:w-[20rem]">
                <PageSection>
                  <UserProfileCard user={publicUser} submissions={profile.recentSubmissions} communityStats={profile} />
                </PageSection>
              </div>
              <div className="codenix-user-stack min-w-0 !gap-3">
                <PageSection delay={100}>
                  <div className="grid items-stretch gap-2.5 xl:grid-cols-2">
                    <UserCard as="section" className="h-full [&>div]:h-full">
                      <UserProgressPanel progress={profile.progress} stats={profile.stats} />
                    </UserCard>
                    {profile.stats.totalSubmissions > 0 && (
                      <UserCard as="section" className="h-full [&>div]:h-full">
                        <UserTopRanking stats={profile.stats} />
                      </UserCard>
                    )}
                  </div>
                </PageSection>
                <PageSection delay={200}>
                  <ActivityHeatmap activityDays={profile.activityDays} />
                </PageSection>
                <PageSection delay={300}>
                  <UserRecentSubmissions submissions={profile.recentSubmissions} />
                </PageSection>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
