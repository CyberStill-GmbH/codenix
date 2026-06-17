import type { ReactNode } from 'react'

type SectionContainerProps = {
  children: ReactNode
  /** Clase extra para padding vertical de la sección (ej. "py-14 sm:py-20") */
  className?: string
}

/**
 * Wrapper interior de sección: aplica max-width y padding horizontal consistente.
 * El <section> padre (con id, aria-labelledby y background) va en cada componente.
 */
export function SectionContainer({ children, className = '' }: SectionContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
