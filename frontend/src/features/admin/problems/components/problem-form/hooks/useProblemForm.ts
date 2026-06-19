import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  useWatch,
  type Path,
  type PathValue,
  type Resolver,
} from 'react-hook-form'

import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'
import {
  type ProblemFormErrors,
  problemFormSchema,
  validateProblemForm,
} from '@/features/admin/problems/components/problem-form/utils/problemSchema'

type InternalProblemFormValues = Record<string, unknown>

export function useProblemForm(initialValues: AdminProblemFormValues) {
  const form = useForm<InternalProblemFormValues>({
    defaultValues: initialValues as unknown as InternalProblemFormValues,
    mode: 'onChange',
    resolver: zodResolver(problemFormSchema) as unknown as Resolver<InternalProblemFormValues>,
  })
  const values = useWatch({ control: form.control }) as unknown as AdminProblemFormValues

  const updateField = <Key extends keyof AdminProblemFormValues>(
    field: Key,
    value: AdminProblemFormValues[Key],
  ) => {
    const path = field as Path<InternalProblemFormValues>
    form.setValue(path, value as PathValue<InternalProblemFormValues, typeof path>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const draftErrors = useMemo<ProblemFormErrors>(
    () => validateProblemForm(values, false),
    [values],
  )
  const publishErrors = useMemo<ProblemFormErrors>(
    () => validateProblemForm(values, true),
    [values],
  )

  return {
    form,
    values,
    updateField,
    draftErrors,
    publishErrors,
    hasUnsavedChanges: form.formState.isDirty,
  }
}
