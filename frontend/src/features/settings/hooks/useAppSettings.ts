import { useCallback, useState } from 'react'
import type { AppSettings } from '@/features/settings/types/settings.types'
import { DEFAULT_SETTINGS } from '@/features/settings/types/settings.types'
import { SETTINGS_STORAGE_KEY } from '@/features/settings/constants/settingsSections'

function loadSettings(): AppSettings {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as AppSettings
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: AppSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // localStorage unavailable, fail silently
  }
}

export function useAppSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings)

  const updateSettings = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettingsState((prev) => {
      const next = { ...prev, [key]: value }
      saveSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS)
    setSettingsState(DEFAULT_SETTINGS)
  }, [])

  return { settings, updateSettings, resetSettings }
}
