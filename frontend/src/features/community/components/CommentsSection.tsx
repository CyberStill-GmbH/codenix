import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowBigDown, ArrowBigUp, Award, Eye, ImagePlus, MessageCircle, Reply, Send, Sparkles, X } from 'lucide-react'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { createComment, getComments, resolveCommentImageUrl, uploadCommentImage, voteComment, type PublicComment } from '@/features/community/services/commentsApi'
import { getPublicProfile, type PublicProfile } from '@/features/user/services/userApi'

type CommentsSectionProps = { problemId?: string }

function AuthorProfilePopover({ author }: { author: PublicComment['author'] }) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 140)
  }

  const updatePosition = () => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const width = 280
    setPosition({
      top: rect.bottom + 8,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
    })
  }

  const openPopover = () => {
    clearCloseTimer()
    updatePosition()
    setIsOpen(true)
    if (!profile) getPublicProfile(author.username).then(setProfile).catch(() => setProfile(null))
  }

  useEffect(() => {
    if (!isOpen) return
    const reposition = () => updatePosition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [isOpen])

  useEffect(() => () => clearCloseTimer(), [])

  return (
    <span ref={anchorRef} className="relative inline-flex" onMouseEnter={openPopover} onMouseLeave={scheduleClose}>
      <Link
        to={`/u/${encodeURIComponent(author.username)}`}
        className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        title={`Ver perfil de ${author.username}`}
        onFocus={openPopover}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsOpen(false)
        }}
      >
        {author.username}
      </Link>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="fixed z-[80] w-[280px] overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] p-4 text-left shadow-[var(--shadow-lg)]"
              style={{ top: position.top, left: position.left }}
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleClose}
              role="dialog"
              aria-label={`Resumen del perfil de ${author.username}`}
            >
              <div className="flex items-center gap-3">
                <UserAvatar src={profile?.avatarUrl ?? author.avatarUrl} name={profile?.name ?? author.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-[var(--color-text)]">{profile?.name ?? author.name}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">@{author.username}</p>
                </div>
              </div>
              {profile ? (
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--color-border-soft)] pt-3">
                  <div>
                    <p className="flex items-center gap-1 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]"><Award className="h-3 w-3 text-[var(--color-accent)]" aria-hidden="true" />Reputación</p>
                    <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)]">{profile.reputation}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]"><Eye className="h-3 w-3 text-[var(--color-primary)]" aria-hidden="true" />Vistas</p>
                    <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)]">{profile.profileViews}</p>
                  </div>
                  <div>
                    <p className="text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">Resueltos</p>
                    <p className="mt-1 font-mono text-sm font-bold text-[var(--color-text)]">{profile.solvedSubmissions}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 h-12 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" aria-label="Cargando datos del perfil" />
              )}
              <Link to={`/u/${encodeURIComponent(author.username)}`} className="mt-4 inline-flex text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">Ver perfil completo</Link>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}

