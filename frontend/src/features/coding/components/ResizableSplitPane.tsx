import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { readStoredSplitPercent } from '@/features/coding/utils/splitPaneStorage'

type SplitOrientation = 'horizontal' | 'vertical'

type ResizeContext = {
  currentPercent: number
  setPercent: (nextPercent: number) => void
}

type ResizableSplitPaneProps = {
  orientation: SplitOrientation
  storageKey: string
  defaultPrimaryPercent: number
  minPrimaryPx: number
  minSecondaryPx: number
  maxPrimaryPercent?: number
  primary: ReactNode
  secondary: ReactNode
  className?: string
  primaryClassName?: string
  secondaryClassName?: string
  ariaLabel?: string
  primaryPercent?: number
  onPrimaryPercentChange?: (nextPercent: number) => void
  onHandleDoubleClick?: (context: ResizeContext) => void
}

function clampPercent(
  nextPercent: number,
  containerSize: number,
  minPrimaryPx: number,
  minSecondaryPx: number,
  maxPrimaryPercent = 100,
) {
  if (containerSize <= 0) return nextPercent

  const minPrimaryPercent = (minPrimaryPx / containerSize) * 100
  const maxBySecondary = 100 - (minSecondaryPx / containerSize) * 100
  const maxAllowed = Math.min(maxBySecondary, maxPrimaryPercent)

  return Math.min(maxAllowed, Math.max(minPrimaryPercent, nextPercent))
}

function setDocumentDragState(isDragging: boolean, orientation: SplitOrientation) {
  document.body.style.userSelect = isDragging ? 'none' : ''
  document.body.style.cursor = isDragging
    ? orientation === 'horizontal'
      ? 'col-resize'
      : 'row-resize'
    : ''
}

export function ResizableSplitPane({
  orientation,
  storageKey,
  defaultPrimaryPercent,
  minPrimaryPx,
  minSecondaryPx,
  maxPrimaryPercent,
  primary,
  secondary,
  className = '',
  primaryClassName = '',
  secondaryClassName = '',
  ariaLabel = 'Redimensionar paneles',
  primaryPercent,
  onPrimaryPercentChange,
  onHandleDoubleClick,
}: ResizableSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isControlled = primaryPercent !== undefined
  const [internalPercent, setInternalPercent] = useState(() =>
    readStoredSplitPercent(storageKey, defaultPrimaryPercent),
  )
  const activePercent = isControlled ? primaryPercent : internalPercent

  const setPercent = useCallback(
    (nextPercent: number) => {
      const container = containerRef.current
      const containerSize =
        orientation === 'horizontal'
          ? container?.clientWidth ?? 0
          : container?.clientHeight ?? 0
      const clamped = clampPercent(
        nextPercent,
        containerSize,
        minPrimaryPx,
        minSecondaryPx,
        maxPrimaryPercent,
      )

      if (!isControlled) setInternalPercent(clamped)
      onPrimaryPercentChange?.(clamped)
      window.localStorage.setItem(storageKey, String(clamped))
    },
    [
      isControlled,
      maxPrimaryPercent,
      minPrimaryPx,
      minSecondaryPx,
      onPrimaryPercentChange,
      orientation,
      storageKey,
    ],
  )

  useEffect(() => {
    setPercent(activePercent)
  }, [activePercent, setPercent])

  const updateFromPointer = useCallback(
    (event: globalThis.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const nextPercent =
        orientation === 'horizontal'
          ? ((event.clientX - rect.left) / rect.width) * 100
          : ((event.clientY - rect.top) / rect.height) * 100

      setPercent(nextPercent)
    },
    [orientation, setPercent],
  )

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault()
    setDocumentDragState(true, orientation)

    function handlePointerMove(pointerEvent: globalThis.PointerEvent) {
      updateFromPointer(pointerEvent)
    }

    function handlePointerUp() {
      setDocumentDragState(false, orientation)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp, { once: true })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const container = containerRef.current
    if (!container) return

    const containerSize =
      orientation === 'horizontal' ? container.clientWidth : container.clientHeight
    const stepPercent = (10 / containerSize) * 100
    const decreaseKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const increaseKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

    if (event.key === decreaseKey) {
      event.preventDefault()
      setPercent(activePercent - stepPercent)
    }

    if (event.key === increaseKey) {
      event.preventDefault()
      setPercent(activePercent + stepPercent)
    }
  }

  const isHorizontal = orientation === 'horizontal'
  const handleClassName = isHorizontal
    ? 'group relative z-10 flex w-3 shrink-0 cursor-col-resize items-center justify-center outline-none'
    : 'group relative z-10 flex h-3 shrink-0 cursor-row-resize items-center justify-center outline-none'
  const lineClassName = isHorizontal
    ? 'h-full w-px bg-slate-800 transition group-hover:bg-[var(--color-primary)] group-focus-visible:bg-[var(--color-primary)]'
    : 'h-px w-full bg-slate-800 transition group-hover:bg-[var(--color-primary)] group-focus-visible:bg-[var(--color-primary)]'
  const gripClassName = isHorizontal
    ? 'absolute flex flex-col gap-1 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100'
    : 'absolute flex gap-1 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100'

  return (
    <div
      ref={containerRef}
      className={`flex min-h-0 min-w-0 ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
    >
      <div
        className={`min-h-0 min-w-0 overflow-hidden ${primaryClassName}`}
        style={{
          flex: `0 0 ${activePercent}%`,
          minWidth: isHorizontal ? minPrimaryPx : undefined,
          minHeight: isHorizontal ? undefined : minPrimaryPx,
          maxWidth:
            isHorizontal && maxPrimaryPercent
              ? `${maxPrimaryPercent}%`
              : undefined,
        }}
      >
        {primary}
      </div>

      <div
        role="separator"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(activePercent)}
        className={handleClassName}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onDoubleClick={() =>
          onHandleDoubleClick?.({
            currentPercent: activePercent,
            setPercent,
          })
        }
      >
        <span className={lineClassName} />
        <span className={gripClassName} aria-hidden="true">
          <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
          <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
          <span className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
        </span>
      </div>

      <div
        className={`min-h-0 min-w-0 flex-1 overflow-hidden ${secondaryClassName}`}
        style={{
          minWidth: isHorizontal ? minSecondaryPx : undefined,
          minHeight: isHorizontal ? undefined : minSecondaryPx,
        }}
      >
        {secondary}
      </div>
    </div>
  )
}
