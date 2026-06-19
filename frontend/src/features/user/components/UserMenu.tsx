import { LogOut, Send, Settings, TrendingUp, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/useAuth'
import type { User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserMenuAction } from '@/features/user/components/UserMenuAction'

type UserMenuProps = {
  user: User
  onClose?: () => void
}

export function UserMenu({ user, onClose }: UserMenuProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleAction = () => {
    onClose?.()
  }

  const handleLogout = async () => {
    await logout()
    onClose?.()
    navigate('/login')
  }

  return (
    <div className="w-72 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-[var(--shadow-xl)]">
      <div className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[rgba(7,18,37,0.58)] px-3 py-3">
        <UserAvatar src={user.avatarUrl} name={user.name} size="lg" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">
            {user.name}
          </p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            Practica algoritmos y mide tu progreso.
          </p>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <UserMenuAction
          icon={UserRound}
          label="Mi perfil"
          onClick={handleAction}
        />
        <UserMenuAction
          icon={TrendingUp}
          label="Progreso"
          onClick={handleAction}
        />
        <UserMenuAction
          icon={Send}
          label="Envíos"
          onClick={handleAction}
        />
        <UserMenuAction
          icon={Settings}
          label="Configuración"
          onClick={handleAction}
        />
      </div>

      <div className="mt-2 border-t border-[var(--color-border-soft)] pt-2">
        <UserMenuAction
          icon={LogOut}
          label="Cerrar sesión"
          variant="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
  )
}
