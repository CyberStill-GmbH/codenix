import type { AppSettings } from '@/features/settings/types/settings.types'
import {
  SettingsCard,
  SettingsField,
  SettingsSelect,
} from '@/features/settings/components/SettingsCard'

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

const TIMEZONES = Intl.supportedValuesOf('timeZone').map((tz) => ({
  value: tz,
  label: tz.replace(/_/g, ' '),
}))

type Props = {
  settings: AppSettings
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

export function GeneralSettings({ settings, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Preferencias generales"
        description="Configura el idioma y zona horaria de tu experiencia en Codenix."
      >
        <SettingsField
          label="Idioma"
          description="Idioma de la interfaz."
          htmlFor="settings-language"
        >
          <SettingsSelect
            id="settings-language"
            value={settings.preferredLanguage}
            onChange={(e) => onUpdate('preferredLanguage', e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>

        <SettingsField
          label="Zona horaria"
          description="Usada para mostrar fechas y horas."
          htmlFor="settings-timezone"
        >
          <SettingsSelect
            id="settings-timezone"
            value={settings.timezone}
            onChange={(e) => onUpdate('timezone', e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>
    </div>
  )
}
