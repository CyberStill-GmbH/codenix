import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowDown, ArrowUp, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { createComment, getComments, voteComment, type PublicComment } from '@/features/community/services/commentsApi'

type CommentsSectionProps = { problemId?: string }

function CommentCard({ comment, onVote, depth = 0 }: { comment: PublicComment; onVote: (id: string, vote: 'up' | 'down') => void; depth?: number }) {
  return (
    <article className={`${depth === 0 ? 'border-b border-[var(--color-border-soft)] py-5 last:border-b-0' : 'border-l border-[var(--color-border)] pl-3 pt-3'} group`}>
      <div className="flex gap-3">
        <div className="flex w-9 shrink-0 flex-col items-center gap-1 text-xs font-bold text-[var(--color-text-muted)]">
          <button type="button" aria-label="Votar positivo" onClick={() => onVote(comment.id, 'up')} className={`rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'up' ? 'text-[var(--color-success)]' : 'hover:text-[var(--color-success)]'}`}><ArrowUp className="h-4 w-4" /></button>
          <span>{comment.score}</span>
          <button type="button" aria-label="Votar negativo" onClick={() => onVote(comment.id, 'down')} className={`rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'down' ? 'text-[var(--color-error)]' : 'hover:text-[var(--color-error)]'}`}><ArrowDown className="h-4 w-4" /></button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <UserAvatar src={comment.author.avatarUrl} name={comment.author.name || comment.author.username} size="sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Link to="/profile" className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" title={`Ver perfil de ${comment.author.username}`}>{comment.author.username}</Link>
                <span>·</span><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
              </div>
              <span className="text-[0.6875rem] text-[var(--color-text-subtle)]">{comment.author.name}</span>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-soft)]">{comment.content}</p>
          {comment.replies.length > 0 && <div className="mt-3">{comment.replies.map((reply) => <CommentCard key={reply.id} comment={reply} onVote={onVote} depth={depth + 1} />)}</div>}
        </div>
      </div>
    </article>
  )
}

export function CommentsSection({ problemId }: CommentsSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [sort, setSort] = useState<'best' | 'newest'>('best')

  useEffect(() => {
    if (!problemId) return
    getComments(problemId, sort).then((response) => setComments(response.data)).catch(() => setNotice('No se pudieron cargar los comentarios.')).finally(() => setIsLoading(false))
  }, [problemId, sort])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!problemId || !content.trim()) return
    try {
      const comment = await createComment(problemId, content.trim())
      setComments((current) => [comment, ...current])
      setContent('')
    } catch { setNotice('Inicia sesión para participar en la discusión.') }
  }

  async function handleVote(id: string, vote: 'up' | 'down') {
    try {
      const result = await voteComment(id, vote)
      setComments((current) => current.map((comment) => comment.id === id ? { ...comment, score: result.score, viewerVote: result.viewerVote } : comment))
    } catch { setNotice('Inicia sesión para votar.') }
  }

  return <section className="flex h-full min-h-0 flex-col bg-[var(--color-bg-soft)] p-4" aria-label="Discusión del problema">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[var(--color-primary)]" /><h2 className="text-sm font-bold text-[var(--color-text)]">Discusión</h2></div><div className="flex items-center gap-1 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-0.5" role="group" aria-label="Ordenar comentarios"><button type="button" onClick={() => setSort('best')} className={`rounded-md px-2 py-1 text-[0.6875rem] font-semibold ${sort === 'best' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}><Sparkles className="mr-1 inline h-3 w-3" />Mejores</button><button type="button" onClick={() => setSort('newest')} className={`rounded-md px-2 py-1 text-[0.6875rem] font-semibold ${sort === 'newest' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>Recientes</button></div></div>
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2"><label className="sr-only" htmlFor="new-comment">Escribe un comentario</label><textarea id="new-comment" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Comparte una pista o pregunta..." rows={3} className="min-h-20 min-w-0 flex-1 resize-y bg-transparent p-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]" /><button type="submit" aria-label="Publicar comentario" className="self-end rounded-lg bg-[var(--color-primary)] p-2.5 text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Send className="h-4 w-4" /></button></form>
    {isLoading ? <div className="h-24 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" /> : comments.length === 0 ? <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">Sé la primera persona en iniciar la discusión.</p> : <div className="min-h-0 flex-1 overflow-auto">{comments.map((comment) => <CommentCard key={comment.id} comment={comment} onVote={handleVote} />)}</div>}
    {notice && (
      <div className="fixed bottom-4 right-4 z-50 flex max-w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border border-[var(--color-error)]/35 bg-[var(--color-error-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-error)] shadow-[var(--shadow-lg)]" role="alert" aria-live="assertive">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1">{notice}</span>
        <button type="button" onClick={() => setNotice(null)} aria-label="Cerrar aviso" className="shrink-0 rounded-md p-0.5 transition hover:bg-[var(--color-error)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    )}
  </section>
}
