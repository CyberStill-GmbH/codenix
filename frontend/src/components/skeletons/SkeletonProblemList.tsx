import { SkeletonProblemCard } from '@/components/skeletons/SkeletonProblemCard'

type SkeletonProblemListProps = {
  mode?: 'user' | 'admin'
}

export function SkeletonProblemList({ mode = 'user' }: SkeletonProblemListProps) {
  const columns =
    mode === 'admin'
      ? 'xl:grid-cols-[minmax(16rem,1.4fr)_7rem_minmax(12rem,1fr)_8rem_7rem_8rem_minmax(18rem,1fr)]'
      : 'md:grid-cols-[2rem_minmax(0,1fr)_8rem_7rem_4rem]'

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SkeletonProblemCard />
        <SkeletonProblemCard />
        <SkeletonProblemCard />
      </section>

      <section className="rounded-2xl border border-slate-700/50 bg-slate-950/60 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
        <div className="animate-pulse">
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4].map((item) => (
              <span key={item} className="h-9 w-24 rounded-full bg-slate-800" />
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <span className="h-11 w-full rounded-full bg-slate-800 lg:max-w-sm" />
            <div className="flex gap-2">
              <span className="h-10 w-28 rounded-full bg-slate-800" />
              <span className="h-10 w-28 rounded-full bg-slate-800" />
              <span className="h-10 w-28 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.22)]">
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`grid min-h-16 animate-pulse gap-4 rounded-xl bg-slate-900/55 px-4 py-4 ${columns}`}
            >
              {(mode === 'admin' ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4]).map(
                (cell) => (
                  <span key={cell} className="h-4 rounded-full bg-slate-800" />
                ),
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
