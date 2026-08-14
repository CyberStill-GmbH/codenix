import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import { Check, Play, Terminal } from 'lucide-react'

import { landingTokens } from '@/features/landing/theme/tokens'

hljs.registerLanguage('typescript', typescript)

const solution = `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (seen.has(complement)) return [seen.get(complement)!, i]
    seen.set(nums[i], i)
  }
  return []
}`

const tests = [
  { input: '[2, 7, 11, 15], 9', output: '[0, 1]', time: '8 ms' },
  { input: '[3, 2, 4], 6', output: '[1, 2]', time: '6 ms' },
]

export function ProductMockupCard() {
  const reducedMotion = useReducedMotion()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const highlightedLines = useMemo(
    () => hljs.highlight(solution, { language: 'typescript' }).value.split('\n'),
    [],
  )

  return (
    <div
      className={`${landingTokens.hero.mockupShell} [perspective:1200px]`}
      aria-label="Editor de código de Codenix"
      onPointerMove={(event) => {
        if (reducedMotion) return
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        setTilt({ x: y * -5, y: x * 6 })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        className={landingTokens.hero.mockupPanel}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 180ms ease-out', transformStyle: 'preserve-3d' }}
        animate={(isRunning || showMascot) && !reducedMotion ? { opacity: 0, x: 260, scaleX: 0.72 } : { opacity: 1, x: 0, scaleX: 1 }}
        transition={{ duration: isRunning || showMascot ? 0.26 : 0.42, ease: 'easeInOut' }}
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 80, scaleX: 0.97 }}
          animate={isRunning && !reducedMotion ? { opacity: 0, x: 220, scaleX: 0.78 } : { opacity: 1, x: 0, scaleX: 1 }}
          transition={{ duration: isRunning ? 0.22 : 0.34, ease: 'easeInOut' }}
        >
        <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-bg)] px-4 py-3">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Terminal className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="font-mono text-xs">two-sum.ts</span>
          </div>
          <button type="button" disabled={isRunning || showMascot} onClick={() => { setIsRunning(true); window.setTimeout(() => { setIsRunning(false); setShowMascot(true) }, 420) }} className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2.5 py-1.5 text-[0.6875rem] font-semibold text-white transition duration-150 hover:scale-[1.03] hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-70">
            <Play className="h-3 w-3 fill-current" /> {isRunning ? 'Ejecutando' : 'Ejecutar'}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <pre className="overflow-x-auto border-b border-[var(--color-border-soft)] bg-[var(--color-bg)] px-4 py-5 font-mono text-[0.68rem] leading-6 lg:border-b-0 lg:border-r">
            {highlightedLines.map((line, index) => (
              <motion.code
                key={`${index}-${line}`}
                className="block min-w-max"
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={reducedMotion ? undefined : { duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
                dangerouslySetInnerHTML={{ __html: `<span class="mr-4 inline-block w-4 select-none text-right text-[var(--color-text-subtle)]">${index + 1}</span>${line || ' '}` }}
              />
            ))}
          </pre>

          <div className="bg-[var(--color-surface)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">Tests</p>
              <span className="font-mono text-[0.625rem] text-[var(--color-text-subtle)]">2/2</span>
            </div>
            <div className="space-y-2">
              {tests.map((test, index) => (
                <div key={test.input} className="rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                    <span className="font-mono text-[0.625rem] text-[var(--color-text-muted)]">Caso {index + 1}</span>
                    <span className="ml-auto font-mono text-[0.625rem] text-[var(--color-text-subtle)]">{test.time}</span>
                  </div>
                  <p className="mt-2 truncate font-mono text-[0.625rem] text-[var(--color-text-soft)]">{test.input}</p>
                  <p className="mt-1 font-mono text-[0.625rem] text-[var(--color-success)]">→ {test.output}</p>
                </div>
              ))}
            </div>
            <motion.div
              className="mt-4 flex items-center gap-2 border-t border-[var(--color-border-soft)] pt-4 text-xs font-semibold text-[var(--color-success)]"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reducedMotion ? undefined : { delay: 0.5, duration: 0.3, ease: 'easeOut' }}
            >
              <Check className="h-4 w-4" /> Aceptado
            </motion.div>
          </div>
        </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[-8rem] top-1/2 z-20 hidden w-[36rem] max-w-none -translate-y-1/2 select-none md:block"
        initial={false}
        animate={showMascot ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, x: 70, y: 12, scale: 0.82 }}
        transition={{ duration: reducedMotion ? 0 : showMascot ? 0.42 : 0.25, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <img src="/mascotaWhere.png" alt="" className="h-auto w-full drop-shadow-[0_28px_32px_rgba(0,0,0,0.58)] motion-safe:animate-[codenix-mascot-hover_3.8s_ease-in-out_infinite]" />
      </motion.div>
    </div>
  )
}
