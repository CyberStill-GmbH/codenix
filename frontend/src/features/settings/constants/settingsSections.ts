import type { SettingsSectionId } from '@/features/settings/types/settings.types'
import { Globe, Palette, Code2, UserRound, Shield } from 'lucide-react'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

export type SettingsSectionConfig = {
  id: SettingsSectionId
  label: string
  icon: ComponentType<LucideProps>
}

export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'editor', label: 'Editor', icon: Code2 },
  { id: 'account', label: 'Cuenta', icon: UserRound },
  { id: 'security', label: 'Seguridad', icon: Shield },
]

export const SETTINGS_STORAGE_KEY = 'codenix_app_settings'
