import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Mail, User, UserPlus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

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
  const [step, setStep] = useState<1 | 2>(1)

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
    if (step === 1) {
      const firstStepErrors: RegisterFormErrors = {
        name: nextErrors.name,
        email: nextErrors.email,
      }
      if (firstStepErrors.name || firstStepErrors.email) {
        setErrors(firstStepErrors)
        return
      }
      setErrors({})
      setStep(2)
      return
    }

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
      setServerError(
        getApiErrorMessage(
          error,
          'Error al crear la cuenta. Intentalo de nuevo.',
        ),
      )
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
      title={step === 1 ? 'Crea tu cuenta' : 'Protege tu cuenta'}
      description={step === 1 ? 'Empieza con tu identidad y continúa cuando estés listo.' : 'Define una contraseña segura para terminar el registro.'}
      onSubmit={handleSubmit}
      onOAuth={handleOAuth}
      dividerText="o registrate con"
      footerText="Ya tienes cuenta?"
      footerLinkLabel="Inicia sesion"
      footerLinkTo="/login"
      compact
      showOAuth={step === 1}
    >
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.div key="identity" className="flex flex-col gap-5" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <AuthInput id="register-name" name="name" label="Usuario" type="text" placeholder="Tu nombre de usuario" autoComplete="username" icon={User} value={values.name} error={errors.name} disabled={isLoading} onChange={(event) => update('name', event.target.value)} />
            <AuthInput id="register-email" name="email" label="Correo" type="email" placeholder="tu@email.com" autoComplete="email" icon={Mail} value={values.email} error={errors.email} disabled={isLoading} onChange={(event) => update('email', event.target.value)} />
            <AuthSubmitButton icon={<ArrowRight className="h-4 w-4" />}>
              Continuar
            </AuthSubmitButton>
          </motion.div>
        ) : (
          <motion.div key="security" className="flex flex-col gap-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <PasswordInput id="register-password" name="password" label="Contraseña" placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={values.password} error={errors.password} disabled={isLoading} onChange={(event) => update('password', event.target.value)} />
            <PasswordInput id="register-confirm-password" name="confirmPassword" label="Confirmar contraseña" placeholder="Repite tu contraseña" autoComplete="new-password" value={values.confirmPassword} error={errors.confirmPassword} disabled={isLoading} onChange={(event) => update('confirmPassword', event.target.value)} />
            <AuthCheckbox id="register-terms" label={<span>Acepto los <Link to="/terms" className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}>términos</Link> y la <Link to="/privacy" className={`${landingTokens.auth.footerLink} ${landingTokens.focus}`}>privacidad</Link></span>} checked={values.terms} error={errors.terms} disabled={isLoading} onChange={(event) => update('terms', event.target.checked)} />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { setStep(1); setErrors({}) }} disabled={isLoading} className={`${landingTokens.auth.oauthButton} !h-11 !w-auto px-4 ${landingTokens.focus}`}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Atrás</button>
              <div className="flex-1"><AuthSubmitButton icon={<UserPlus className="h-4 w-4" />} isLoading={isLoading} loadingText="Creando cuenta…">Crear cuenta</AuthSubmitButton></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {serverError && (
        <div role="alert" className={landingTokens.auth.alert}>
          {serverError}
        </div>
      )}

    </AuthFormShell>
  )
}
