export function UserTopRanking() {
  // TODO: API - GET /api/users/me/stats (ranking percentile + distribution)
  const bars = Array.from({ length: 24 }).map((_, index) => {
    const x = index - 7
    const value = Math.max(6, Math.floor(100 * Math.exp(-(x * x) / 18)))
    return { index, value, isUser: index === 18 }
  })
  const max = Math.max(...bars.map((bar) => bar.value))

  return (
    <div className="flex flex-1 flex-col p-6">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
        Ranking global
      </p>
      <p className="mt-2 font-mono text-4xl font-bold leading-none text-[var(--color-text)]">
        Top 3.23%
      </p>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        <span className="font-mono font-semibold text-[var(--color-text)]">#1,284</span>{' '}
        de 39,740 usuarios
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
        por problemas resueltos
      </p>

      <div className="mt-auto flex items-end gap-[3px] pt-8 opacity-70" aria-hidden="true" style={{ height: 82 }}>
        {bars.map((bar) => (
          <div
            key={bar.index}
            className="flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.round((bar.value / max) * 100)}%`,
              backgroundColor: bar.isUser
                ? 'var(--color-warning)'
                : 'rgba(148,163,184,0.13)',
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-[0.65rem] text-[var(--color-text-subtle)]">
        Distribucion <span className="text-[var(--color-warning)]">■</span> Tu posicion
      </p>
    </div>
  )
}
