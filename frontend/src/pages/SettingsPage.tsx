import { useState } from 'react'
import { AppNavbar } from '@/shared/components/navigation/AppNavbar'
import { useAuth } from '@/features/auth/context/useAuth'
import { useAppSettings } from '@/features/settings/hooks/useAppSettings'
import { SettingsLayout } from '@/features/settings/components/SettingsLayout'
import { GeneralSettings } from '@/features/settings/components/sections/GeneralSettings'
import { AppearanceSettings } from '@/features/settings/components/sections/AppearanceSettings'
import { EditorSettings } from '@/features/settings/components/sections/EditorSettings'
import { AccountSettings } from '@/features/settings/components/sections/AccountSettings'
import { SecuritySettings } from '@/features/settings/components/sections/SecuritySettings'
import type { SettingsSectionId } from '@/features/settings/types/settings.types'

export function SettingsPage() {
  const { user } = useAuth()
  const { settings, updateSettings, resetSettings } = useAppSettings()
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general')

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings settings={settings} onUpdate={updateSettings} />
      case 'appearance':
        return <AppearanceSettings settings={settings} onUpdate={updateSettings} />
      case 'editor':
        return (
          <EditorSettings
            settings={settings}
            onUpdate={updateSettings}
            onReset={resetSettings}
          />
        )
      case 'account':
        return user ? <AccountSettings user={user} /> : null
      case 'security':
        return <SecuritySettings />
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppNavbar />
      <main className="codenix-app-shell codenix-user-main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Configuración</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Gestiona tus preferencias de Codenix.
          </p>
        </header>

        <SettingsLayout
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        >
          {renderSection()}
        </SettingsLayout>
      </main>
    </div>
  )
}
