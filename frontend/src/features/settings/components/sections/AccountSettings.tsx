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
  const [nameInput, setNameInput] = useState(user.name ?? '')
  const [usernameInput, setUsernameInput] = useState(user.username ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const isNameChanged = nameInput.trim() !== (user.name ?? '')
  const isUsernameChanged = usernameInput.trim() !== (user.username ?? '')
  const isChanged = isNameChanged || isUsernameChanged

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setFeedback(null)

    const payload: { name?: string; newUsername?: string } = {}
    if (isNameChanged) payload.name = nameInput.trim()
    if (isUsernameChanged) payload.newUsername = usernameInput.trim()

    if (!payload.name && !payload.newUsername) {
      return
    }

    // Zod client-side validation
    const result = changeUsernameSchema.safeParse({
      name: nameInput.trim(),
      newUsername: usernameInput.trim(),
    })

    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path[0]?.toString() ?? 'form'
        errors[path] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    try {
      setIsSubmitting(true)
      const res = await changeUsername(payload)
      
      const updatedFields: { name?: string; username?: string } = {}
      if (res.user.name) updatedFields.name = res.user.name
      if (res.user.username) updatedFields.username = res.user.username
      
      updateUser(updatedFields)

      setFeedback({
        type: 'success',
        message: res.message || 'Información de perfil actualizada con éxito.',
      })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el perfil.'
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
        description="Gestiona los datos de tu perfil, tu nombre completo y tu nombre de usuario visible en Codenix."
      >
        <div className="flex items-center gap-4">
          <UserAvatar src={user.avatarUrl} name={nameInput || user.name} size="menu" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">{nameInput || user.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">@{usernameInput || user.username}</p>
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

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <SettingsField
            label="Nombre completo"
            htmlFor="settings-account-name"
            description="Tu nombre y apellido visibles en la plataforma."
          >
            <div className="space-y-1.5">
              <SettingsInput
                id="settings-account-name"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value)
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }))
                  if (feedback) setFeedback(null)
                }}
                disabled={isSubmitting}
                placeholder="ej. Alex Ramírez"
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name && (
                <p className="text-xs text-[var(--color-error)]">{fieldErrors.name}</p>
              )}
            </div>
          </SettingsField>

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
                  if (fieldErrors.newUsername) setFieldErrors((prev) => ({ ...prev, newUsername: '' }))
                  if (feedback) setFeedback(null)
                }}
                disabled={isSubmitting}
                placeholder="ej. alex_coder"
                aria-invalid={Boolean(fieldErrors.newUsername)}
              />
              {fieldErrors.newUsername && (
                <p className="text-xs text-[var(--color-error)]">{fieldErrors.newUsername}</p>
              )}
            </div>
          </SettingsField>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isChanged || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Guardando cambios...</span>
                </>
              ) : (
                <span>Guardar cambios de perfil</span>
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
