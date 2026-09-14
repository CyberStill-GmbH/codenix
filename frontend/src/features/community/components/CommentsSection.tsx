import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, MessageCircle, Send } from 'lucide-react'
import { createComment, getComments, voteComment, type PublicComment } from '@/features/community/services/commentsApi'

type CommentsSectionProps = { problemId?: string }

function CommentCard({ comment, onVote }: { comment: PublicComment; onVote: (id: string, vote: 'up' | 'down') => void }) {
  return (
    <article className="border-b border-[var(--color-border-soft)] py-4 last:border-b-0">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1 text-xs font-bold text-[var(--color-text-muted)]">
          <button type="button" aria-label="Votar positivo" onClick={() => onVote(comment.id, 'up')} className={`rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'up' ? 'text-[var(--color-success)]' : 'hover:text-[var(--color-success)]'}`}><ArrowUp className="h-4 w-4" /></button>
          <span>{comment.score}</span>
          <button type="button" aria-label="Votar negativo" onClick={() => onVote(comment.id, 'down')} className={`rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'down' ? 'text-[var(--color-error)]' : 'hover:text-[var(--color-error)]'}`}><ArrowDown className="h-4 w-4" /></button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text)]">{comment.author.username}</span><span>·</span><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time></div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-soft)]">{comment.content}</p>
          {comment.replies.length > 0 && <div className="mt-3 border-l-2 border-[var(--color-border)] pl-3">{comment.replies.map((reply) => <CommentCard key={reply.id} comment={reply} onVote={onVote} />)}</div>}
        </div>
      </div>
    </article>
  )
}

export function CommentsSection({ problemId }: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!problemId) return
    getComments(problemId).then((response) => setComments(response.data)).catch(() => setError('No se pudieron cargar los comentarios.')).finally(() => setIsLoading(false))
  }, [problemId])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!problemId || !content.trim()) return
    try {
      const comment = await createComment(problemId, content.trim())
      setComments((current) => [comment, ...current])
      setContent('')
    } catch { setError('Inicia sesión para participar en la discusión.') }
  }

  async function handleVote(id: string, vote: 'up' | 'down') {
    try {
      const result = await voteComment(id, vote)
      setComments((current) => current.map((comment) => comment.id === id ? { ...comment, score: result.score, viewerVote: result.viewerVote } : comment))
    } catch { setError('Inicia sesión para votar.') }
  }

  return <section className="flex h-full min-h-0 flex-col bg-[var(--color-bg-soft)] p-4" aria-label="Discusión del problema">
    <div className="mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[var(--color-primary)]" /><h2 className="text-sm font-bold text-[var(--color-text)]">Discusión</h2></div>
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2"><label className="sr-only" htmlFor="new-comment">Escribe un comentario</label><textarea id="new-comment" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Comparte una pista o pregunta..." rows={3} className="min-h-20 min-w-0 flex-1 resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]" /><button type="submit" aria-label="Publicar comentario" className="self-end rounded-lg bg-[var(--color-primary)] p-2.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Send className="h-4 w-4" /></button></form>
    {error && <p className="mb-3 text-xs font-semibold text-[var(--color-error)]">{error}</p>}
    {isLoading ? <div className="h-24 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" /> : comments.length === 0 ? <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">Sé la primera persona en iniciar la discusión.</p> : <div className="min-h-0 flex-1 overflow-auto">{comments.map((comment) => <CommentCard key={comment.id} comment={comment} onVote={handleVote} />)}</div>}
  </section>
}
