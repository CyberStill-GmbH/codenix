import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import type { User } from '@/features/user/types/user.types'

export type UserMenuItemVariant = 'default' | 'danger'

export type UserMenuItem = {
  id: string
  label: string
  icon: ComponentType<LucideProps>
  route?: string
  onClick?: () => void
  variant?: UserMenuItemVariant
  requiredRole?: User['role']
}
