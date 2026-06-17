import { useState } from 'react'
import type { FormEvent } from 'react'
import { LogIn, Mail } from 'lucide-react'

import { AuthCheckbox } from '@/features/auth/components/AuthCheckbox'
import { AuthFormShell } from '@/features/auth/components/AuthFormShell'
import { AuthInput } from '@/features/auth/components/AuthInput'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import {
  loginMockService,
  redirectToOAuthMock,
} from '@/features/auth/services/authMockService'
import type {
  LoginFormErrors,
  LoginFormValues,
  OAuthProvider,
} from '@/features/auth/types/auth.types'
import { validateLoginForm } from '@/features/auth/utils/authValidation'
import { landingTokens } from '@/features/landing/theme/tokens'

const initialValues: LoginFormValues = { email: '', password: '', remember: false }

export function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function update<K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateLoginForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsLoading(true)
    setServerError('')

    try {
      await loginMockService(values)
      // TODO(backend): Redirigir al usuario al dashboard después del login exitoso.
      // e.g. navigate('/problems')
    } catch (error) {
      // TODO(backend): Mostrar errores reales devueltos por el backend REST API (401, 422).
      setServerError(error instanceof Error ? error.message : 'Correo o contraseña incorrectos.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOAuth(provider: OAuthProvider) {
    redirectToOAuthMock(provider)
    // TODO(backend): Redirigir a ventana OAuth del backend: window.location.href = `/api/auth/${provider}/redirect`
  }

  return (
    <AuthFormShell
      eyebrow="Bienvenido de vuelta"
      title="Inicia sesión"
      description="Continúa tu progreso dentro de Codenix."
      onSubmit={handleSubmit}
      onOAuth={handleOAuth}
      dividerText="o continúa con"
      footerText="¿No tienes cuenta?"
      footerLinkLabel="Crea una gratis"
      footerLinkTo="/register"
    >
      <AuthInput
        id="login-email"
        name="email"
        label="Correo"
        type="email"
        placeholder="tu@email.com"
        autoComplete="email"
        icon={Mail}
        value={values.email}
        error={errors.email}
        disabled={isLoading}
        onChange={(event) => update('email', event.target.value)}
      />

      <PasswordInput
        id="login-password"
        name="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        disabled={isLoading}
        forgotHref="#"
        onChange={(event) => update('password', event.target.value)}
      />

      <AuthCheckbox
        id="login-remember"
        label="Recordarme"
        checked={values.remember}
        disabled={isLoading}
        onChange={(event) => update('remember', event.target.checked)}
      />

      {serverError && (
        <div role="alert" className={landingTokens.auth.alert}>
          {serverError}
        </div>
      )}

      <AuthSubmitButton
        icon={<LogIn className="h-4 w-4" />}
        isLoading={isLoading}
        loadingText="Ingresando..."
      >
        Iniciar sesión
      </AuthSubmitButton>
    </AuthFormShell>
  )
}
