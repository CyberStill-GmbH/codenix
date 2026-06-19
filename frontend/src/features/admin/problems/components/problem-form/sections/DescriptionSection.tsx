import { useState } from 'react'

import type { AdminProblemFormValues } from '@/features/admin/problems/types/problem.types'
import { FormSection } from '@/features/admin/problems/components/problem-form/components/FormSection'
import { MarkdownEditor } from '@/features/admin/problems/components/problem-form/components/MarkdownEditor'
import type { ProblemFormErrors } from '@/features/admin/problems/components/problem-form/utils/problemSchema'
import { uploadAdminProblemImage } from '@/features/admin/problems/services/adminUploads.service'

type DescriptionSectionProps = {
  value: string
  error?: ProblemFormErrors['descriptionMarkdown']
  onChange: (value: AdminProblemFormValues['descriptionMarkdown']) => void
}

export function DescriptionSection({ value, error, onChange }: DescriptionSectionProps) {
  const [uploadError, setUploadError] = useState('')

  async function handleUploadImage(file: File) {
    try {
      setUploadError('')
      const response = await uploadAdminProblemImage(file)
      return response.url
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'No pudimos subir la imagen.'
      setUploadError(message)
      throw requestError
    }
  }

  return (
    <FormSection
      title="Descripcion Markdown"
      description="El enunciado vive en Markdown. Los testcases estructurados van separados."
    >
      <MarkdownEditor value={value} onChange={onChange} onUploadImage={handleUploadImage} />
      {error && (
        <p className="mt-2 text-xs font-semibold text-[var(--color-error)]">{error}</p>
      )}
      {uploadError && (
        <p className="mt-2 text-xs font-semibold text-[var(--color-error)]">{uploadError}</p>
      )}
      <p className="mt-3 text-xs text-[var(--color-text-subtle)]">
        Puedes subir JPEG, PNG, WEBP o GIF de hasta 2MB.
      </p>
    </FormSection>
  )
}
