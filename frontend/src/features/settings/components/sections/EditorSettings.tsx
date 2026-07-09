import type { AppSettings } from '@/features/settings/types/settings.types'
import {
  SettingsCard,
  SettingsField,
  SettingsInput,
  SettingsSelect,
  SettingsToggle,
} from '@/features/settings/components/SettingsCard'

const FONT_FAMILIES = [
  { value: '"JetBrains Mono", "Cascadia Code", Consolas, monospace', label: 'JetBrains Mono' },
  { value: '"Fira Code", Consolas, monospace', label: 'Fira Code' },
  { value: 'Consolas, monospace', label: 'Consolas' },
  { value: '"Courier New", monospace', label: 'Courier New' },
]

const CURSOR_ANIMATIONS: { value: AppSettings['editorCursorAnimation']; label: string }[] = [
  { value: 'smooth', label: 'Suave' },
  { value: 'blink', label: 'Parpadeo' },
  { value: 'phase', label: 'Fase' },
  { value: 'expand', label: 'Expansión' },
  { value: 'solid', label: 'Sólido' },
]

type Props = {
  settings: AppSettings
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  onReset: () => void
}

export function EditorSettings({ settings, onUpdate, onReset }: Props) {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Tipografía y tamaño"
        description="Controla la fuente y el tamaño del texto en el editor de código."
      >
        <SettingsField
          label="Familia tipográfica"
          htmlFor="settings-editor-font-family"
        >
          <SettingsSelect
            id="settings-editor-font-family"
            value={settings.editorFontFamily}
            onChange={(e) => onUpdate('editorFontFamily', e.target.value)}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>

        <SettingsField
          label="Tamaño de fuente"
          description="En píxeles (12–24)."
          htmlFor="settings-editor-font-size"
        >
          <SettingsInput
            id="settings-editor-font-size"
            type="number"
            min={12}
            max={24}
            value={settings.editorFontSize}
            onChange={(e) => onUpdate('editorFontSize', Number(e.target.value))}
          />
        </SettingsField>

        <SettingsField
          label="Tamaño de tabulación"
          description="Espacios por tab (2 o 4)."
          htmlFor="settings-editor-tab-size"
        >
          <SettingsSelect
            id="settings-editor-tab-size"
            value={settings.editorTabSize}
            onChange={(e) => onUpdate('editorTabSize', Number(e.target.value))}
          >
            <option value={2}>2 espacios</option>
            <option value={4}>4 espacios</option>
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>

      <SettingsCard title="Comportamiento del editor">
        <SettingsField
          label="Ajuste de línea"
          description="Envuelve las líneas largas al ancho del panel."
          htmlFor="settings-editor-word-wrap"
        >
          <SettingsToggle
            id="settings-editor-word-wrap"
            checked={settings.editorWordWrap}
            onChange={(v) => onUpdate('editorWordWrap', v)}
            label="Activar ajuste de línea"
          />
        </SettingsField>

        <SettingsField
          label="Ligaduras"
          description="Activa las ligaduras tipográficas (requiere JetBrains Mono o Fira Code)."
          htmlFor="settings-editor-ligatures"
        >
          <SettingsToggle
            id="settings-editor-ligatures"
            checked={settings.editorLigatures}
            onChange={(v) => onUpdate('editorLigatures', v)}
            label="Activar ligaduras"
          />
        </SettingsField>

        <SettingsField
          label="Animación del cursor"
          htmlFor="settings-editor-cursor"
        >
          <SettingsSelect
            id="settings-editor-cursor"
            value={settings.editorCursorAnimation}
            onChange={(e) =>
              onUpdate(
                'editorCursorAnimation',
                e.target.value as AppSettings['editorCursorAnimation'],
              )
            }
          >
            {CURSOR_ANIMATIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>
      </SettingsCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-error)] hover:text-[var(--color-error)]"
        >
          Restaurar valores por defecto
        </button>
      </div>
    </div>
  )
}
