import type { User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { SettingsCard, SettingsField, SettingsInput } from '@/features/settings/components/SettingsCard'

type Props = {
  user: User
}

export function AccountSettings({ user }: Props) {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Información de la cuenta"
        description="Estos datos son administrados por el servidor. Los cambios se reflejarán al recargar."
      >
        <div className="flex items-center gap-4">
          <UserAvatar src={user.avatarUrl} name={user.name} size="menu" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">{user.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">@{user.username}</p>
          </div>
        </div>

        <SettingsField
          label="Nombre"
          htmlFor="settings-account-name"
          description="Tu nombre visible en Codenix."
        >
          <SettingsInput
            id="settings-account-name"
            type="text"
            defaultValue={user.name}
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </SettingsField>

        <SettingsField
          label="Nombre de usuario"
          htmlFor="settings-account-username"
        >
          <SettingsInput
            id="settings-account-username"
            type="text"
            defaultValue={user.username}
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </SettingsField>

        <SettingsField
          label="Correo electrónico"
          htmlFor="settings-account-email"
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

      <p className="text-xs text-[var(--color-text-muted)]">
        La edición de perfil estará disponible próximamente.
      </p>
    </div>
  )
}
