type SkeletonAdminFormProps = {
  compact?: boolean
}

export function SkeletonAdminForm({ compact = false }: SkeletonAdminFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded-full bg-slate-800" />
          <div className="mt-4 h-9 w-72 rounded-full bg-slate-800" />
          <div className="mt-3 h-4 w-full max-w-2xl rounded-full bg-slate-800" />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-2xl border border-slate-700/50 bg-slate-950/60"
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
        <div className="grid animate-pulse gap-4 lg:grid-cols-2">
          <div className="h-11 rounded-2xl bg-slate-800" />
          <div className="h-11 rounded-2xl bg-slate-800" />
          <div className="h-40 rounded-2xl bg-slate-800 lg:col-span-2" />
          {!compact && (
            <>
              <div className="h-40 rounded-2xl bg-slate-800" />
              <div className="h-40 rounded-2xl bg-slate-800" />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
