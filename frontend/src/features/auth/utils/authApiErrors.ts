import { ApiError } from '@/shared/api/apiClient'

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message
  }

  return error instanceof Error ? error.message : fallback
}

export function getApiFieldErrors<TFields extends string>(
  error: unknown,
  fields: readonly TFields[],
) {
  const nextErrors: Partial<Record<TFields, string>> = {}

  if (!(error instanceof ApiError)) return nextErrors

  for (const issue of error.details?.issues ?? []) {
    const field = issue.path?.[0]

    if (typeof field === 'string' && fields.includes(field as TFields) && issue.message) {
      nextErrors[field as TFields] = issue.message
    }
  }

  return nextErrors
}
