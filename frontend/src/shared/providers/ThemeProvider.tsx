import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppSettings } from '@/features/settings/types/settings.types'
import { SETTINGS_STORAGE_KEY } from '@/features/settings/constants/settingsSections'

type Theme = AppSettings['theme']

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved)
}

function loadThemeFromStorage(): Theme {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return 'dark'
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    if (parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system') {
      return parsed.theme
    }
  } catch {
    // ignore
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => loadThemeFromStorage())
  const resolved = resolveTheme(theme)

  // Apply data-theme to <html> on every theme change
  useEffect(() => {
    applyTheme(resolveTheme(theme))
  }, [theme])

  // Listen for OS-level theme changes when in "system" mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange() {
      if (theme === 'system') {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  function setTheme(next: Theme) {
    setThemeState(next)
    // Also persist into the shared settings key so useAppSettings stays in sync
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
      const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({ ...existing, theme: next }),
      )
    } catch {
      // ignore
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
