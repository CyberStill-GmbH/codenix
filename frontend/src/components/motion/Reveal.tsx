import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: 0 | 75 | 100 | 150 | 200 | 300
  className?: string
}

const delayClassName: Record<NonNullable<RevealProps['delay']>, string> = {
  0: 'motion-safe:delay-0',
  75: 'motion-safe:delay-75',
  100: 'motion-safe:delay-100',
  150: 'motion-safe:delay-150',
  200: 'motion-safe:delay-200',
  300: 'motion-safe:delay-300',
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  return (
    <div
      className={`motion-safe:animate-[codenix-reveal_420ms_cubic-bezier(0.22,1,0.36,1)_both] ${delayClassName[delay]} ${className}`}
    >
      {children}
    </div>
  )
}
