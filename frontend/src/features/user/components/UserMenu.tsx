import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/useAuth'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import type { User } from '@/features/user/types/user.types'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserMenuAction } from '@/features/user/components/UserMenuAction'
import { USER_MENU_DANGER_ITEMS, USER_MENU_ITEMS } from '@/features/user/constants/userMenuItems'

type UserMenuProps = {
  user: User
  onClose?: () => void
}

export function UserMenu({ user, onClose }: UserMenuProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Close on outside click (pointerdown for fast response)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.()
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  const handleAction = (route?: string) => {
    onClose?.()
    if (route) navigate(route)
  }

  const handleLogout = async () => {
    await logout()
    onClose?.()
    navigate('/login')
  }

  const panelContent = (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Menú de usuario"
      style={{ width: isMobile ? '100%' : '320px', borderRadius: isMobile ? '14px 14px 0 0' : '14px' }}
      className="overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-[var(--shadow-xl)]"
    >
      {/* Header */}
      <div className="flex items-center gap-4 rounded-[var(--radius-lg)] bg-[rgba(7,18,37,0.58)] px-3 py-3">
        <UserAvatar src={user.avatarUrl} name={user.name} size="menu" />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[var(--color-text)]">
            {user.name}
          </p>
          <p className="truncate text-sm text-[var(--color-text-muted)]">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Navigation items — data-driven */}
      <div className="mt-2 space-y-0.5">
        {USER_MENU_ITEMS.filter(
          (item) => !item.requiredRole || item.requiredRole === user.role,
        ).map((item) => (
          <UserMenuAction
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            route={item.route}
            variant={item.variant}
            onClick={() => handleAction(item.route)}
          />
        ))}
      </div>

      {/* Danger zone */}
      <div className="mt-2 border-t border-[var(--color-border-soft)] pt-2 space-y-0.5">
        {USER_MENU_DANGER_ITEMS.map((item) => (
          <UserMenuAction
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            variant={item.variant}
            onClick={handleLogout}
          />
        ))}
      </div>
    </div>
  )

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 animate-[user-menu-slide-up_120ms_ease-out_both]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {panelContent}
        </div>
      </>
    )
  }

  // Desktop: Floating panel (positioning handled by parent)
  return (
    <div className="animate-[user-menu-fade-in_120ms_ease-out_both]">
      {panelContent}
    </div>
  )
}
