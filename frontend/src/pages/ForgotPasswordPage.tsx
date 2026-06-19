import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { AuthInput } from '@/features/auth/components/AuthInput'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { useAuth } from '@/features/auth/context/useAuth'
import { forgotPassword } from '@/features/auth/services/authApi'
import type {
  ForgotPasswordFormErrors,
  ForgotPasswordFormValues,
} from '@/features/auth/types/auth.types'
import { validateForgotPasswordForm } from '@/features/auth/utils/authValidation'
import { landingTokens } from '@/features/landing/theme/tokens'
import { ApiError } from '@/shared/api/apiClient'

const initialValues: ForgotPasswordFormValues = { email: '' }
const SUCCESS_MESSAGE =
  'Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contrasena.'
const RESEND_COOLDOWN_SECONDS = 30

export function ForgotPasswordPage() {
  const { isAuthenticated, status } = useAuth()
  const [values, setValues] = useState<ForgotPasswordFormValues>(initialValues)
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({})
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const emailError = useMemo(() => {
    if (!values.email) return undefined
    return validateForgotPasswordForm(values).email
  }, [values])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = window.setTimeout(() => {
      setCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldown])

  if (status === 'authenticated' && isAuthenticated) {
    return <Navigate to="/problems" replace />
  }

  function updateEmail(email: string) {
    setValues({ email })
    setErrors({})
    setServerError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading || cooldown > 0) return

    const nextErrors = validateForgotPasswordForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsLoading(true)
    setServerError('')
    setSuccessMessage('')

    try {
      await forgotPassword(values)
      setSuccessMessage(SUCCESS_MESSAGE)
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      // Never let client errors disclose whether an account exists for this email.
      if (error instanceof ApiError && error.status < 500) {
        setSuccessMessage(SUCCESS_MESSAGE)
        setCooldown(RESEND_COOLDOWN_SECONDS)
      } else {
        setServerError('No pudimos enviar el enlace. Intentalo de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={landingTokens.auth.header}>
        <p className={landingTokens.auth.eyebrow}>Recupera el acceso</p>
        <h1 className={landingTokens.auth.title}>Olvidaste tu contrasena?</h1>
        <p className={landingTokens.auth.description}>
          Escribe tu correo y te enviaremos un enlace temporal para crear una nueva.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit} className={landingTokens.auth.form}>
        <AuthInput
          id="forgot-email"
          name="email"
          label="Correo"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          icon={Mail}
          value={values.email}
          error={errors.email ?? emailError}
          disabled={isLoading || cooldown > 0}
          onChange={(event) => updateEmail(event.target.value)}
        />

        {successMessage && (
          <div role="status" className={landingTokens.auth.alert}>
            {successMessage}
          </div>
        )}

        {serverError && (
          <div role="alert" className={landingTokens.auth.alert}>
            {serverError}
          </div>
        )}

        <AuthSubmitButton
          icon={<Send className="h-4 w-4" />}
          isLoading={isLoading}
          disabled={cooldown > 0}
          loadingText="Enviando..."
        >
          {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Enviar enlace'}
        </AuthSubmitButton>
      </form>

      <p className={landingTokens.auth.footerText}>
        <Link
          to="/login"
          className={`${landingTokens.auth.footerLink} ${landingTokens.focus} inline-flex items-center gap-2`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a iniciar sesion
        </Link>
      </p>
    </>
  )
}
