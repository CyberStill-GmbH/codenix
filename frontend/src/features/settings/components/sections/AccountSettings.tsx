import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { SettingsCard, SettingsField, SettingsInput } from '@/features/settings/components/SettingsCard'
import { useAuth } from '@/features/auth/context/useAuth'
import { changeUsername } from '@/features/user/services/userApi'
import { changeUsernameSchema } from '@/features/settings/utils/settingsValidation'

type Props = {
  user: User
}

export function AccountSettings({ user }: Props) {
  const { updateUser } = useAuth()
  const [usernameInput, setUsernameInput] = useState(user.username)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const isChanged = usernameInput.trim() !== user.username

  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFieldError(null)
    setFeedback(null)

    // Zod client-side validation
    const result = changeUsernameSchema.safeParse({ newUsername: usernameInput.trim() })
    if (!result.success) {
      const issue = result.error.issues[0]
      setFieldError(issue?.message ?? 'Nombre de usuario inválido.')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await changeUsername(result.data.newUsername)
      updateUser({ username: res.user.username })
      setFeedback({
        type: 'success',
        message: res.message || 'Nombre de usuario actualizado con éxito.',
      })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el nombre de usuario.'
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
        title="Información de la cuenta"
        description="Gestiona los datos de tu perfil y tu nombre de usuario visible en Codenix."
      >
        <div className="flex items-center gap-4">
          <UserAvatar src={user.avatarUrl} name={user.name} size="menu" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">{user.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">@{user.username}</p>
          </div>
        </div>

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

        <SettingsField
          label="Nombre"
          htmlFor="settings-account-name"
          description="Tu nombre completo en la plataforma."
        >
          <SettingsInput
            id="settings-account-name"
            type="text"
            defaultValue={user.name}
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </SettingsField>

        <form onSubmit={handleUsernameSubmit} className="space-y-3">
          <SettingsField
            label="Nombre de usuario"
            htmlFor="settings-account-username"
            description="Tu identificador único (@username) en Codenix."
          >
            <div className="space-y-1.5">
              <SettingsInput
                id="settings-account-username"
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value)
                  if (fieldError) setFieldError(null)
                  if (feedback) setFeedback(null)
                }}
                disabled={isSubmitting}
                placeholder="ej. alex_coder"
                aria-invalid={Boolean(fieldError)}
              />
              {fieldError && (
                <p className="text-xs text-[var(--color-error)]">{fieldError}</p>
              )}
            </div>
          </SettingsField>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isChanged || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar nombre de usuario</span>
              )}
            </button>
          </div>
        </form>

        <SettingsField
          label="Correo electrónico"
          htmlFor="settings-account-email"
          description="Dirección vinculada a tu cuenta de usuario."
        >
          <SettingsInput
            id="settings-account-email"
            type="email"
            defaultValue={user.email ?? '—'}
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </SettingsField>
      </SettingsCard>
    </div>
  )
}
