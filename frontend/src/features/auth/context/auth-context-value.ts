import { createContext } from 'react'

import type {
  AuthSession,
  AuthStatus,
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/types/auth.types'

export type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  login: (values: LoginFormValues) => Promise<AuthSession>
  register: (values: RegisterFormValues) => Promise<AuthSession>
  logout: () => Promise<void>
  completeSession: (session: AuthSession, remember?: boolean) => void
  initializeSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
