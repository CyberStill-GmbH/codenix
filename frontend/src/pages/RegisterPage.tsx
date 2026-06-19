import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail, User, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AuthCheckbox } from '@/features/auth/components/AuthCheckbox'
import { AuthFormShell } from '@/features/auth/components/AuthFormShell'
import { AuthInput } from '@/features/auth/components/AuthInput'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useAuth } from '@/features/auth/context/useAuth'
import { buildOAuthRedirectUrl } from '@/features/auth/services/authApi'
import type {
  OAuthProvider,
  RegisterFormErrors,
  RegisterFormValues,
} from '@/features/auth/types/auth.types'
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '@/features/auth/utils/authApiErrors'
import { validateRegisterForm } from '@/features/auth/utils/authValidation'
import { landingTokens } from '@/features/landing/theme/tokens'

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function update<K extends keyof RegisterFormValues>(
    field: K,
    value: RegisterFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateRegisterForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsLoading(true)
    setServerError('')

    try {
      await register(values)
      navigate('/problems', { replace: true })
    } catch (error) {
      setErrors((current) => ({
        ...current,
        ...getApiFieldErrors(error, ['name', 'email', 'password'] as const),
      }))
      setServerError(getApiErrorMessage(error, 'Error al crear la cuenta. Intentalo de nuevo.'))
    } finally {
      setIsLoading(false)
    }
  }

  function handleOAuth(provider: OAuthProvider) {
    window.location.href = buildOAuthRedirectUrl(provider, '/problems')
  }

  return (
    <AuthFormShell
      eyebrow="Unete a Codenix"
      title="Crea tu cuenta"
      description="Empieza a practicar y medir tu progreso."
      onSubmit={handleSubmit}
      onOAuth={handleOAuth}
      dividerText="o registrate con"
      footerText="Ya tienes cuenta?"
      footerLinkLabel="Inicia sesion"
      footerLinkTo="/login"
      compact
    >
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
        disabled={isLoading}
        onChange={(event) => update('name', event.target.value)}
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
        disabled={isLoading}
        onChange={(event) => update('email', event.target.value)}
      />

      <PasswordInput
        id="register-password"
        name="password"
        label="Contrasena"
        placeholder="Minimo 8 caracteres"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        disabled={isLoading}
        onChange={(event) => update('password', event.target.value)}
      />

      <PasswordInput
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirmar contrasena"
        placeholder="Repite tu contrasena"
        autoComplete="new-password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        disabled={isLoading}
        onChange={(event) => update('confirmPassword', event.target.value)}
      />

      <AuthCheckbox
        id="register-terms"
        label={
          <span>
            Acepto los{' '}
            <a
              href="#"
              className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}
            >
              terminos
            </a>{' '}
            y la{' '}
            <a
              href="#"
              className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}
            >
              privacidad
            </a>
          </span>
        }
        checked={values.terms}
        error={errors.terms}
        disabled={isLoading}
        onChange={(event) => update('terms', event.target.checked)}
      />

      {serverError && (
        <div role="alert" className={landingTokens.auth.alert}>
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
    </AuthFormShell>
  )
}
