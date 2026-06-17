import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, UserPlus, User } from 'lucide-react'

import { AuthInput } from '@/features/auth/components/AuthInput'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { OAuthButton } from '@/features/auth/components/OAuthButton'
import { AuthCheckbox } from '@/features/auth/components/AuthCheckbox'
import { GithubBrandIcon, GoogleBrandIcon } from '@/features/auth/components/OAuthBrandIcon'
import {
  registerMockService,
  redirectToOAuthMock,
} from '@/features/auth/services/authMockService'
import type {
  RegisterFormErrors,
  RegisterFormValues,
  OAuthProvider,
} from '@/features/auth/types/auth.types'

import { validateRegisterForm } from '@/features/auth/utils/authValidation'

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
}

export function RegisterPage() {
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function update<K extends keyof RegisterFormValues>(field: K, value: RegisterFormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextErrors = validateRegisterForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsLoading(true)
    setServerError('')

    try {
      await registerMockService(values)
      // TODO(backend): Decidir flujo post-registro.
      // Opciones: login automático y redirigir a /problems, o redirigir a /login pidiendo confirmar email.
    } catch (err) {
      // TODO(backend): Mostrar errores reales del backend REST API (409 Email en uso).
      setServerError(err instanceof Error ? err.message : 'Error al crear la cuenta. Inténtalo de nuevo.')
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
      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Únete a Codenix
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Crea tu cuenta
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Empieza a practicar y medir tu progreso.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          id="register-name"
          name="name"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          icon={User}
          value={values.name}
          error={errors.name}
          onChange={(e) => update('name', e.target.value)}
        />

        <AuthInput
          id="register-email"
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
          id="register-password"
          name="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={(e) => update('password', e.target.value)}
        />

        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
        />

        <AuthCheckbox
          id="register-terms"
          label={
            <span>
              Acepto los{' '}
              <a href="#" className="font-semibold text-[var(--color-primary)] hover:underline">
                términos
              </a>
              {' '}y la{' '}
              <a href="#" className="font-semibold text-[var(--color-primary)] hover:underline">
                privacidad
              </a>
            </span>
          }
          checked={values.terms}
          error={errors.terms}
          onChange={(e) => update('terms', e.target.checked)}
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
          icon={<UserPlus className="h-4 w-4" />}
          isLoading={isLoading}
          loadingText="Creando cuenta..."
        >
          Crear cuenta
        </AuthSubmitButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-text-subtle)]">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span>o regístrate con</span>
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

      <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  )
}
