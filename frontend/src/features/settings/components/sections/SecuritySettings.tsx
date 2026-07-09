import { SettingsCard, SettingsField } from '@/features/settings/components/SettingsCard'
import { Lock, Smartphone } from 'lucide-react'

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Contraseña"
        description="Cambia tu contraseña para mantener tu cuenta segura."
      >
        <SettingsField
          label="Contraseña actual"
          htmlFor="settings-security-current-pw"
        >
          <input
            id="settings-security-current-pw"
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[var(--color-text)] opacity-60 outline-none"
          />
        </SettingsField>
        <SettingsField
          label="Nueva contraseña"
          htmlFor="settings-security-new-pw"
        >
          <input
            id="settings-security-new-pw"
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-[var(--color-text)] opacity-60 outline-none"
          />
        </SettingsField>
        <p className="text-xs text-[var(--color-text-muted)]">
          El cambio de contraseña estará disponible próximamente.
        </p>
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
