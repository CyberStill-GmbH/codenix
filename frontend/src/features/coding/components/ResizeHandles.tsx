import { useCallback, useEffect, useRef } from 'react'
import { useWorkspace } from '@/features/coding/context/WorkspaceContext'

export function ResizeHandleHorizontal() {
  const { isCollapsed, isFullscreen, setProblemWidthPercent } = useWorkspace()
  const isDraggingRef = useRef(false)
  const rafRef = useRef<number>(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (isCollapsed || isFullscreen) return
    isDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const containerWidth = document.documentElement.clientWidth
        const newPercent = Math.min(65, Math.max(20, (moveEvent.clientX / containerWidth) * 100))
        // Update CSS variable directly for smooth 60fps
        document.documentElement.style.setProperty('--problem-width', `${newPercent}%`)
      })
    }

    const handlePointerUp = (upEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      
      const containerWidth = document.documentElement.clientWidth
      const newPercent = Math.min(65, Math.max(20, (upEvent.clientX / containerWidth) * 100))
      setProblemWidthPercent(newPercent)
      
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }, [isCollapsed, isFullscreen, setProblemWidthPercent])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (isFullscreen || isCollapsed) return null

  return (
    <div
      role="separator"
      aria-label="Horizontal Resize"
      aria-orientation="vertical"
      className="group relative z-10 flex w-2 shrink-0 cursor-col-resize items-center justify-center outline-none"
      onPointerDown={handlePointerDown}
    >
      <div className="h-full w-0.5 bg-slate-800 transition group-hover:bg-[var(--color-primary)]" />
    </div>
  )
}

export function ResizeHandleVertical() {
  const { isFullscreen, setBottomHeightPx } = useWorkspace()
  const isDraggingRef = useRef(false)
  const rafRef = useRef<number>(0)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    if (isFullscreen) return
    isDraggingRef.current = true
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const containerHeight = document.documentElement.clientHeight
        const newHeight = Math.min(containerHeight * 0.6, Math.max(140, containerHeight - moveEvent.clientY))
        document.documentElement.style.setProperty('--bottom-height', `${newHeight}px`)
      })
    }

    const handlePointerUp = (upEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      
      const containerHeight = document.documentElement.clientHeight
      const newHeight = Math.min(containerHeight * 0.6, Math.max(140, containerHeight - upEvent.clientY))
      setBottomHeightPx(newHeight)
      
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }, [isFullscreen, setBottomHeightPx])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  if (isFullscreen) return null

  return (
    <div
      role="separator"
      aria-label="Vertical Resize"
      aria-orientation="horizontal"
      className="group relative z-10 flex h-2 shrink-0 cursor-row-resize items-center justify-center outline-none"
      onPointerDown={handlePointerDown}
    >
      <div className="h-0.5 w-full bg-slate-800 transition group-hover:bg-[var(--color-primary)]" />
    </div>
  )
}
