import { AppNavbar } from '@/shared/components/navigation/AppNavbar'
import { AdminNavbar } from '@/features/admin/problems/components/AdminNavbar'
import { SkeletonAdminForm } from '@/components/skeletons/SkeletonAdminForm'
import { SkeletonEditorLayout } from '@/components/skeletons/SkeletonEditorLayout'
import { SkeletonProblemList } from '@/components/skeletons/SkeletonProblemList'
import { SkeletonSubmissionsTable } from '@/components/skeletons/SkeletonSubmissionsTable'
import { SkeletonProfilePage } from '@/components/skeletons/SkeletonProfilePage'

export type PageLoaderVariant =
  | 'problems'
  | 'submissions'
  | 'profile'
  | 'admin-list'
  | 'admin-form'
  | 'admin-testcases'
  | 'editor'

type PageLoaderProps = {
  variant?: PageLoaderVariant
}

export function PageLoader({ variant = 'problems' }: PageLoaderProps) {
  const isAdmin = variant.startsWith('admin')
  const isEditor = variant === 'editor'

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {isAdmin ? <AdminNavbar /> : !isEditor && <AppNavbar />}
      <main className="codenix-app-shell codenix-user-main">
        {renderLoader(variant)}
      </main>
    </div>
  )
}

function renderLoader(variant: PageLoaderVariant) {
  if (variant === 'submissions') return <SkeletonSubmissionsTable />
  if (variant === 'profile') return <SkeletonProfilePage />
  if (variant === 'admin-form') return <SkeletonAdminForm />
  if (variant === 'admin-list') return <SkeletonProblemList mode="admin" />
  if (variant === 'admin-testcases') return <SkeletonAdminForm compact />
  if (variant === 'editor') return <SkeletonEditorLayout />
  return <SkeletonProblemList />
}
