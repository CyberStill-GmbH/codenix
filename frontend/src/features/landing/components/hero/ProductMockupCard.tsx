import { motion, useReducedMotion } from 'motion/react'
import { Terminal } from '@/components/ui/terminal'

export function ProductMockupCard() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative w-full [perspective:1400px]" aria-label="Terminal de práctica de Codenix">
      <motion.div
        className="relative"
        initial={reducedMotion ? false : { opacity: 0, y: 18, rotateY: -12, rotateX: 3 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, rotateY: -7, rotateX: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reducedMotion ? undefined : { y: -3, rotateY: -4 }}
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
      >
        <Terminal
          username="codenix"
          enableSound
          typingSpeed={38}
          delayBetweenCommands={900}
          initialDelay={350}
          className="max-w-none px-0 text-[0.72rem] sm:text-xs"
          commands={[
            'codenix solve two-sum --language typescript',
            'codenix test --cases 2',
            'codenix submit two-sum',
          ]}
          outputs={{
            0: ['✓ Editor listo: two-sum.ts', '✓ Plantilla TypeScript cargada'],
            1: ['✓ Caso 1 aceptado · 8 ms', '✓ Caso 2 aceptado · 6 ms'],
            2: ['Aceptado · Runtime: 42 ms', 'Progreso actualizado: Arrays · Hash Map'],
          }}
        />
      </motion.div>
    </div>
  )
}
