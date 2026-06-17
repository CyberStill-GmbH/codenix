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

export type OAuthProvider = 'github' | 'google'

// ─── Session (para cuando exista backend) ────────────────────────────────────
// TODO(backend): Reemplazar con el shape real de la respuesta del servidor.
// Ejemplo esperado: { token: string; user: { id: string; email: string } }
export type AuthSession = {
  user: {
    id: string
    name: string
    email: string
  }
}
