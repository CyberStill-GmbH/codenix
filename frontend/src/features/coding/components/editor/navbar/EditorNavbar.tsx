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
    <header className="sticky top-0 z-50 bg-[var(--color-navbar-bg)] backdrop-blur-xl">
      <nav
        className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-2 px-2 md:px-3"
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
