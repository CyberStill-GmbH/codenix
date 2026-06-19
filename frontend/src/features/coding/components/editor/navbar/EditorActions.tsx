import { CircleDotDashed, Play, SendHorizontal } from 'lucide-react'

type EditorActionsProps = {
  isRunning: boolean
  isSubmitting: boolean
  isDisabled: boolean
  onRun: () => void
  onSubmit: () => void
}

export function EditorActions({
  isRunning,
  isSubmitting,
  isDisabled,
  onRun,
  onSubmit,
}: EditorActionsProps) {
  const isBusy = isRunning || isSubmitting

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={isDisabled || isBusy}
        onClick={onRun}
        title="Run (Ctrl+Enter)"
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-950/65 px-3 text-xs font-bold text-[var(--color-text-soft)] transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-950/65 disabled:hover:text-[var(--color-text-soft)]"
      >
        {isRunning ? (
          <CircleDotDashed className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{isRunning ? 'Running...' : 'Run'}</span>
      </button>

      <button
        type="button"
        disabled={isDisabled || isBusy}
        onClick={onSubmit}
        title="Submit (Ctrl+Shift+Enter)"
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--color-success-soft)] px-3 text-xs font-bold text-[var(--color-success)] transition hover:bg-[var(--color-success)]/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--color-success-soft)]"
      >
        {isSubmitting ? (
          <CircleDotDashed className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <SendHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
      </button>
    </div>
  )
}
