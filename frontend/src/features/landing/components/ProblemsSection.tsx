import { useState } from 'react'
import {
    CheckCircle2,
    ChevronDown,
    Code2,
    Gauge,
    Layers3,
    ListChecks,
    Play,
    Search,
    Sparkles,
    Target,
    TerminalSquare,
    Trophy,
    Zap,
} from 'lucide-react'

import { previewProblems } from '@/features/landing/constants/landingContent'
import type { PreviewProblem } from '@/features/landing/types/landing.types'
import { LandingBadge } from '@/features/landing/components/common/LandingBadge'
import { SectionContainer } from '@/features/landing/components/common/SectionContainer'

const difficultyStyles: Record<PreviewProblem['difficulty'], string> = {
    Fácil:
        'border-[rgba(0,200,150,0.24)] bg-[var(--color-difficulty-easy-soft)] text-[var(--color-difficulty-easy)]',
    Medio:
        'border-[rgba(251,191,36,0.24)] bg-[var(--color-difficulty-medium-soft)] text-[var(--color-difficulty-medium)]',
    Difícil:
        'border-[rgba(255,77,106,0.24)] bg-[var(--color-difficulty-hard-soft)] text-[var(--color-difficulty-hard)]',
}

const codeScrollerClassName =
    'overflow-x-auto px-0 py-4 font-mono text-[0.75rem] leading-relaxed [scrollbar-width:thin] [scrollbar-color:rgba(11,127,195,0.34)_rgba(15,23,42,0.76)] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[rgba(15,23,42,0.76)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(11,127,195,0.44)]'

const codeLines = [
    {
        n: 1,
        content: (
            <span className="text-[var(--color-text-muted)]">
                # O(n) — hash map, single pass
            </span>
        ),
    },
    {
        n: 2,
        content: <br />,
    },
    {
        n: 3,
        content: (
            <>
                <span className="text-[var(--color-secondary)]">def </span>
                <span className="text-[var(--color-accent)]">two_sum</span>
                <span className="text-[var(--color-text-soft)]">(nums, target):</span>
            </>
        ),
    },
    {
        n: 4,
        content: <span className="text-[var(--color-text-soft)]">seen = {'{}'}</span>,
    },
    {
        n: 5,
        content: (
            <>
                <span className="text-[var(--color-secondary)]">for </span>
                <span className="text-[var(--color-primary)]">i, n </span>
                <span className="text-[var(--color-secondary)]">in </span>
                <span className="text-[var(--color-accent)]">enumerate</span>
                <span className="text-[var(--color-text-soft)]">(nums):</span>
            </>
        ),
    },
    {
        n: 6,
        content: <span className="text-[var(--color-text-soft)]">diff = target - n</span>,
    },
    {
        n: 7,
        content: (
            <>
                <span className="text-[var(--color-secondary)]">if </span>
                <span className="text-[var(--color-primary)]">diff </span>
                <span className="text-[var(--color-secondary)]">in </span>
                <span className="text-[var(--color-primary)]">seen</span>
                <span className="text-[var(--color-text-soft)]">:</span>
            </>
        ),
    },
    {
        n: 8,
        content: (
            <>
                <span className="text-[var(--color-success)]">return </span>
                <span className="text-[var(--color-text-soft)]">[seen[diff], i]</span>
            </>
        ),
    },
    {
        n: 9,
        content: <span className="text-[var(--color-text-soft)]">seen[n] = i</span>,
    },
]

const testCases = [
    {
        input: '[2, 7, 11, 15], 9',
        output: '[0, 1]',
        time: '8ms',
    },
    {
        input: '[3, 2, 4], 6',
        output: '[1, 2]',
        time: '6ms',
    },
    {
        input: '[3, 3], 6',
        output: '[0, 1]',
        time: '5ms',
    },
]

const workflowItems = [
    {
        icon: Target,
        label: 'Problemas curados',
        value: 'Rutas por tema',
    },
    {
        icon: TerminalSquare,
        label: 'Editor integrado',
        value: 'Python, Java y C',
    },
    {
        icon: Gauge,
        label: 'Progreso visible',
        value: 'Aceptación y rating',
    },
]

