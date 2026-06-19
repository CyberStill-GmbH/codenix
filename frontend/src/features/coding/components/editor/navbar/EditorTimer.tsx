import { useEffect, useRef, useState } from 'react'
import { Timer, TimerOff } from 'lucide-react'

type EditorTimerProps = {
  problemId: string | number
}

function formatElapsedTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function EditorTimer({ problemId }: EditorTimerProps) {
  const storageKey = `codenix_editor_timer_${problemId}`
  const resetTimeoutRef = useRef<number | null>(null)
  const shouldSkipClickRef = useRef(false)
  const [isRunning, setIsRunning] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    const stored = window.sessionStorage.getItem(storageKey)
    const parsed = Number(stored)
    return Number.isFinite(parsed) ? parsed : 0
  })

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  useEffect(() => {
    window.sessionStorage.setItem(storageKey, String(elapsedSeconds))
  }, [elapsedSeconds, storageKey])

  function resetTimer() {
    shouldSkipClickRef.current = true
    setElapsedSeconds(0)
    setIsRunning(false)
  }

  function handlePointerDown() {
    shouldSkipClickRef.current = false
    resetTimeoutRef.current = window.setTimeout(resetTimer, 500)
  }

  function handlePointerUp() {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
  }

  return (
    <button
      type="button"
      title={isRunning ? 'Pausar cronometro' : 'Reanudar cronometro'}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(event) => {
        event.preventDefault()
        resetTimer()
      }}
      onClick={() => {
        if (shouldSkipClickRef.current) {
          shouldSkipClickRef.current = false
          return
        }

        setIsRunning((current) => !current)
      }}
      className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-slate-950/50 px-2.5 text-xs font-bold text-[var(--color-text-soft)] transition hover:bg-slate-900/80 hover:text-white"
    >
      {isRunning ? (
        <Timer className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <TimerOff className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span className="tabular-nums">{formatElapsedTime(elapsedSeconds)}</span>
    </button>
  )
}
