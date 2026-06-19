import type { ReactNode } from 'react'

type StaggerContainerProps = {
  children: ReactNode
  className?: string
}

export function StaggerContainer({ children, className = '' }: StaggerContainerProps) {
  return <div className={`flex flex-col gap-6 ${className}`}>{children}</div>
}
