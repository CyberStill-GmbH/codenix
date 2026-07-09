export type SettingsSectionId =
  | 'general'
  | 'appearance'
  | 'editor'
  | 'account'
  | 'security'

export type AppSettings = {
  // General
  preferredLanguage: string
  timezone: string

  // Appearance
  theme: 'dark' | 'light' | 'system'

  // Editor
  editorFontSize: number
  editorTabSize: number
  editorFontFamily: string
  editorWordWrap: boolean
  editorLigatures: boolean
  editorCursorAnimation: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
}

export const DEFAULT_SETTINGS: AppSettings = {
  preferredLanguage: 'es',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: 'dark',
  editorFontSize: 14,
  editorTabSize: 2,
  editorFontFamily: '"JetBrains Mono", "Cascadia Code", Consolas, monospace',
  editorWordWrap: true,
  editorLigatures: true,
  editorCursorAnimation: 'smooth',
}
