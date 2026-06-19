import type { KeyboardEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Group,
  Panel,
  Separator,
  useGroupRef,
  type Layout,
} from 'react-resizable-panels'

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
  const groupRef = useGroupRef()
  const isControlled = primaryPercent !== undefined
  const primaryId = `${storageKey}-primary`
  const secondaryId = `${storageKey}-secondary`
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
      groupRef.current?.setLayout({
        [primaryId]: clamped,
        [secondaryId]: 100 - clamped,
      })
    },
    [
      groupRef,
      isControlled,
      maxPrimaryPercent,
      minPrimaryPx,
      minSecondaryPx,
      onPrimaryPercentChange,
      orientation,
      primaryId,
      secondaryId,
      storageKey,
    ],
  )

  useEffect(() => {
    groupRef.current?.setLayout({
      [primaryId]: activePercent,
      [secondaryId]: 100 - activePercent,
    })
  }, [activePercent, groupRef, primaryId, secondaryId])

  function handlePointerDown() {
    setDocumentDragState(true, orientation)

    function handlePointerUp() {
      setDocumentDragState(false, orientation)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointerup', handlePointerUp, { once: true })
    window.addEventListener('pointercancel', handlePointerUp, { once: true })
  }

  function handleLayoutChanged(layout: Layout) {
    const nextPercent = layout[primaryId]
    if (!Number.isFinite(nextPercent)) return

    if (!isControlled) setInternalPercent(nextPercent)
    onPrimaryPercentChange?.(nextPercent)
    window.localStorage.setItem(storageKey, String(nextPercent))
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
    <Group
      elementRef={containerRef}
      groupRef={groupRef}
      id={storageKey}
      orientation={orientation}
      defaultLayout={{
        [primaryId]: activePercent,
        [secondaryId]: 100 - activePercent,
      }}
      onLayoutChanged={handleLayoutChanged}
      resizeTargetMinimumSize={{ coarse: 24, fine: 8 }}
      className={`min-h-0 min-w-0 ${className}`}
    >
      <Panel
        id={primaryId}
        defaultSize={`${activePercent}%`}
        minSize={`${minPrimaryPx}px`}
        maxSize={maxPrimaryPercent ? `${maxPrimaryPercent}%` : undefined}
        className={`min-h-0 min-w-0 overflow-hidden ${primaryClassName}`}
      >
        {primary}
      </Panel>

      <Separator
        id={`${storageKey}-separator`}
        aria-label={ariaLabel}
        disableDoubleClick
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
      </Separator>

      <Panel
        id={secondaryId}
        defaultSize={`${100 - activePercent}%`}
        minSize={`${minSecondaryPx}px`}
        className={`min-h-0 min-w-0 flex-1 overflow-hidden ${secondaryClassName}`}
      >
        {secondary}
      </Panel>
    </Group>
  )
}
