import type {
  AuthSession,
  LoginFormValues,
  OAuthProvider,
  RegisterFormValues,
} from '@/features/auth/types/auth.types'

// ─── Login ────────────────────────────────────────────────────────────────────
// TODO(backend): Reemplazar el body de esta función con:
//   const res = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email: values.email, password: values.password }),
//   })
//   if (!res.ok) throw new Error(await res.text())
//   const data = await res.json()
//   // TODO(backend): Guardar token/cookie: localStorage.setItem('token', data.token)
//   return data as AuthSession
export async function loginMockService(values: LoginFormValues): Promise<AuthSession> {
  await new Promise((resolve) => window.setTimeout(resolve, 900))

  // Simulated error for demo purposes — remove when connecting real API
  if (values.password === 'wrong123') throw new Error('Credenciales inválidas')

  return {
    user: { id: 'mock-user-1', name: 'Codenix User', email: values.email },
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────
// TODO(backend): Reemplazar con:
//   const res = await fetch('/api/auth/register', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, email, password }),
//   })
//   if (!res.ok) throw new Error(await res.text())
//   // TODO(backend): Decidir aquí si inicia sesión automáticamente o redirige a /login
//   return await res.json() as AuthSession
export async function registerMockService(
  values: RegisterFormValues,
): Promise<AuthSession> {
  await new Promise((resolve) => window.setTimeout(resolve, 1100))

  return {
    user: { id: 'mock-user-2', name: values.name, email: values.email },
  }
}

// ─── OAuth ────────────────────────────────────────────────────────────────────
// TODO(backend): Reemplazar con redirección real al endpoint OAuth del servidor.
//   window.location.href = `/api/auth/${provider}/redirect`
export function redirectToOAuthMock(provider: OAuthProvider) {
  console.info(`[Codenix] OAuth mock — provider: ${provider}`)
}
