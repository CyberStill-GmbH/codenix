import { EditorActions } from '@/features/coding/components/editor/navbar/EditorActions'
import { EditorUtilities } from '@/features/coding/components/editor/navbar/EditorUtilities'
import { ProblemNavigator } from '@/features/coding/components/editor/navbar/ProblemNavigator'
import type { AuthUser } from '@/features/auth/types/auth.types'
import type { Problem } from '@/features/problems/types/problem.types'

type EditorNavbarProps = {
  problemId: string | number
  user: AuthUser | null
  previousProblem?: Problem
  nextProblem?: Problem
  canNavigateRandom: boolean
  isRunning: boolean
  isSubmitting: boolean
  isEditorEmpty: boolean
  onRun: () => void
  onSubmit: () => void
  onNavigateToProblem: (slug: string) => void
  onNavigateToRandomProblem: () => void
}

export function EditorNavbar({
  problemId,
  user,
  previousProblem,
  nextProblem,
  canNavigateRandom,
  isRunning,
  isSubmitting,
  isEditorEmpty,
  onRun,
  onSubmit,
  onNavigateToProblem,
  onNavigateToRandomProblem,
}: EditorNavbarProps) {
  return (
    <header className="relative z-10 shrink-0 border-b border-[var(--color-border-soft)] bg-[var(--color-navbar-bg)]">
      <nav
        className="grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 md:px-4"
        aria-label="Navegacion del editor de problemas"
      >
        <ProblemNavigator
          previousProblem={previousProblem}
          nextProblem={nextProblem}
          canNavigateRandom={canNavigateRandom}
          onNavigateToProblem={onNavigateToProblem}
          onNavigateToRandomProblem={onNavigateToRandomProblem}
        />

        <EditorActions
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          isDisabled={isEditorEmpty}
          onRun={onRun}
          onSubmit={onSubmit}
        />

        <EditorUtilities user={user} problemId={problemId} />
      </nav>
    </header>
  )
}
