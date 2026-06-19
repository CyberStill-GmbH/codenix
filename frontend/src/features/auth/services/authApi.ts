import { apiRequest } from '@/shared/api/apiClient'
import type {
  AuthSession,
  AuthUser,
  ForgotPasswordFormValues,
  LoginFormValues,
  OAuthProvider,
  RegisterFormValues,
} from '@/features/auth/types/auth.types'

export function login(values: LoginFormValues) {
  return apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: {
      email: values.email,
      password: values.password,
      remember: values.remember,
    },
  })
}

export function register(values: RegisterFormValues) {
  return apiRequest<AuthSession>('/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: {
      name: values.name,
      email: values.email,
      password: values.password,
    },
  })
}

export function getMe() {
  return apiRequest<AuthUser>('/auth/me')
}

export function logout() {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
  })
}

export function forgotPassword(values: ForgotPasswordFormValues) {
  return apiRequest<void>('/auth/forgot-password', {
    method: 'POST',
    skipAuth: true,
    body: {
      email: values.email,
    },
  })
}

export function resetPassword(token: string, newPassword: string) {
  return apiRequest<void>('/auth/reset-password', {
    method: 'POST',
    skipAuth: true,
    body: {
      token,
      newPassword,
    },
  })
}

export function buildOAuthRedirectUrl(provider: OAuthProvider, returnTo = '/problems') {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/auth/${provider}/redirect`)
  url.searchParams.set('returnTo', returnTo)
  return url.toString()
}
