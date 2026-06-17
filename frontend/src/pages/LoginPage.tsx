import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Mail } from 'lucide-react'

import { AuthInput } from '@/features/auth/components/AuthInput'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { OAuthButton } from '@/features/auth/components/OAuthButton'
import { AuthCheckbox } from '@/features/auth/components/AuthCheckbox'
import { GithubBrandIcon, GoogleBrandIcon } from '@/features/auth/components/OAuthBrandIcon'
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

const initialValues: LoginFormValues = { email: '', password: '', remember: false }

export function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function update<K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

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
    } catch (err) {
      // TODO(backend): Mostrar errores reales devueltos por el backend REST API (401, 422).
      setServerError(err instanceof Error ? err.message : 'Correo o contraseña incorrectos.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOAuth(provider: OAuthProvider) {
    redirectToOAuthMock(provider)
    // TODO(backend): Redirigir a ventana OAuth del backend: window.location.href = `/api/auth/${provider}/redirect`
  }

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Bienvenido de vuelta
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Inicia sesión
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Continúa tu progreso dentro de Codenix.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          onChange={(e) => update('email', e.target.value)}
        />

        <PasswordInput
          id="login-password"
          name="password"
          label="Contraseña"
          placeholder="••••••••"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          forgotHref="#"
          onChange={(e) => update('password', e.target.value)}
        />

        <AuthCheckbox
          id="login-remember"
          label="Recordarme"
          checked={values.remember}
          onChange={(e) => update('remember', e.target.checked)}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--color-error)] bg-[rgba(239,68,68,0.07)] px-4 py-3 text-sm text-[var(--color-error)]"
          >
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
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-[var(--color-text-subtle)]">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span>o continúa con</span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <OAuthButton
          provider="github"
          icon={<GithubBrandIcon />}
          label="GitHub"
          onClick={handleOAuth}
        />
        <OAuthButton
          provider="google"
          icon={<GoogleBrandIcon />}
          label="Google"
          onClick={handleOAuth}
        />
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        ¿No tienes cuenta?{' '}
        <Link
          to="/register"
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          Crea una gratis
        </Link>
      </p>
    </>
  )
}