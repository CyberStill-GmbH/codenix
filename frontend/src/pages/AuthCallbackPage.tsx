import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { PageLoader } from '@/components/feedback/PageLoader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { useAuth } from '@/features/auth/context/useAuth'
import { getMe } from '@/features/auth/services/authApi'
import { setAccessToken } from '@/shared/api/apiClient'

export function AuthCallbackPage() {
  const location = useLocation()
  const { completeSession } = useAuth()
  const [error, setError] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('returnTo') || '/problems'
  }, [location.search])

  useEffect(() => {
    let isMounted = true

    async function finishOAuth() {
      const params = new URLSearchParams(location.search)
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''))
      const callbackError = params.get('error')
      const accessToken = hashParams.get('accessToken')

      if (callbackError) {
        setError(callbackError)
        return
      }

      if (!accessToken) {
        setError('No se recibio un token de acceso del backend.')
        return
      }

      try {
        setAccessToken(accessToken)
        const user = await getMe()

        if (isMounted) {
          completeSession({ accessToken, user }, true)
          setIsComplete(true)
        }
      } catch (oauthError) {
        if (isMounted) {
          setError(
            oauthError instanceof Error
              ? oauthError.message
              : 'No pudimos completar el inicio con OAuth.',
          )
        }
      }
    }

    finishOAuth()

    return () => {
      isMounted = false
    }
  }, [completeSession, location.hash, location.search])

  if (isComplete) {
    return <Navigate to={returnTo} replace />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="codenix-app-shell codenix-user-main">
          <ErrorState title="No se pudo iniciar sesion" message={error} />
        </main>
      </div>
    )
  }

  return <PageLoader variant="problems" />
}
