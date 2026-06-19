export function SkeletonEditorLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
      <div className="grid h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[26rem_minmax(0,1fr)]">
        <aside className="animate-pulse rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5">
          <div className="h-8 w-48 rounded-full bg-slate-800" />
          <div className="mt-5 space-y-3">
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 w-2/3 rounded-full bg-slate-800" />
          </div>
          <div className="mt-8 h-44 rounded-2xl bg-slate-900" />
        </aside>

        <section className="grid animate-pulse gap-4 grid-rows-[3rem_minmax(0,1fr)_12rem]">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60" />
          <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60" />
          <div className="rounded-2xl border border-slate-700/50 bg-slate-950/60" />
        </section>
      </div>
    </div>
  )
}
