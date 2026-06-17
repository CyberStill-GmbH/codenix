import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type UserCardProps<T extends ElementType> = {
  as?: T
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export const userCardClassName =
  'codenix-user-card overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 shadow-[0_18px_50px_rgba(2,8,23,0.28)]'

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
