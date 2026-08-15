import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Smartphone } from 'lucide-react'
import { SettingsCard, SettingsField, SettingsInput } from '@/features/settings/components/SettingsCard'
import { changePassword } from '@/features/user/services/userApi'
import { changePasswordSchema } from '@/features/settings/utils/settingsValidation'

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setFeedback(null)

    // Zod client-side validation
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0]?.toString() ?? 'form'
        fieldErrors[fieldName] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    try {
      setIsSubmitting(true)
      const res = await changePassword(
        result.data.currentPassword,
        result.data.newPassword,
        result.data.confirmPassword,
      )
      setFeedback({
        type: 'success',
        message: res.message || 'Contraseña actualizada de forma exitosa.',
      })
      // Clear form on success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar la contraseña.'
      setFeedback({
        type: 'error',
        message: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Cambiar contraseña"
        description="Asegúrate de utilizar una contraseña segura de al menos 8 caracteres."
      >
        {feedback && (
          <div
            className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed transition ${
              feedback.type === 'success'
                ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]'
                : 'border-[var(--color-error)]/30 bg-[var(--color-error)]/10 text-[var(--color-error)]'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <SettingsField
            label="Contraseña actual"
            htmlFor="settings-security-current-pw"
            description="Ingresa tu contraseña actual para confirmar."
          >
            <div className="space-y-1">
              <div className="relative flex items-center">
                <SettingsInput
                  id="settings-security-current-pw"
                  type={showCurrentPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: '' }))
                  }}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                  aria-label={showCurrentPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-[var(--color-error)]">{errors.currentPassword}</p>
              )}
            </div>
          </SettingsField>

          <SettingsField
            label="Nueva contraseña"
            htmlFor="settings-security-new-pw"
            description="Mínimo 8 caracteres."
          >
            <div className="space-y-1">
              <div className="relative flex items-center">
                <SettingsInput
                  id="settings-security-new-pw"
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }))
                  }}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                  aria-label={showNewPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-[var(--color-error)]">{errors.newPassword}</p>
              )}
            </div>
          </SettingsField>

          <SettingsField
            label="Confirmar nueva contraseña"
            htmlFor="settings-security-confirm-pw"
            description="Repite tu nueva contraseña."
          >
            <div className="space-y-1">
              <div className="relative flex items-center">
                <SettingsInput
                  id="settings-security-confirm-pw"
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                  }}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus:outline-none"
                  aria-label={showConfirmPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[var(--color-error)]">{errors.confirmPassword}</p>
              )}
            </div>
          </SettingsField>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <span>Actualizar contraseña</span>
              )}
            </button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title="Próximamente">
        <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Autenticación de dos factores
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
          <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
          Sesiones activas
        </div>
      </SettingsCard>
    </div>
  )
}
