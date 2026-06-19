import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  clearAccessToken,
  getAccessToken,
  onUnauthorized,
  setAccessToken,
} from '@/shared/api/apiClient'
import * as authApi from '@/features/auth/services/authApi'
import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/context/auth-context-value'
import type {
  AuthSession,
  AuthStatus,
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/types/auth.types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const clearSession = useCallback(() => {
    clearAccessToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const completeSession = useCallback((session: AuthSession, remember = true) => {
    setAccessToken(session.accessToken, remember ? 'local' : 'session')
    setUser(session.user)
    setStatus('authenticated')
  }, [])

  useEffect(() => onUnauthorized(clearSession), [clearSession])

  const initializeSession = useCallback(async () => {
    const token = getAccessToken()

    if (!token) {
      setUser(null)
      setStatus('unauthenticated')
      return
    }

    try {
      setStatus('loading')
      const nextUser = await authApi.getMe()
      setUser(nextUser)
      setStatus('authenticated')
    } catch {
      clearSession()
    }
  }, [clearSession])

  const login = useCallback(
    async (values: LoginFormValues) => {
      const session = await authApi.login(values)
      completeSession(session, values.remember)
      return session
    },
    [completeSession],
  )

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const session = await authApi.register(values)
      completeSession(session)
      return session
    },
    [completeSession],
  )

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await authApi.logout()
      }
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated' && Boolean(user),
      login,
      register,
      logout,
      completeSession,
      initializeSession,
    }),
    [completeSession, initializeSession, login, logout, register, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
