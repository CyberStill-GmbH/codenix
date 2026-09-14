import { useEffect, useRef, useState } from 'react'
import { Clock3, Pause, Play, RotateCcw, Timer } from 'lucide-react'

type EditorTimerProps = { problemId: string | number }
type StoredTimer = { durationSeconds: number; remainingSeconds: number; isRunning: boolean }
const PRESETS = [15, 30, 45, 60]

function formatTime(totalSeconds: number) {
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`
}

export function EditorTimer({ problemId }: EditorTimerProps) {
  const storageKey = `codenix_editor_timer_${problemId}`
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const [isFinishedNoticeVisible, setIsFinishedNoticeVisible] = useState(false)
  const [timer, setTimer] = useState<StoredTimer>(() => {
    try {
      const raw = window.sessionStorage.getItem(storageKey)
      const parsed = raw ? (JSON.parse(raw) as Partial<StoredTimer>) : {}
      if (!Number.isFinite(parsed.durationSeconds) || !Number.isFinite(parsed.remainingSeconds)) {
        return { durationSeconds: 0, remainingSeconds: 0, isRunning: false }
      }
      return {
        durationSeconds: Math.max(0, parsed.durationSeconds ?? 0),
        remainingSeconds: Math.max(0, parsed.remainingSeconds ?? 0),
        isRunning: Boolean(parsed.isRunning) && (parsed.remainingSeconds ?? 0) > 0,
      }
    } catch {
      return { durationSeconds: 0, remainingSeconds: 0, isRunning: false }
    }
  })

  useEffect(() => {
    if (!timer.isRunning) return
    const intervalId = window.setInterval(() => {
      setTimer((current) => {
        const remainingSeconds = Math.max(0, current.remainingSeconds - 1)
        if (remainingSeconds === 0) setIsFinishedNoticeVisible(true)
        return { ...current, remainingSeconds, isRunning: remainingSeconds > 0 }
      })
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [timer.isRunning])

  useEffect(() => {
    window.sessionStorage.setItem(storageKey, JSON.stringify(timer))
  }, [storageKey, timer])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  const startTimer = (minutes: number) => {
    const durationSeconds = Math.max(1, Math.round(minutes * 60))
    setTimer({ durationSeconds, remainingSeconds: durationSeconds, isRunning: true })
    setIsFinishedNoticeVisible(false)
    setCustomMinutes('')
    setIsOpen(false)
  }
  const resetTimer = () => setTimer({ durationSeconds: 0, remainingSeconds: 0, isRunning: false })
  const hasTimer = timer.durationSeconds > 0
  const isPaused = hasTimer && !timer.isRunning && timer.remainingSeconds > 0
  const label = hasTimer ? formatTime(timer.remainingSeconds) : 'Tiempo'

  return (
    <div ref={rootRef} className="relative">
      {isFinishedNoticeVisible && (
        <div className="absolute right-0 top-11 z-[60] w-64 rounded-xl border border-[var(--color-warning)]/40 bg-[var(--color-surface-elevated)] px-3 py-2.5 text-xs shadow-[var(--shadow-lg)]" role="status">
          <p className="font-semibold text-[var(--color-warning)]">Tiempo finalizado</p>
          <p className="mt-0.5 text-[var(--color-text-muted)]">Tómate un momento y revisa tu solución.</p>
          <button type="button" onClick={() => setIsFinishedNoticeVisible(false)} className="mt-2 text-xs font-semibold text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">Cerrar aviso</button>
        </div>
      )}
      <button
        type="button"
        title={hasTimer ? 'Configurar temporizador' : 'Establecer temporizador'}
        aria-label={hasTimer ? `Temporizador: ${label}` : 'Establecer temporizador'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border px-2.5 text-xs font-bold tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${hasTimer ? 'border-[var(--color-primary)]/35 bg-[var(--color-primary-soft)] text-[var(--color-text)]' : 'border-transparent bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]'}`}
      >
        <Timer className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label}</span>
      </button>
      {isOpen && (
        <div role="dialog" aria-label="Configurar temporizador" className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 text-[var(--color-text)] shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Temporizador</p><p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Elige cuánto tiempo practicar.</p></div><Clock3 className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" /></div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">{PRESETS.map((minutes) => <button key={minutes} type="button" onClick={() => startTimer(minutes)} className="rounded-lg border border-[var(--color-border)] px-2 py-2 text-xs font-semibold text-[var(--color-text-soft)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">{minutes}m</button>)}</div>
          <form className="mt-2 flex gap-2" onSubmit={(event) => { event.preventDefault(); const minutes = Number(customMinutes); if (Number.isFinite(minutes) && minutes > 0) startTimer(minutes) }}>
            <label className="sr-only" htmlFor={`timer-minutes-${problemId}`}>Minutos personalizados</label>
            <input id={`timer-minutes-${problemId}`} type="number" min="1" max="180" inputMode="numeric" value={customMinutes} onChange={(event) => setCustomMinutes(event.target.value)} placeholder="Minutos" className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]" />
            <button type="submit" className="inline-flex h-9 items-center gap-1 rounded-lg bg-[var(--color-primary)] px-2.5 text-xs font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Play className="h-3 w-3" aria-hidden="true" />Iniciar</button>
          </form>
          {hasTimer && <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-3"><button type="button" onClick={() => setTimer((current) => ({ ...current, isRunning: !current.isRunning }))} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">{isPaused ? <Play className="h-3 w-3" aria-hidden="true" /> : <Pause className="h-3 w-3" aria-hidden="true" />}{isPaused ? 'Continuar' : 'Pausar'}</button><button type="button" onClick={resetTimer} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><RotateCcw className="h-3 w-3" aria-hidden="true" />Reiniciar</button></div>}
        </div>
      )}
    </div>
  )
}
