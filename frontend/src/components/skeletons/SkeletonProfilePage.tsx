function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--color-bg-muted)] ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonProfilePage() {
  return (
    <div className="grid min-w-0 items-start gap-3 md:grid-cols-[17.5rem_minmax(0,1fr)] lg:grid-cols-[20rem_minmax(0,1fr)]" aria-label="Cargando perfil">
      <section className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5">
        <SkeletonBlock className="mx-auto h-24 w-24 rounded-full" />
        <SkeletonBlock className="mx-auto mt-4 h-5 w-36" />
        <SkeletonBlock className="mx-auto mt-2 h-3 w-24" />
        <SkeletonBlock className="mt-6 h-10 w-full" />
        <SkeletonBlock className="mt-3 h-10 w-full" />
      </section>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="grid gap-3 xl:grid-cols-2">
          <section className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-5 h-28 w-full" />
          </section>
          <section className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-5 h-28 w-full" />
          </section>
        </div>
        <section className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="mt-5 h-32 w-full" />
        </section>
        <section className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="mt-5 h-28 w-full" />
        </section>
      </div>
    </div>
  )
}
