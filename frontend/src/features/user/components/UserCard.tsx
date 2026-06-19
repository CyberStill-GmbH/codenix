import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { profileSurfaceClassName } from '@/features/user/components/profileStyles'

type UserCardProps<T extends ElementType> = {
  as?: T
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export const userCardClassName =
  `codenix-user-card overflow-hidden rounded-2xl ${profileSurfaceClassName}`

export function UserCard<T extends ElementType = 'section'>({
  as,
  className = '',
  children,
  ...props
}: UserCardProps<T>) {
  const Component = as ?? 'section'

  return (
    <Component className={`${userCardClassName} ${className}`} {...props}>
      <div>{children}</div>
    </Component>
  )
}
