import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import logo from '@/assets/icons/logo.png'
import { createHighlighter } from 'shiki'
import {
  CheckCircle2,
  ChevronDown,
  Code2,
  ListChecks,
  Play,
  Search,
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

const languages = ['C', 'Python', 'JavaScript', 'TypeScript', 'Rust'] as const
type Language = (typeof languages)[number]

const snippets: Record<string, Record<Language, string>> = {
  'Two Sum': {
    C: `/* O(n²) · búsqueda lineal */\nint* twoSum(int* nums, int size, int target) {\n  for (int i = 0; i < size; i++)\n    for (int j = i + 1; j < size; j++)\n      if (nums[i] + nums[j] == target) return pair(i, j);\n  return NULL;\n}`,
    Python: `# O(n) · hash map\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []`,
    JavaScript: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (seen.has(diff)) return [seen.get(diff), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
    TypeScript: `function twoSum(nums: number[], target: number): number[] {\n  const seen = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (seen.has(diff)) return [seen.get(diff)!, i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
    Rust: `use std::collections::HashMap;\nfn two_sum(nums: Vec<i32>, target: i32) -> Vec<usize> {\n  let mut seen = HashMap::new();\n  for (i, &n) in nums.iter().enumerate() {\n    if let Some(&j) = seen.get(&(target - n)) { return vec![j, i]; }\n    seen.insert(n, i);\n  }\n  vec![]\n}`,
  },
  'Binary Search': {
    C: `int search(int* nums, int size, int target) {\n  int lo = 0, hi = size - 1;\n  while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (nums[mid] == target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}`,
    Python: `def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target: return mid\n        if nums[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1`,
    JavaScript: `function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}`,
    TypeScript: `function search(nums: number[], target: number): number {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}`,
    Rust: `fn search(nums: &[i32], target: i32) -> i32 {\n  let (mut lo, mut hi) = (0i32, nums.len() as i32 - 1);\n  while lo <= hi {\n    let mid = lo + (hi - lo) / 2;\n    if nums[mid as usize] == target { return mid; }\n    if nums[mid as usize] < target { lo = mid + 1; } else { hi = mid - 1; }\n  }\n  -1\n}`,
  },
  'Dynamic Paths': {
    C: `int paths(int rows, int cols) {\n  int dp[rows][cols];\n  for (int r = 0; r < rows; r++)\n    for (int c = 0; c < cols; c++)\n      dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r-1][c] + dp[r][c-1];\n  return dp[rows-1][cols-1];\n}`,
    Python: `def paths(rows, cols):\n    dp = [[1] * cols for _ in range(rows)]\n    for r in range(1, rows):\n        for c in range(1, cols):\n            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\n    return dp[-1][-1]`,
    JavaScript: `function paths(rows, cols) {\n  const dp = Array.from({ length: rows }, () => Array(cols).fill(1));\n  for (let r = 1; r < rows; r++)\n    for (let c = 1; c < cols; c++) dp[r][c] = dp[r-1][c] + dp[r][c-1];\n  return dp[rows - 1][cols - 1];\n}`,
    TypeScript: `function paths(rows: number, cols: number): number {\n  const dp = Array.from({ length: rows }, () => Array(cols).fill(1));\n  for (let r = 1; r < rows; r++)\n    for (let c = 1; c < cols; c++) dp[r][c] = dp[r-1][c] + dp[r][c-1];\n  return dp[rows - 1][cols - 1];\n}`,
    Rust: `fn paths(rows: usize, cols: usize) -> i32 {\n  let mut dp = vec![vec![1; cols]; rows];\n  for r in 1..rows {\n    for c in 1..cols { dp[r][c] = dp[r-1][c] + dp[r][c-1]; }\n  }\n  dp[rows-1][cols-1]\n}`,
  },
}

const testCases = [
  { input: '[2, 7, 11, 15], 9', output: '[0, 1]', time: '8ms' },
  { input: '[3, 2, 4], 6', output: '[1, 2]', time: '6ms' },
  { input: '[3, 3], 6', output: '[0, 1]', time: '5ms' },
]
const testCasesByProblem: Record<string, typeof testCases> = {
  'Two Sum': testCases,
  'Binary Search': [
    { input: '[-1, 0, 3, 5, 9, 12], 9', output: '4', time: '4ms' },
    { input: '[-1, 0, 3, 5, 9, 12], 2', output: '-1', time: '3ms' },
    { input: '[5], 5', output: '0', time: '2ms' },
  ],
  'Dynamic Paths': [
    { input: '3, 7', output: '28', time: '5ms' },
    { input: '3, 2', output: '3', time: '3ms' },
    { input: '1, 1', output: '1', time: '1ms' },
  ],
}

const problemDetails: Record<string, { input: string; target: string; output: string; tags: string[]; objective: string }> = {
  'Two Sum': { input: 'nums = [2, 7, 11, 15]', target: '9', output: '[0, 1]', tags: ['Arrays', 'Hash Map', 'Búsqueda'], objective: 'Identificar patrón, resolver limpio y revisar complejidad.' },
  'Binary Search': { input: 'nums = [-1, 0, 3, 5, 9, 12]', target: '9', output: '4', tags: ['Arrays', 'Ordenado', 'Búsqueda'], objective: 'Reducir el espacio de búsqueda a la mitad en cada paso.' },
  'Dynamic Paths': { input: 'rows = 3, cols = 7', target: '—', output: '28', tags: ['DP', 'Matriz', 'Tabulación'], objective: 'Construir la solución a partir de subproblemas conocidos.' },
}

export function ProblemsSection() {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const [activeProblemIndex, setActiveProblemIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'code' | 'tests'>('code')
  const [activeLanguage, setActiveLanguage] = useState<Language>('Python')
  const [highlightedCode, setHighlightedCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: editorContainerRef, offset: ['start end', 'end start'] })
  const revealProgress = useTransform(scrollYProgress, [0, 0.45, 1], [0, 1, 1])
  const rotateX = useSpring(useTransform(revealProgress, [0, 1], [18, 0]), { stiffness: 180, damping: 28 })
  const scale = useSpring(useTransform(revealProgress, [0, 1], [0.85, 1]), { stiffness: 180, damping: 28 })
  const glowOpacity = useTransform(revealProgress, [0, 1], [0, 1])

  const activeProblem = previewProblems[activeProblemIndex] ?? previewProblems[0]
  const problemSlug = activeProblem?.title?.toLowerCase().replaceAll(' ', '-') ?? 'two-sum'
  const activeDetails = problemDetails[activeProblem?.title ?? 'Two Sum'] ?? problemDetails['Two Sum']
  const activeTests = testCasesByProblem[activeProblem?.title ?? 'Two Sum'] ?? testCases
  const sourceCode = snippets[activeProblem?.title ?? 'Two Sum']?.[activeLanguage] ?? ''

  useEffect(() => {
    let cancelled = false
    void createHighlighter({ themes: ['github-dark'], langs: ['c', 'python', 'javascript', 'typescript', 'rust'] }).then((highlighter) => {
      if (cancelled) return
      const lang = activeLanguage === 'C' ? 'c' : activeLanguage.toLowerCase()
      setHighlightedCode(highlighter.codeToHtml(sourceCode, { lang, theme: 'github-dark' }))
      highlighter.dispose()
    })
    return () => { cancelled = true }
  }, [activeLanguage, sourceCode])

  const handleRun = () => {
    if (isRunning) return
    setIsRunning(true)
    setRunResult(null)
    window.setTimeout(() => {
      setIsRunning(false)
      setRunResult('Aceptado · Runtime: 42ms · más rápido que el 78% de las soluciones')
    }, 420)
  }

  return (
    <motion.section
      id="problems"
      className="relative z-10 isolate overflow-hidden border-b border-[var(--color-border-soft)] bg-transparent"
      aria-labelledby="problems-title"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <SectionContainer className="py-24 lg:py-32">
        <motion.div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
          <LandingBadge>
            Problems engine
          </LandingBadge>

          <motion.h2
            id="problems-title"
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-5 text-balance text-3xl font-black tracking-[-0.04em] text-[var(--color-text)] sm:text-4xl lg:text-5xl"
          >
            Practica con problemas claros, feedback rápido y progreso medible.
          </motion.h2>

          <motion.p variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.35, ease: 'easeOut' }} className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-soft)]">
            La sección de problemas concentra el flujo principal de Codenix:
            elegir un reto, entender restricciones, probar soluciones y medir
            tu avance sin ruido.
          </motion.p>
        </motion.div>

        <motion.div className="mb-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-y border-[var(--color-border-soft)] py-3 font-mono text-[0.6875rem] text-[var(--color-text-muted)]" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}>
          <span><AnimatedMetric value={68.3} decimals={1} suffix="%" /> aceptación</span>
          <span><AnimatedMetric value={2841} suffix="" /> envíos simulados</span>
          <span><AnimatedMetric value={800} suffix="" /> rating estimado</span>
        </motion.div>

        <div>

          <div ref={editorContainerRef} className="relative [perspective:1200px]">
            <motion.div style={{ opacity: reducedMotion ? 1 : glowOpacity }} className="pointer-events-none absolute -left-8 top-12 -z-10 h-44 w-44 rounded-full bg-[var(--color-primary-soft)] blur-3xl" />
            <div className="absolute -right-8 bottom-8 -z-10 h-48 w-48 rounded-full bg-[var(--color-accent-muted-soft)] blur-3xl" />

            <motion.div style={reducedMotion ? { rotateX: 0, scale: 1 } : { rotateX, scale }} className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-soft)] text-left shadow-[var(--shadow-xl)] [transform-style:preserve-3d]">
              <div className="flex h-12 items-center justify-between border-b border-white/[0.07] bg-[rgba(7,11,20,0.78)] px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-6 w-6 shrink-0 bg-[var(--color-logo-mark)]"
                      style={{ mask: `url(${logo}) center / contain no-repeat`, WebkitMask: `url(${logo}) center / contain no-repeat` }}
                      aria-hidden="true"
                    />
                  <span className="truncate font-mono text-[0.6875rem] font-medium text-[var(--color-text-muted)]">
                    codenix://problems/{problemSlug}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
                  {activeLanguage}
                  <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </div>
              </div>

              <div className="grid lg:grid-cols-[190px_minmax(230px,0.82fr)_minmax(0,1.18fr)]">
                <aside className="border-b border-white/[0.07] lg:border-b-0 lg:border-r lg:border-white/[0.07]">
                  <div className="border-b border-white/[0.07] p-3">
                    <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-2">
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
                        onClick={() => { setActiveProblemIndex(index); setRunResult(null) }}
                        className={`group flex w-full items-center gap-2 rounded-[var(--radius-lg)] px-2 py-2 text-left transition duration-200 ${
                          activeProblemIndex === index
                            ? 'bg-[rgba(11,127,195,0.16)]'
                            : 'hover:bg-[var(--color-bg-soft)]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            problem.difficulty === 'Fácil'
                              ? 'bg-[var(--color-difficulty-easy)]'
                              : problem.difficulty === 'Medio'
                                ? 'bg-[var(--color-difficulty-medium)]'
                                : 'bg-[var(--color-difficulty-hard)]'
                          }`}
                        />
                        <span
                          className={`min-w-0 flex-1 truncate font-mono text-[0.6875rem] ${
                            activeProblemIndex === index
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
                        className={`shrink-0 rounded-[var(--radius-full)] border px-2 py-0.5 text-[0.625rem] font-semibold ${difficultyStyles[activeProblem.difficulty]}`}
                      >
                        {activeProblem.difficulty}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--color-text-soft)]">
                    Resuelve problemas con restricciones claras, prueba tus casos
                    y mejora tu técnica con feedback inmediato.
                  </p>

                  <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg)] p-4 font-mono text-[0.6875rem] leading-relaxed text-[var(--color-text-muted)]">
                    <p><span className="text-[var(--color-text-subtle)]">Input: </span>{activeDetails.input}</p>
                    <p><span className="text-[var(--color-text-subtle)]">Target: </span>{activeDetails.target}</p>
                    <p>
                      <span className="text-[var(--color-text-subtle)]">Output: </span>
                      <span className="text-[var(--color-success)]">{activeDetails.output}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeDetails.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-[var(--radius-md)] border border-white/[0.07] bg-white/[0.02] px-2 py-1 font-mono text-[0.625rem] text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                      <div className="mt-5 rounded-[var(--radius-xl)] border border-[var(--color-stat-border)] bg-[var(--color-stat-icon-bg)] p-3">
                    <div className="flex items-center gap-2">
                      <Zap
                        className="h-3.5 w-3.5 text-[var(--color-primary)]"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        Objetivo de práctica
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                      {activeDetails.objective}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="border-b border-white/[0.07]">
                    <motion.div className="flex items-center gap-1 overflow-x-auto px-2 pt-1 [scrollbar-width:none]" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
                      {languages.map((language) => (
                        <motion.button key={language} type="button" onClick={() => setActiveLanguage(language)} variants={{ hidden: { opacity: 0, x: 8 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }} className={`min-h-11 shrink-0 border-b-2 px-3 text-[0.6875rem] font-medium transition-colors ${activeLanguage === language ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`} aria-pressed={activeLanguage === language}>
                          {language}
                        </motion.button>
                      ))}
                    </motion.div>
                  <div className="flex items-center border-t border-white/[0.07]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className={`border-b px-4 py-3 text-xs font-medium transition-colors ${
                        activeTab === 'code'
                          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      Código
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('tests')}
                      className={`border-b px-4 py-3 text-xs font-medium transition-colors ${
                        activeTab === 'tests'
                          ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      Pruebas
                    </button>

                    <div className="flex-1" />

                    <button
                      type="button"
                      onClick={handleRun}
                      className="ml-auto inline-flex min-h-11 items-center gap-1.5 px-4 text-xs font-semibold text-[var(--color-success)] transition-colors hover:text-white disabled:cursor-wait"
                      disabled={isRunning}
                    >
                      {isRunning ? <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" aria-hidden="true" /> : <Play className="h-3 w-3 fill-current" aria-hidden="true" />}
                      {isRunning ? 'Ejecutando…' : 'Run'}
                    </button>
                  </div>
                  </div>

                  {activeTab === 'code' ? (
                    <AnimatePresence mode="wait" initial={!reducedMotion}>
                      <motion.div key={`${activeProblem?.title}-${activeLanguage}`} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.15 }} className={`${codeScrollerClassName} codenix-shiki`} dangerouslySetInnerHTML={{ __html: highlightedCode || `<pre>${sourceCode.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</pre>` }} />
                    </AnimatePresence>
                  ) : (
                    <div className="p-4">
                      <div className="space-y-2">
                        {activeTests.map((test) => (
                          <div
                            key={test.input}
                            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-3 py-2.5"
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

                      <div className="mt-3 flex items-center justify-between rounded-[var(--radius-xl)] border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.08)] px-3 py-2.5 font-mono text-[0.6875rem] text-[var(--color-success)]">
                        <span>✓ Aceptado - 3/3</span>
                        <span className="text-[var(--color-text-muted)]">14.2 MB</span>
                      </div>
                    </div>
                  )}
                  {runResult && <p role="status" className="border-t border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.08)] px-4 py-3 font-mono text-[0.6875rem] text-[var(--color-success)]">✓ {runResult}</p>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] bg-[rgba(7,11,20,0.78)] px-4 py-3">
                <StatusPill icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Aceptación 68.3%" />
                <StatusPill icon={<ListChecks className="h-3.5 w-3.5" />} label="2 841 envíos" />
                <StatusPill icon={<Trophy className="h-3.5 w-3.5" />} label="Rating estimado: 800" />
              </div>
            </motion.div>
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  )
}

function AnimatedMetric({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const reducedMotion = useReducedMotion()
  const progress = useMotionValue(reducedMotion ? value : 0)
  const display = useTransform(progress, (latest) => {
    const formatted = latest.toLocaleString('es-PE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replaceAll(',', ' ')
    return `${formatted}${suffix}`
  })

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      progress.set(value)
      return
    }
    const controls = animate(progress, value, { duration: 0.85, ease: 'easeOut' })
    return () => controls.stop()
  }, [inView, progress, reducedMotion, value])

  return <motion.strong ref={ref} className="text-[var(--color-text)]">{display}</motion.strong>
}

function StatusPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 font-mono text-[0.6875rem] text-[var(--color-text-muted)]">
      <span className="text-[var(--color-primary)]">{icon}</span>
      {label}
    </span>
  )
}
