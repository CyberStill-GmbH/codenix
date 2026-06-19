import { ProblemForm } from '@/features/admin/problems/components/problem-form'
import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'

type AdminProblemFormProps = {
  initialValues: AdminProblemFormValues
  mode: 'create' | 'edit'
  isSaving: boolean
  onSubmit: (values: AdminProblemFormValues) => Promise<void>
  onCancel: () => void
}

const tagSuggestions = [
  'Array',
  'Hash Map',
  'String',
  'Graph',
  'Dynamic Programming',
  'Greedy',
  'Sorting',
  'Binary Search',
  'Sliding Window',
]

export function AdminProblemForm(props: AdminProblemFormProps) {
  return <ProblemForm {...props} tagSuggestions={tagSuggestions} />
}
