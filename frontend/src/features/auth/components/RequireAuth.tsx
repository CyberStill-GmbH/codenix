import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { PageLoader } from '@/components/feedback/PageLoader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useAuth } from '@/features/auth/context/useAuth'
import type { UserRole } from '@/features/auth/types/auth.types'

type RequireAuthProps = {
  children: ReactNode
  role?: UserRole
  fallback?: React.ComponentProps<typeof PageLoader>['variant']
}

export function RequireAuth({ children, role, fallback = 'problems' }: RequireAuthProps) {
  const location = useLocation()
  const { user, status, isAuthenticated } = useAuth()

  if (status === 'loading') {
    return <PageLoader variant={fallback} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />
  }

  if (role && user?.role !== role) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="codenix-app-shell codenix-user-main">
          <ErrorState
            title="Acceso restringido"
            message="Tu cuenta no tiene permisos para entrar a esta seccion."
          />
        </main>
      </div>
    )
  }

  return children
}
