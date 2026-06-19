import { apiRequest } from '@/shared/api/apiClient'

type AdminImageUploadResponse = {
  url: string
}

export function uploadAdminProblemImage(file: File) {
  const formData = new FormData()
  formData.set('file', file)

  return apiRequest<AdminImageUploadResponse>('/admin/uploads/images', {
    method: 'POST',
    body: formData,
  })
}
