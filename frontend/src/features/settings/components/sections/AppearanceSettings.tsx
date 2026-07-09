import { Monitor, Moon, Sun } from 'lucide-react'
import type { AppSettings } from '@/features/settings/types/settings.types'
import { SettingsCard } from '@/features/settings/components/SettingsCard'

type ThemeOption = AppSettings['theme']

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

type Props = {
  settings: AppSettings
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

export function AppearanceSettings({ settings, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Tema"
        description="Elige cómo quieres que se vea Codenix."
      >
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
            const isActive = settings.theme === value
            return (
              <button
                key={value}
                id={`settings-theme-${value}`}
                type="button"
                onClick={() => onUpdate('theme', value)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition ${
                  isActive
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'border-slate-700 bg-slate-900 text-[var(--color-text-muted)] hover:border-slate-500 hover:text-white'
                }`}
                aria-pressed={isActive}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
      </SettingsCard>
    </div>
  )
}
