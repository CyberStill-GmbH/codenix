import { apiRequest } from '@/shared/api/apiClient'

export type PublicComment = {
  id: string
  content: string
  score: number
  viewerVote: 'up' | 'down' | null
  createdAt: string
  author: { id: string; username: string; name: string; avatarUrl: string }
  replies: PublicComment[]
}

export async function getComments(problemId: string) {
  return apiRequest<{ data: PublicComment[]; hasMore: boolean; nextCursor: string | null }>(
    `/community/problems/${problemId}/comments?sort=best&limit=20`,
  )
}

export async function createComment(problemId: string, content: string, parentId?: string) {
  return apiRequest<PublicComment>(`/community/problems/${problemId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, parentId }),
  })
}

export async function voteComment(commentId: string, vote: 'up' | 'down') {
  return apiRequest<{ commentId: string; score: number; viewerVote: 'up' | 'down' | null }>(
    `/community/comments/${commentId}/vote`,
    { method: 'POST', body: JSON.stringify({ vote }) },
  )
}
