import React from 'react'

type TooltipProps = {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex items-center" title={content}>
      {children}
    </div>
  )
}
