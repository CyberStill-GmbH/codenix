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
    if (isMobile) return

    const handlePointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.()
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [isMobile, onClose])

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
      id="app-user-menu"
      ref={panelRef}
      role="menu"
      aria-label="Menú de usuario"
      className={`user-menu-panel ${
        isMobile ? 'user-menu-panel--mobile' : 'user-menu-panel--desktop'
      }`}
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
          className="user-menu-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
        {/* Sheet */}
        <div className="user-menu-sheet">
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
