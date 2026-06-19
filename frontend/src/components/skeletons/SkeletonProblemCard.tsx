export function SkeletonProblemCard() {
  return (
    <article className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded-full bg-slate-800" />
        <div className="mt-5 h-8 w-16 rounded-full bg-slate-800" />
        <div className="mt-4 h-3 w-full rounded-full bg-slate-800" />
        <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-800" />
      </div>
    </article>
  )
}
