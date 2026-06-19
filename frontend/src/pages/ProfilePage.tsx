import { useEffect, useState } from 'react'

import { AppNavbar } from '@/shared/components/navigation/AppNavbar'
import { UserProfileCard } from '@/features/user/components/UserProfileCard'
import { UserProgressPanel } from '@/features/user/components/UserProgressPanel'
import { UserTopRanking } from '@/features/user/components/UserTopRanking'
import { ActivityHeatmap } from '@/features/user/components/ActivityHeatmap/ActivityHeatmap'
import { UserRecentSubmissions } from '@/features/user/components/UserRecentSubmissions'
import { UserCard } from '@/features/user/components/UserCard'
import { PageSection } from '@/components/motion/PageSection'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useAuth } from '@/features/auth/context/useAuth'
import {
  getUserActivity,
  getUserProgress,
  getUserRecentSubmissions,
  getUserStats,
} from '@/features/user/services/userApi'
import type {
  ActivityDay,
  DifficultyProgress,
  Submission,
  UserStats,
} from '@/features/user/types/user.types'

type ProfileData = {
  stats: UserStats
  progress: DifficultyProgress
  activityDays: ActivityDay[]
  recentSubmissions: Submission[]
}

export function ProfilePage() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let isMounted = true
    const year = new Date().getFullYear()

    async function loadProfileData() {
      try {
        setIsLoadingProfile(true)
        setProfileError('')
        const [stats, progress, activityDays, recentSubmissions] = await Promise.all([
          getUserStats(),
          getUserProgress(),
          getUserActivity(year),
          getUserRecentSubmissions(10),
        ])

        if (isMounted) {
          setProfileData({
            stats,
            progress,
            activityDays,
            recentSubmissions,
          })
        }
      } catch (error) {
        if (isMounted) {
          setProfileError(
            error instanceof Error
              ? error.message
              : 'No pudimos cargar los datos del perfil.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
      }
    }

    if (user) {
      loadProfileData()
    }

    return () => {
      isMounted = false
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <AppNavbar />
        <main className="mx-auto w-full grow p-4 md:max-w-[888px] md:p-6 lg:max-w-screen-xl">
          <ErrorState message="No pudimos cargar tu perfil autenticado." />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />

      <main className="mx-auto w-full grow p-4 md:max-w-[888px] md:p-6 lg:max-w-screen-xl">
        {isLoadingProfile && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm font-semibold text-[var(--color-text-muted)]">
            Cargando perfil...
          </div>
        )}

        {profileError && !isLoadingProfile && <ErrorState message={profileError} />}

        {profileData && !isLoadingProfile && !profileError && (
        <div className="grid items-start gap-2.5 md:grid-cols-[17.5rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="codenix-user-stack !gap-3 md:w-[17.5rem] lg:w-[20rem]">
            <PageSection>
              <UserProfileCard user={user} submissions={profileData.recentSubmissions} />
            </PageSection>
          </div>
          <div className="codenix-user-stack !gap-3">
            <PageSection delay={100}>
              <div className="grid items-stretch gap-2.5 xl:grid-cols-2">
                <UserCard as="section" className="h-full [&>div]:h-full">
                  <UserProgressPanel progress={profileData.progress} stats={profileData.stats} />
                </UserCard>
                <UserCard as="section" className="h-full [&>div]:h-full">
                  <UserTopRanking stats={profileData.stats} />
                </UserCard>
              </div>
            </PageSection>
            <PageSection delay={200}>
              <ActivityHeatmap activityDays={profileData.activityDays} />
            </PageSection>
            <PageSection delay={300}>
              <UserRecentSubmissions submissions={profileData.recentSubmissions} />
            </PageSection>
          </div>
        </div>
        )}
      </main>
    </div>
  )
}
