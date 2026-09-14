import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Award, ArrowLeft, Eye, LogIn } from 'lucide-react'

import { ErrorState } from '@/components/feedback/ErrorState'
import { UserAvatar } from '@/features/user/components/UserAvatar'
import { getPublicProfile, type PublicProfile } from '@/features/user/services/userApi'
import { formatDate } from '@/shared/utils/date'

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!username) return
    getPublicProfile(username).then(setProfile).catch((cause) => {
      setError(cause instanceof Error ? cause.message : 'No pudimos encontrar este perfil.')
    })
  }, [username])

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)]">
        <div className="mx-auto max-w-2xl">
          <ErrorState title="Perfil no disponible" message={error} action={<Link to="/" className="font-semibold underline">Volver al inicio</Link>} />
        </div>
      </main>
    )
  }

  if (!profile) return <main className="min-h-screen animate-pulse bg-[var(--color-bg)]" aria-label="Cargando perfil" />

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-8 text-[var(--color-text)] sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Codenix
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Iniciar sesión
          </Link>
        </header>

        <section className="mt-10 border-y border-[var(--color-border-soft)] py-8 sm:py-10" aria-labelledby="public-profile-title">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <UserAvatar src={profile.avatarUrl} name={profile.name} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">Perfil público</p>
              <h1 id="public-profile-title" className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--color-text)]">{profile.name}</h1>
              <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">@{profile.username}</p>
              {profile.degree && <p className="mt-3 text-sm text-[var(--color-text-muted)]">{profile.degree}</p>}
              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">Miembro desde {formatDate(profile.createdAt)}</p>
            </div>
          </div>

          <dl className="mt-8 grid gap-5 border-t border-[var(--color-border-soft)] pt-5 sm:grid-cols-3">
            <div><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]"><Award className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />Reputación</dt><dd className="mt-2 font-mono text-2xl font-bold">{profile.reputation}</dd></div>
            <div><dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]"><Eye className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />Vistas</dt><dd className="mt-2 font-mono text-2xl font-bold">{profile.profileViews}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">Problemas resueltos</dt><dd className="mt-2 font-mono text-2xl font-bold">{profile.solvedSubmissions}</dd></div>
          </dl>
        </section>
      </div>
    </main>
  )
}