function CommentCard({ comment, onVote, onReply, depth = 0 }: { comment: PublicComment; onVote: (id: string, vote: 'up' | 'down') => void; onReply: (comment: PublicComment) => void; depth?: number }) {
  return (
    <article className={`${depth === 0 ? 'border-b border-[var(--color-border-soft)] py-5 last:border-b-0' : 'border-l border-[var(--color-border)] pl-3 pt-3'} group`}>
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <UserAvatar src={comment.author.avatarUrl} name={comment.author.name || comment.author.username} size="sm" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <AuthorProfilePopover author={comment.author} />
                <span>·</span><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
              </div>
              <span className="text-[0.6875rem] text-[var(--color-text-subtle)]">{comment.author.name}</span>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-soft)]">{comment.content}</p>
          {comment.imageUrl && resolveCommentImageUrl(comment.imageUrl) && <a href={resolveCommentImageUrl(comment.imageUrl)} target="_blank" rel="noreferrer" className="mt-3 block max-w-md overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><img src={resolveCommentImageUrl(comment.imageUrl)} alt="Imagen adjunta al comentario" loading="lazy" className="max-h-64 w-full object-contain" /></a>}
          <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5">
            <button type="button" onClick={() => onReply(comment)} className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Reply className="h-4 w-4" aria-hidden="true" />Responder</button>
            <span className="mx-1 h-4 w-px bg-[var(--color-border-soft)]" aria-hidden="true" />
            <button type="button" aria-label={`Votar positivo, ${comment.upvotes} votos`} aria-pressed={comment.viewerVote === 'up'} onClick={() => onVote(comment.id, 'up')} className={`inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'up' ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-success-soft)] hover:text-[var(--color-success)]'}`}><ArrowBigUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />{comment.upvotes}</button>
            <button type="button" aria-label={`Votar negativo, ${comment.downvotes} votos`} aria-pressed={comment.viewerVote === 'down'} onClick={() => onVote(comment.id, 'down')} className={`inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${comment.viewerVote === 'down' ? 'bg-[var(--color-error-soft)] text-[var(--color-error)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-error-soft)] hover:text-[var(--color-error)]'}`}><ArrowBigDown className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />{comment.downvotes}</button>
          </div>
          {comment.replies.length > 0 && <div className="mt-3">{comment.replies.map((reply) => <CommentCard key={reply.id} comment={reply} onVote={onVote} onReply={onReply} depth={depth + 1} />)}</div>}
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
  const [replyTo, setReplyTo] = useState<PublicComment | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!problemId) return
    getComments(problemId, sort).then((response) => setComments(response.data)).catch(() => setNotice('No se pudieron cargar los comentarios.')).finally(() => setIsLoading(false))
  }, [problemId, sort])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function updateCommentTree(items: PublicComment[], id: string, update: (comment: PublicComment) => PublicComment): PublicComment[] {
    return items.map((item) => item.id === id ? update(item) : { ...item, replies: updateCommentTree(item.replies, id, update) })
  }

  function chooseImage(file: File | undefined) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setNotice('Adjunta una imagen JPEG, PNG o WEBP de hasta 5 MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!problemId || (!content.trim() && !imageFile)) return
    setIsPosting(true)
    try {
      const image = imageFile ? await uploadCommentImage(problemId, imageFile) : undefined
      const comment = await createComment(problemId, content.trim() || 'Imagen adjunta', replyTo?.id, image?.url)
      setComments((current) => replyTo ? updateCommentTree(current, replyTo.id, (parent) => ({ ...parent, replies: [...parent.replies, comment] })) : [comment, ...current])
      setContent('')
      setReplyTo(null)
      clearImage()
    } catch { setNotice('No se pudo publicar. Inicia sesión e inténtalo de nuevo.') }
    finally { setIsPosting(false) }
  }

  async function handleVote(id: string, vote: 'up' | 'down') {
    try {
      const result = await voteComment(id, vote)
      setComments((current) => updateCommentTree(current, id, (comment) => ({ ...comment, score: result.score, upvotes: result.upvotes, downvotes: result.downvotes, viewerVote: result.viewerVote })))
    } catch { setNotice('Inicia sesión para votar.') }
  }

  return <section className="flex h-full min-h-0 flex-col bg-[var(--color-bg-soft)] p-4" aria-label="Discusión del problema">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[var(--color-primary)]" /><h2 className="text-sm font-bold text-[var(--color-text)]">Discusión</h2></div><div className="flex items-center gap-1 rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-0.5" role="group" aria-label="Ordenar comentarios"><button type="button" onClick={() => setSort('best')} className={`rounded-md px-2 py-1 text-[0.6875rem] font-semibold ${sort === 'best' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}><Sparkles className="mr-1 inline h-3 w-3" />Mejores</button><button type="button" onClick={() => setSort('newest')} className={`rounded-md px-2 py-1 text-[0.6875rem] font-semibold ${sort === 'newest' ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>Recientes</button></div></div>
    <form onSubmit={handleSubmit} className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
      {replyTo && <div className="mb-2 flex items-center justify-between border-b border-[var(--color-border-soft)] px-2 pb-2 text-xs text-[var(--color-text-muted)]"><span>Respondiendo a <strong className="text-[var(--color-text)]">@{replyTo.author.username}</strong></span><button type="button" onClick={() => setReplyTo(null)} className="rounded-md px-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text)]" aria-label="Cancelar respuesta"><X className="h-3.5 w-3.5" /></button></div>}
      <div className="flex gap-2"><label className="sr-only" htmlFor="new-comment">Escribe un comentario</label><textarea id="new-comment" value={content} onChange={(event) => setContent(event.target.value)} placeholder={replyTo ? 'Escribe tu respuesta...' : 'Comparte una pista o pregunta...'} rows={3} className="min-h-20 min-w-0 flex-1 resize-y bg-transparent p-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-subtle)]" /><div className="flex shrink-0 flex-col justify-end gap-1"><input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => chooseImage(event.target.files?.[0])} /><button type="button" onClick={() => imageInputRef.current?.click()} aria-label="Adjuntar imagen" className="rounded-md p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"><ImagePlus className="h-4 w-4" /></button><button type="submit" disabled={isPosting || (!content.trim() && !imageFile)} aria-label="Publicar comentario" className="rounded-lg bg-[var(--color-primary)] p-2.5 text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"><Send className="h-4 w-4" /></button></div></div>
      {imagePreview && <div className="relative mt-2 w-fit overflow-hidden rounded-lg border border-[var(--color-border)]"><img src={imagePreview} alt="Vista previa del adjunto" className="max-h-24 max-w-40 object-cover" /><button type="button" onClick={clearImage} aria-label="Quitar imagen" className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white"><X className="h-3 w-3" /></button></div>}
    </form>
    {isLoading ? <div className="h-24 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" /> : comments.length === 0 ? <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">Sé la primera persona en iniciar la discusión.</p> : <div className="min-h-0 flex-1 overflow-auto">{comments.map((comment) => <CommentCard key={comment.id} comment={comment} onVote={handleVote} onReply={setReplyTo} />)}</div>}
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
