import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, KeyRound, X } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useAuth } from '@/features/auth/context/useAuth'
import { resetPassword } from '@/features/auth/services/authApi'
import type {
  ResetPasswordFormErrors,
  ResetPasswordFormValues,
} from '@/features/auth/types/auth.types'
import { getApiErrorMessage, getApiFieldErrors } from '@/features/auth/utils/authApiErrors'
import {
  getPasswordRequirementState,
  validateResetPasswordForm,
} from '@/features/auth/utils/authValidation'
import { landingTokens } from '@/features/landing/theme/tokens'
import { clearAccessToken } from '@/shared/api/apiClient'
import { ApiError } from '@/shared/api/apiClient'

const initialValues: ResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
}

const tokenRegex = /^[A-Za-z0-9_-]{32,}$/

function getResetToken(searchParams: URLSearchParams) {
  const token = searchParams.get('token')?.trim() ?? ''
  return tokenRegex.test(token) ? token : ''
}

function isInvalidResetTokenError(error: unknown) {
  return error instanceof ApiError && error.code === 'INVALID_RESET_TOKEN'
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, status } = useAuth()
  const token = useMemo(() => getResetToken(searchParams), [searchParams])
  const [values, setValues] = useState<ResetPasswordFormValues>(initialValues)
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [needsNewLink, setNeedsNewLink] = useState(!token)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(4)

  const requirements = useMemo(
    () => getPasswordRequirementState(values.password),
    [values.password],
  )

  const passwordsMismatch =
    values.confirmPassword.length > 0 && values.confirmPassword !== values.password

  useEffect(() => {
    if (!isComplete) return

    if (redirectCountdown <= 0) {
      navigate('/login', { replace: true })
      return
    }

    const timer = window.setTimeout(() => {
      setRedirectCountdown((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [isComplete, navigate, redirectCountdown])

  if (status === 'authenticated' && isAuthenticated) {
    return <Navigate to="/problems" replace />
  }

  function update<K extends keyof ResetPasswordFormValues>(
    field: K,
    value: ResetPasswordFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      setNeedsNewLink(true)
      return
    }

    const nextErrors = validateResetPasswordForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsLoading(true)
    setServerError('')
    setNeedsNewLink(false)

    try {
      await resetPassword(token, values.password)
      clearAccessToken()
      setIsComplete(true)
    } catch (error) {
      if (isInvalidResetTokenError(error)) {
        setNeedsNewLink(true)
        setServerError('Este enlace expiro o ya fue usado. Solicita uno nuevo.')
      } else {
        const backendFieldErrors = getApiFieldErrors(error, ['newPassword'] as const)
        setErrors((current) => ({
          ...current,
          password: backendFieldErrors.newPassword ?? current.password,
        }))
        setServerError(
          getApiErrorMessage(error, 'No pudimos actualizar tu contrasena.'),
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || needsNewLink) {
    return (
      <>
        <div className={landingTokens.auth.header}>
          <p className={landingTokens.auth.eyebrow}>Enlace no valido</p>
          <h1 className={landingTokens.auth.title}>Este enlace no es valido</h1>
          <p className={landingTokens.auth.description}>
            El enlace pudo expirar, haber sido usado, o venir incompleto.
          </p>
        </div>

        {serverError && (
          <div role="alert" className={landingTokens.auth.alert}>
            {serverError}
          </div>
        )}

        <p className={landingTokens.auth.footerText}>
          <Link
            to="/forgot-password"
            className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}
          >
            Solicitar nuevo enlace
          </Link>
        </p>
      </>
    )
  }

  if (isComplete) {
    return (
      <>
        <div className={landingTokens.auth.header}>
          <p className={landingTokens.auth.eyebrow}>Listo</p>
          <h1 className={landingTokens.auth.title}>Tu contrasena fue actualizada</h1>
          <p className={landingTokens.auth.description}>
            Ya puedes iniciar sesion con tu nueva contrasena.
          </p>
        </div>

        <div role="status" className={landingTokens.auth.alert}>
          Te llevaremos al login en {redirectCountdown}s.
        </div>

        <p className={landingTokens.auth.footerText}>
          <Link
            to="/login"
            className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}
          >
            Ir a iniciar sesion
          </Link>
        </p>
      </>
    )
  }

  return (
    <>
      <div className={landingTokens.auth.header}>
        <p className={landingTokens.auth.eyebrow}>Nueva contrasena</p>
        <h1 className={landingTokens.auth.title}>Restablece tu contrasena</h1>
        <p className={landingTokens.auth.description}>
          Usa una contrasena segura que cumpla los requisitos del backend.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className={landingTokens.auth.form}>
        <PasswordInput
          id="reset-password"
          name="password"
          label="Nueva contrasena"
          placeholder="Minimo 8 caracteres"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          disabled={isLoading}
          onChange={(event) => update('password', event.target.value)}
        />

        <ul className="grid gap-2 text-xs font-medium text-[var(--color-text-muted)]">
          {requirements.map((requirement) => (
            <li key={requirement.id} className="flex items-center gap-2">
              {requirement.isMet ? (
                <Check className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4 text-[var(--color-text-subtle)]" aria-hidden="true" />
              )}
              <span
                className={
                  requirement.isMet ? 'text-[var(--color-success)]' : undefined
                }
              >
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>

        <PasswordInput
          id="reset-confirm-password"
          name="confirmPassword"
          label="Confirmar contrasena"
          placeholder="Repite tu contrasena"
          autoComplete="new-password"
          value={values.confirmPassword}
          error={
            errors.confirmPassword ??
            (passwordsMismatch ? 'Las contrasenas no coinciden.' : undefined)
          }
          disabled={isLoading}
          onChange={(event) => update('confirmPassword', event.target.value)}
        />

        {serverError && (
          <div role="alert" className={landingTokens.auth.alert}>
            {serverError}
          </div>
        )}

        <AuthSubmitButton
          icon={<KeyRound className="h-4 w-4" />}
          isLoading={isLoading}
          loadingText="Actualizando..."
        >
          Actualizar contrasena
        </AuthSubmitButton>
      </form>
    </>
  )
}
