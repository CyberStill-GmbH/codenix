import { useEffect, useMemo, useState } from 'react'
import { Eye, Save, Send, X } from 'lucide-react'

import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'
import { ProblemDescription } from '@/features/admin/problems/components/ProblemDescription'
import { BasicInfoSection } from '@/features/admin/problems/components/problem-form/sections/BasicInfoSection'
import { ConstraintsSection } from '@/features/admin/problems/components/problem-form/sections/ConstraintsSection'
import { DescriptionSection } from '@/features/admin/problems/components/problem-form/sections/DescriptionSection'
import { ExamplesSection } from '@/features/admin/problems/components/problem-form/sections/ExamplesSection'
import { SettingsSection } from '@/features/admin/problems/components/problem-form/sections/SettingsSection'
import { StarterCodeSection } from '@/features/admin/problems/components/problem-form/sections/StarterCodeSection'
import { TestcasesSection } from '@/features/admin/problems/components/problem-form/sections/TestcasesSection'
import { useProblemForm } from '@/features/admin/problems/components/problem-form/hooks/useProblemForm'
import { validateProblemForm } from '@/features/admin/problems/components/problem-form/utils/problemSchema'
import { toBackendProblemPayload } from '@/features/admin/problems/utils/problemPayload'

type ProblemFormProps = {
  initialValues: AdminProblemFormValues
  mode: 'create' | 'edit'
  isSaving: boolean
  tagSuggestions: string[]
  onSubmit: (values: AdminProblemFormValues) => Promise<void>
  onCancel: () => void
}

export function ProblemForm({
  initialValues,
  mode,
  isSaving,
  tagSuggestions,
  onSubmit,
  onCancel,
}: ProblemFormProps) {
  const { values, updateField, publishErrors, hasUnsavedChanges } =
    useProblemForm(initialValues)
  const [submitErrors, setSubmitErrors] = useState<string[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const errorSummary = useMemo(
    () => Object.values(publishErrors).filter(Boolean) as string[],
    [publishErrors],
  )

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  async function saveDraft() {
    const criticalErrors = validateProblemForm(values, false)
    if (Object.keys(criticalErrors).length > 0) {
      setSubmitErrors(Object.values(criticalErrors).filter(Boolean) as string[])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const draftValues = { ...values, status: 'draft' as const }
    window.localStorage.setItem('codenix_admin_problem_draft', JSON.stringify(draftValues))
    await onSubmit(draftValues)
  }

  async function publish() {
    if (errorSummary.length > 0) {
      setSubmitErrors(errorSummary)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const publishedValues = { ...values, status: 'published' as const }
    window.localStorage.setItem(
      'codenix_admin_problem_last_payload',
      JSON.stringify(toBackendProblemPayload(publishedValues), null, 2),
    )
    await onSubmit(publishedValues)
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-30 rounded-xl border border-slate-700/50 bg-slate-950/90 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.34)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[var(--color-text)]">
              {mode === 'create' ? 'Nuevo problema' : 'Editar problema'}
              {hasUnsavedChanges && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-[var(--color-warning)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
                  Cambios sin guardar
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onCancel} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 px-4 text-sm font-bold text-[var(--color-text-soft)]">
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 px-4 text-sm font-bold text-[var(--color-text-soft)]">
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button type="button" disabled={isSaving} onClick={saveDraft} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-sm font-bold text-[var(--color-text-soft)] disabled:opacity-60">
              <Save className="h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar borrador'}
            </button>
            <button type="button" disabled={isSaving} onClick={publish} className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-success-soft)] px-4 text-sm font-bold text-[var(--color-success)] disabled:opacity-60">
              <Send className="h-4 w-4" />
              {isSaving ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>

        {submitErrors.length > 0 && (
          <div className="mt-3 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-3 text-sm font-semibold text-[var(--color-error)]">
            {submitErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <BasicInfoSection
        values={values}
        errors={publishErrors}
        tagSuggestions={tagSuggestions}
        onChange={updateField}
      />
      <DescriptionSection
        value={values.descriptionMarkdown}
        error={publishErrors.descriptionMarkdown}
        onChange={(value) => updateField('descriptionMarkdown', value)}
      />
      <ExamplesSection
        examples={values.examples}
        error={publishErrors.examples}
        onChange={(examples) => updateField('examples', examples)}
      />
      <ConstraintsSection
        constraints={values.constraintsList}
        onChange={(constraints) => {
          updateField('constraintsList', constraints)
          updateField('constraints', constraints.join('\n'))
        }}
      />
      <TestcasesSection
        parameters={values.parameters}
        outputType={values.outputType}
        testcases={values.testcases}
        error={publishErrors.testcases}
        onParametersChange={(parameters) => updateField('parameters', parameters)}
        onOutputTypeChange={(outputType) => updateField('outputType', outputType)}
        onTestcasesChange={(testcases) => updateField('testcases', testcases)}
      />
      <StarterCodeSection
        supportedLanguages={values.supportedLanguages}
        starterCode={values.starterCode}
        onChange={(starterCode) => updateField('starterCode', starterCode)}
      />
      <SettingsSection
        timeLimitMs={values.timeLimitMs}
        memoryLimitMb={values.memoryLimitMb}
        status={values.status}
        timeError={publishErrors.timeLimitMs}
        memoryError={publishErrors.memoryLimitMb}
        onTimeLimitChange={(value) => updateField('timeLimitMs', value)}
        onMemoryLimitChange={(value) => updateField('memoryLimitMb', value)}
        onStatusChange={(status) => updateField('status', status)}
      />

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <h2 className="font-display text-xl font-bold text-[var(--color-text)]">
                Preview del problema
              </h2>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="h-9 w-9 rounded-lg hover:bg-slate-900" aria-label="Cerrar preview">
                <X className="mx-auto h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-5">
              <ProblemDescription markdown={values.descriptionMarkdown} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
