import type { ReactNode } from 'react'

import { Reveal } from '@/components/motion/Reveal'

type PageSectionProps = {
  children: ReactNode
  delay?: 0 | 75 | 100 | 150 | 200 | 300
  className?: string
}

export function PageSection({ children, delay = 0, className = '' }: PageSectionProps) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  )
}
