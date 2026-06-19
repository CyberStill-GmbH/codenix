export function SkeletonSubmissionsTable() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_30rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="animate-pulse">
          <div className="h-9 w-64 rounded-full bg-slate-800" />
          <div className="mt-3 h-4 w-80 rounded-full bg-slate-800" />
        </div>

        <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5">
          <div className="flex animate-pulse flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <span className="h-11 w-full rounded-full bg-slate-800 lg:max-w-sm" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((item) => (
                <span key={item} className="h-10 w-28 rounded-full bg-slate-800" />
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3">
          <div className="space-y-2">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="grid min-h-16 animate-pulse gap-4 rounded-xl bg-slate-900/55 px-4 py-4 md:grid-cols-[9rem_minmax(0,1fr)_8rem_8rem]"
              >
                <span className="h-4 rounded-full bg-slate-800" />
                <span className="h-4 rounded-full bg-slate-800" />
                <span className="h-4 rounded-full bg-slate-800" />
                <span className="h-4 rounded-full bg-slate-800" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl border border-slate-700/50 bg-slate-950/60"
          />
        ))}
      </aside>
    </div>
  )
}
