import { CircleDotDashed, Play, SendHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
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
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isDisabled || isBusy}
        onClick={onRun}
        title="Run (Ctrl+Enter)"
        className="rounded-full"
      >
        {isRunning ? (
          <CircleDotDashed className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{isRunning ? 'Running...' : 'Run'}</span>
      </Button>

      <Button
        type="button"
        variant="success"
        size="sm"
        disabled={isDisabled || isBusy}
        onClick={onSubmit}
        title="Submit (Ctrl+Shift+Enter)"
        className="rounded-full"
      >
        {isSubmitting ? (
          <CircleDotDashed className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <SendHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
      </Button>
    </div>
  )
}
