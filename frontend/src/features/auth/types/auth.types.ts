export type LoginFormValues = {
  email: string
  password: string
  remember: boolean
}

export type LoginFormErrors = {
  email?: string
  password?: string
}

export type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export type RegisterFormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export type ForgotPasswordFormValues = {
  email: string
}

export type ForgotPasswordFormErrors = {
  email?: string
}

export type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}

export type ResetPasswordFormErrors = {
  password?: string
  confirmPassword?: string
}

export type OAuthProvider = 'github' | 'google'

export type UserRole = 'user' | 'admin'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthUser = {
  id: string
  name: string
  username: string
  email: string
  avatarUrl: string
  degree: string
  githubUrl: string
  linkedinUrl: string
  memberSince?: string
  role: UserRole
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}