export function ProblemsSection() {
    const [activeProblemIndex, setActiveProblemIndex] = useState(0)
    const [activeTab, setActiveTab] = useState<'code' | 'tests'>('code')

    const activeProblem = previewProblems[activeProblemIndex] ?? previewProblems[0]
    const problemSlug = activeProblem?.title?.toLowerCase().replaceAll(' ', '-') ?? 'two-sum'

    return (
        <section
            id="problems"
            className="relative isolate overflow-hidden border-b border-[var(--color-border-soft)] bg-[var(--color-bg)]"
            aria-labelledby="problems-title"
        >
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(11,127,195,0.12),transparent_62%),radial-gradient(ellipse_52%_42%_at_88%_28%,rgba(255,107,0,0.08),transparent_58%)]" />
            <div className="absolute left-1/2 top-0 -z-10 h-px w-[76rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(11,127,195,0.38)] to-transparent" />

            <SectionContainer className="py-20 lg:py-28">
                <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center">
                    <LandingBadge icon={<Sparkles className="h-3.5 w-3.5" />}>
                        Problems engine
                    </LandingBadge>

                    <h2
                        id="problems-title"
                        className="mt-5 text-balance text-[var(--color-text)]"
                    >
                        Practica con problemas claros, feedback rápido y progreso medible.
                    </h2>

                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-soft)]">
                        La sección de problemas concentra el flujo principal de Codenix:
                        elegir un reto, entender restricciones, probar soluciones y medir
                        tu avance sin ruido.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[0.86fr_1.14fr]">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.54)] p-5 shadow-[var(--shadow-lg)] backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                                    <Layers3 className="h-5 w-5" aria-hidden="true" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text)]">
                                        Biblioteca inicial
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        Pensada para construir base antes de competir.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                                {workflowItems.map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <div
                                            key={item.label}
                                            className="rounded-xl border border-white/[0.07] bg-[rgba(7,18,37,0.62)] p-4 transition duration-300 hover:border-[rgba(11,127,195,0.28)] hover:bg-[rgba(13,24,43,0.82)]"
                                        >
                                            <Icon
                                                className="h-4 w-4 text-[var(--color-primary)]"
                                                aria-hidden="true"
                                            />
                                            <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                                {item.value}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.42)] p-5 backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text)]">
                                        Señal de avance
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                        No solo resuelves: entiendes tu evolución.
                                    </p>
                                </div>

                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]">
                                    <Trophy className="h-5 w-5" aria-hidden="true" />
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <MetricRow label="Aceptación" value="68.3%" />
                                <MetricRow label="Envíos simulados" value="2 841" />
                                <MetricRow label="Rating estimado" value="800" />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-8 top-12 -z-10 h-44 w-44 rounded-full bg-[var(--color-primary-soft)] blur-3xl" />
                        <div className="absolute -right-8 bottom-8 -z-10 h-48 w-48 rounded-full bg-[var(--color-secondary-soft)] blur-3xl" />

                        <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[rgba(15,23,42,0.86)] text-left shadow-[var(--shadow-xl)] backdrop-blur-xl">
                            <div className="flex h-12 items-center justify-between border-b border-white/[0.07] bg-[rgba(7,11,20,0.78)] px-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-error)] opacity-80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning)] opacity-80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)] opacity-80" />
                                </div>

                                <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-0.5 font-mono text-[0.6875rem] font-medium text-[var(--color-text-muted)] sm:inline-flex">
                                    codenix / problems / {problemSlug}
                                </span>

                                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                                    Python 3
                                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-[190px_minmax(230px,0.82fr)_minmax(0,1.18fr)]">
                                <aside className="border-b border-white/[0.07] lg:border-b-0 lg:border-r lg:border-white/[0.07]">
                                    <div className="border-b border-white/[0.07] p-3">
                                        <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[rgba(2,6,23,0.42)] px-3 py-2">
                                            <Search className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                                            <span className="font-mono text-[0.6875rem] text-[var(--color-text-subtle)]">
                                                buscar reto
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-3 pb-2 pt-3">
                                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                            Problemas
                                        </p>
                                        <Code2 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                                    </div>

                                    <div className="space-y-1 px-1.5 pb-3">
                                        {previewProblems.map((problem, index) => (
                                            <button
                                                key={problem.title}
                                                type="button"
                                                onClick={() => setActiveProblemIndex(index)}
                                                className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition duration-200 ${activeProblemIndex === index
                                                    ? 'bg-[rgba(11,127,195,0.16)]'
                                                    : 'hover:bg-[var(--color-bg-soft)]'
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${problem.difficulty === 'Fácil'
                                                        ? 'bg-[var(--color-difficulty-easy)]'
                                                        : problem.difficulty === 'Medio'
                                                            ? 'bg-[var(--color-difficulty-medium)]'
                                                            : 'bg-[var(--color-difficulty-hard)]'
                                                        }`}
                                                />

                                                <span
                                                    className={`min-w-0 flex-1 truncate font-mono text-[0.6875rem] ${activeProblemIndex === index
                                                        ? 'text-[var(--color-text)]'
                                                        : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-soft)]'
                                                        }`}
                                                >
                                                    {problem.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </aside>

                                <div className="border-b border-white/[0.07] p-4 lg:border-b-0 lg:border-r lg:border-white/[0.07]">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-base font-semibold text-[var(--color-text)]">
                                                {activeProblem?.title ?? 'Two Sum'}
                                            </p>
                                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                                {activeProblem?.tag ?? 'Array · Hash Map'}
                                            </p>
                                        </div>

                                        {activeProblem && (
                                            <span
                                                className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold ${difficultyStyles[activeProblem.difficulty]}`}
                                            >
                                                {activeProblem.difficulty}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm leading-relaxed text-[var(--color-text-soft)]">
                                        Resuelve problemas con restricciones claras, prueba tus casos
                                        y mejora tu técnica con feedback inmediato.
                                    </p>

                                    <div className="mt-5 rounded-xl border border-white/[0.07] bg-[rgba(2,6,23,0.58)] p-4 font-mono text-[0.6875rem] leading-relaxed text-[var(--color-text-muted)]">
                                        <p>
                                            <span className="text-[var(--color-text-subtle)]">Input: </span>
                                            nums = [2, 7, 11, 15]
                                        </p>
                                        <p>
                                            <span className="text-[var(--color-text-subtle)]">Target: </span>
                                            9
                                        </p>
                                        <p>
                                            <span className="text-[var(--color-text-subtle)]">Output: </span>
                                            <span className="text-[var(--color-success)]">[0, 1]</span>
                                        </p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {['Arrays', 'Hash Map', 'Búsqueda'].map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 font-mono text-[0.625rem] text-[var(--color-text-muted)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-5 rounded-xl border border-[rgba(255,107,0,0.14)] bg-[rgba(255,107,0,0.06)] p-3">
                                        <div className="flex items-center gap-2">
                                            <Zap
                                                className="h-3.5 w-3.5 text-[var(--color-secondary)]"
                                                aria-hidden="true"
                                            />
                                            <p className="text-xs font-semibold text-[var(--color-text)]">
                                                Objetivo de práctica
                                            </p>
                                        </div>
                                        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                                            Identificar patrón, resolver limpio y revisar complejidad.
                                        </p>
                                    </div>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex border-b border-white/[0.07]">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('code')}
                                            className={`border-b px-4 py-3 text-xs font-medium transition-colors ${activeTab === 'code'
                                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                                }`}
                                        >
                                            Código
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('tests')}
                                            className={`border-b px-4 py-3 text-xs font-medium transition-colors ${activeTab === 'tests'
                                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                                }`}
                                        >
                                            Pruebas
                                        </button>

                                        <div className="flex-1" />

                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-4 text-xs font-semibold text-[var(--color-success)]"
                                        >
                                            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                                            Run
                                        </button>
                                    </div>

                                    {activeTab === 'code' ? (
                                        <pre className={codeScrollerClassName}>
                                            {codeLines.map((line) => (
                                                <div key={line.n} className="flex">
                                                    <span className="w-9 shrink-0 select-none pr-3 text-right text-[var(--color-text-muted)] opacity-60">
                                                        {line.n}
                                                    </span>
                                                    <code className="min-w-max pr-4">{line.content}</code>
                                                </div>
                                            ))}
                                        </pre>
                                    ) : (
                                        <div className="p-4">
                                            <div className="space-y-2">
                                                {testCases.map((test) => (
                                                    <div
                                                        key={test.input}
                                                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.07] bg-[rgba(7,18,37,0.66)] px-3 py-2.5"
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />

                                                        <div className="min-w-0">
                                                            <p className="truncate font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                                                                {test.input}
                                                            </p>
                                                            <p className="font-mono text-[0.6875rem] text-[var(--color-success)]">
                                                                {test.output}
                                                            </p>
                                                        </div>

                                                        <span className="font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                                                            {test.time}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 flex items-center justify-between rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.08)] px-3 py-2.5 font-mono text-[0.6875rem] text-[var(--color-success)]">
                                                <span>✓ Aceptado — 3/3</span>
                                                <span className="text-[var(--color-text-muted)]">14.2 MB</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] bg-[rgba(7,11,20,0.78)] px-4 py-3">
                                <StatusPill icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Aceptación 68.3%" />
                                <StatusPill icon={<ListChecks className="h-3.5 w-3.5" />} label="2 841 envíos" />
                                <StatusPill icon={<Trophy className="h-3.5 w-3.5" />} label="Rating estimado: 800" />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </section>
    )
}

function MetricRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[rgba(7,18,37,0.54)] px-3 py-2">
            <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
            <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                {value}
            </span>
        </div>
    )
}

function StatusPill({
    icon,
    label,
}: {
    icon: React.ReactNode
    label: string
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
            <span className="text-[var(--color-primary)]">{icon}</span>
            {label}
        </span>
    )
}