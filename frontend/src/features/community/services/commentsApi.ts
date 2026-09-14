import { apiConfig, apiRequest } from '@/shared/api/apiClient'

export type PublicComment = {
  id: string
  content: string
  imageUrl: string | null
  score: number
  viewerVote: 'up' | 'down' | null
  createdAt: string
  author: { id: string; username: string; name: string; avatarUrl: string }
  replies: PublicComment[]
}

export async function getComments(problemId: string, sort: 'best' | 'newest' = 'best') {
  return apiRequest<{ data: PublicComment[]; hasMore: boolean; nextCursor: string | null }>(
    `/community/problems/${problemId}/comments?sort=${sort}&limit=20`,
  )
}

export async function createComment(problemId: string, content: string, parentId?: string, imageUrl?: string) {
  return apiRequest<PublicComment>(`/community/problems/${problemId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, parentId, imageUrl }),
  })
}

export async function uploadCommentImage(problemId: string, file: File) {
  const body = new FormData()
  body.append('image', file)
  return apiRequest<{ url: string }>(`/community/problems/${problemId}/comments/images`, { method: 'POST', body })
}

export function resolveCommentImageUrl(url: string) {
  if (!/^\/uploads\/images\/comments\/[a-f0-9-]+\.(?:jpg|png|webp)$/i.test(url)) return ''
  return new URL(url, `${apiConfig.baseUrl.replace(/\/api\/?$/, '')}/`).toString()
}

export async function voteComment(commentId: string, vote: 'up' | 'down') {
  return apiRequest<{ commentId: string; score: number; viewerVote: 'up' | 'down' | null }>(
    `/community/comments/${commentId}/vote`,
    { method: 'POST', body: JSON.stringify({ vote }) },
  )
}
