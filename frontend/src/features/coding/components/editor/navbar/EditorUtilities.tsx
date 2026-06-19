import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Columns3, Settings } from 'lucide-react'

import { EditorTimer } from '@/features/coding/components/editor/navbar/EditorTimer'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { UserMenu } from '@/features/user/components/UserMenu'
import type { AuthUser } from '@/features/auth/types/auth.types'

type EditorUtilitiesProps = {
  user: AuthUser | null
  problemId: string | number
}

function DisabledUtilityButton({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title="Próximamente"
      disabled
      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-slate-950/50 text-[var(--color-text-muted)] opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

export function EditorUtilities({ user, problemId }: EditorUtilitiesProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="flex items-center justify-end gap-1.5">
      <div className="hidden items-center gap-1.5 md:flex">
        {/* TODO: MVP-PENDING - selector de layout */}
        <DisabledUtilityButton label="Selector de layout">
          <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
        </DisabledUtilityButton>

        {/* TODO: MVP-PENDING - configuracion del editor */}
        <DisabledUtilityButton label="Configuracion del editor">
          <Settings className="h-3.5 w-3.5" aria-hidden="true" />
        </DisabledUtilityButton>

        <EditorTimer problemId={problemId} />

        <span className="h-6 w-px bg-[var(--color-border-soft)]" />
      </div>

      <div className="relative">
        <button
          ref={userMenuButtonRef}
          type="button"
          className="rounded-full bg-slate-950/50 p-0.5 transition duration-200 hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          aria-label="Abrir menu de usuario"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          onClick={() => setIsUserMenuOpen((current) => !current)}
        >
          <UserAvatar src={user?.avatarUrl} name={user?.name ?? 'Usuario'} size="sm" />
        </button>

        {isUserMenuOpen && user && (
          <div
            className="absolute right-0 top-10"
            role="menu"
            aria-label="Menu de usuario"
          >
            <UserMenu user={user} onClose={() => setIsUserMenuOpen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
