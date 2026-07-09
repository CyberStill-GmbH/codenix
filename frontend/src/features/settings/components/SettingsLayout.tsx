import type { ReactNode } from 'react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { SETTINGS_SECTIONS } from '@/features/settings/constants/settingsSections'
import type { SettingsSectionId } from '@/features/settings/types/settings.types'

type SettingsLayoutProps = {
  activeSection: SettingsSectionId
  onSectionChange: (id: SettingsSectionId) => void
  children: ReactNode
}

export function SettingsLayout({ activeSection, onSectionChange, children }: SettingsLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  const sidebar = (
    <nav
      aria-label="Configuración"
      className="flex flex-col gap-0.5"
      style={{ width: isMobile ? '100%' : '280px' }}
    >
      {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            id={`settings-nav-${id}`}
            type="button"
            onClick={() => onSectionChange(id)}
            className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
              isActive
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:bg-slate-800 hover:text-[var(--color-text)]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </nav>
  )

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="flex overflow-x-auto gap-1 pb-1 -mx-1 px-1 scrollbar-none">
          {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                id={`settings-tab-${id}`}
                type="button"
                onClick={() => onSectionChange(id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:bg-slate-800 hover:text-[var(--color-text)]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
        <main>{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 gap-8">
      <div className="hidden shrink-0 md:block" style={{ width: '280px' }}>
        {sidebar}
      </div>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
