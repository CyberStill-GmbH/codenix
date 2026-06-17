import {
    CheckCircle2,
    Code2,
    Flame,
    LineChart,
    ListChecks,
    Target,
    Trophy,
} from 'lucide-react'

const progressItems = [
    {
        label: 'Arrays',
        value: '84%',
        tone: 'bg-[var(--color-primary)]',
    },
    {
        label: 'Hash Map',
        value: '72%',
        tone: 'bg-[var(--color-secondary)]',
    },
    {
        label: 'DP',
        value: '38%',
        tone: 'bg-[var(--color-warning)]',
    },
]

const problemRows = [
    {
        title: 'Two Sum',
        status: 'Aceptado',
        difficulty: 'Fácil',
        color: 'bg-[var(--color-difficulty-easy)]',
    },
    {
        title: 'Binary Search',
        status: 'En progreso',
        difficulty: 'Medio',
        color: 'bg-[var(--color-difficulty-medium)]',
    },
    {
        title: 'Dynamic Paths',
        status: 'Pendiente',
        difficulty: 'Difícil',
        color: 'bg-[var(--color-difficulty-hard)]',
    },
]

const metricCards = [
    {
        icon: Target,
        label: 'Objetivo',
        value: 'CP Base',
        className: 'from-[rgba(11,127,195,0.34)] to-[rgba(11,127,195,0.08)]',
    },
    {
        icon: Trophy,
        label: 'Rating',
        value: '800',
        className: 'from-[rgba(255,107,0,0.3)] to-[rgba(255,107,0,0.08)]',
    },
    {
        icon: ListChecks,
        label: 'Racha',
        value: '12 días',
        className: 'from-[rgba(34,197,94,0.26)] to-[rgba(34,197,94,0.07)]',
    },
]

export function HeroProjectCard() {
    return (
        <div
            className="relative mx-auto w-full max-w-[34rem] motion-safe:animate-[codenix-hero-float_5s_ease-in-out_infinite]"
            aria-hidden="true"
        >
            <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-[var(--color-primary-soft)] blur-3xl" />
            <div className="absolute -right-10 bottom-4 h-44 w-44 rounded-full bg-[var(--color-secondary-soft)] blur-3xl" />

            <div className="relative [transform:perspective(1200px)_rotateX(7deg)_rotateZ(-5deg)]">
                <div className="absolute inset-0 translate-x-5 translate-y-6 rounded-[2rem] bg-[rgba(2,6,23,0.48)] blur-xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[rgba(15,23,42,0.82)] shadow-[var(--shadow-2xl)] backdrop-blur-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(11,127,195,0.22),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(255,107,0,0.16),transparent_32%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    <div className="relative p-4 sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--color-primary)]">
                                    <Code2 className="h-4 w-4" />
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text)]">
                                        Codenix Practice
                                    </p>
                                    <p className="font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                                        algorithm workspace
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.1)] px-2.5 py-1 font-mono text-[0.6875rem] font-semibold text-[var(--color-success)]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                live
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {metricCards.map((card) => {
                                const Icon = card.icon

                                return (
                                    <div
                                        key={card.label}
                                        className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${card.className} p-3`}
                                    >
                                        <Icon className="h-4 w-4 text-[var(--color-text)] opacity-90" />
                                        <p className="mt-4 text-[0.625rem] font-medium text-[var(--color-text-muted)]">
                                            {card.label}
                                        </p>
                                        <p className="mt-0.5 text-sm font-bold text-[var(--color-text)]">
                                            {card.value}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
                            <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,18,37,0.62)] p-3">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                        Problems
                                    </p>
                                    <Flame className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
                                </div>

                                <div className="space-y-2">
                                    {problemRows.map((problem) => (
                                        <div
                                            key={problem.title}
                                            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2"
                                        >
                                            <span className={`h-2 w-2 rounded-full ${problem.color}`} />

                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-[var(--color-text)]">
                                                    {problem.title}
                                                </p>
                                                <p className="truncate text-[0.625rem] text-[var(--color-text-muted)]">
                                                    {problem.status}
                                                </p>
                                            </div>

                                            <span className="rounded-full border border-white/[0.07] px-2 py-0.5 text-[0.625rem] text-[var(--color-text-muted)]">
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,18,37,0.52)] p-3">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                        Progress
                                    </p>
                                    <LineChart className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                                </div>

                                <div className="space-y-3">
                                    {progressItems.map((item) => (
                                        <div key={item.label}>
                                            <div className="mb-1 flex items-center justify-between gap-3">
                                                <span className="text-[0.625rem] text-[var(--color-text-muted)]">
                                                    {item.label}
                                                </span>
                                                <span className="font-mono text-[0.625rem] text-[var(--color-text-soft)]">
                                                    {item.value}
                                                </span>
                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                    className={`h-full rounded-full ${item.tone}`}
                                                    style={{ width: item.value }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 rounded-xl border border-[rgba(255,107,0,0.14)] bg-[rgba(255,107,0,0.06)] p-3">
                                    <p className="font-mono text-[0.625rem] text-[var(--color-secondary)]">
                                        next target
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
                                        Resolver 20 problemas base
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-5 -right-4 rounded-2xl border border-white/[0.1] bg-[rgba(15,23,42,0.82)] px-4 py-3 shadow-[var(--shadow-lg)] backdrop-blur-xl motion-safe:animate-[codenix-hero-float-soft_6.5s_ease-in-out_infinite]">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        Accepted
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--color-success)]">
                        68.3% AC
                    </p>
                </div>
            </div>
        </div>
    )
}