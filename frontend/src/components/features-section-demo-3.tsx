import React from 'react'
import { motion } from 'motion/react'
import { BookOpen, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  { title: 'Práctica de problemas', description: 'Resuelve retos con editor, casos de prueba y veredictos en un mismo flujo.', image: '/landing/problem-editor.png', alt: 'Editor de problemas de Codenix', className: 'lg:col-span-4 border-b lg:border-r border-[var(--color-border-soft)]' },
  { title: 'Progreso centralizado', description: 'Mira tus envíos, rachas y habilidades crecer con señales claras de avance.', image: '/landing/progress-profile.png', alt: 'Perfil de progreso de Codenix', className: 'lg:col-span-2 border-b border-[var(--color-border-soft)]' },
  { title: 'Contests y ranking', description: 'Compite, compara tu evolución y celebra cada solución con la comunidad.', visual: 'ranking', className: 'lg:col-span-3 lg:border-r border-[var(--color-border-soft)]' },
  { title: 'Aprendizaje estructurado', description: 'Sigue rutas por temas para convertir práctica suelta en criterio técnico.', image: '/landing/learning-library.png', alt: 'Biblioteca de problemas de Codenix', className: 'lg:col-span-3' },
]

export default function FeaturesSectionDemo() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="grid grid-cols-1 overflow-hidden border border-[var(--color-border-soft)] bg-[var(--color-surface)] lg:grid-cols-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} className={feature.className}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <div className="-mx-6 -mb-6 mt-7 h-[24rem] sm:-mx-8 sm:-mb-8 sm:h-[28rem]">{feature.image ? <FeatureImage src={feature.image} alt={feature.alt ?? ''} /> : <FeatureVisual kind={feature.visual} />}</div>
          </FeatureCard>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ children, className }: { children?: React.ReactNode; className?: string }) { return <div className={cn('relative min-h-[38rem] overflow-hidden p-6 sm:p-8', className)}>{children}</div> }
function FeatureTitle({ children }: { children?: React.ReactNode }) { return <h3 className="text-2xl font-bold tracking-[-0.035em] text-[var(--color-text)]">{children}</h3> }
function FeatureDescription({ children }: { children?: React.ReactNode }) { return <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">{children}</p> }

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return <div className="relative h-full overflow-hidden bg-[var(--color-bg)]"><img src={src} alt={alt} loading="lazy" className="absolute inset-x-0 top-0 h-full w-full object-cover object-top transition duration-500 hover:scale-[1.03]" /><div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/75 to-transparent" /><div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[var(--color-bg)]/30 to-transparent" /></div>
}

function FeatureVisual({ kind }: { kind?: string }) {
  if (kind === 'ranking') {
    return (
      <div className="relative flex h-full items-end justify-center gap-7 overflow-hidden border border-amber-300/20 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-transparent pb-8">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-7 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" aria-hidden="true" />
        <svg className="pointer-events-none absolute inset-x-[12%] top-[18%] h-24 w-[76%] text-amber-200/45" viewBox="0 0 420 100" fill="none" aria-hidden="true">
          <path d="M8 76C86 12 122 18 205 53s116 42 207-38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" />
          <circle cx="205" cy="53" r="4" fill="currentColor" />
        </svg>
        <span className="absolute left-[22%] top-[30%] h-1.5 w-1.5 rotate-45 bg-amber-200/80" aria-hidden="true" />
        <span className="absolute right-[24%] top-[22%] h-1 w-1 rotate-45 bg-amber-100/80" aria-hidden="true" />
        <span className="absolute left-[36%] top-[17%] h-1 w-1 rounded-full bg-amber-300/70" aria-hidden="true" />
        <span className="absolute right-[34%] top-[38%] font-mono text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-amber-100/65">top 3</span>
        {[{ place: 2, size: 'h-16 w-16', color: 'text-amber-300' }, { place: 1, size: 'h-24 w-24', color: 'text-amber-100' }, { place: 3, size: 'h-14 w-14', color: 'text-amber-400' }].map((cup, index) => (
          <motion.div key={cup.place} whileHover={{ y: -10, rotate: index === 1 ? 0 : index === 0 ? -5 : 5 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative z-10 flex items-center">
            <Trophy className={cn(cup.size, cup.color, 'drop-shadow-[0_8px_16px_rgba(251,191,36,0.32)]')} strokeWidth={1.5} aria-hidden="true" />
          </motion.div>
        ))}
      </div>
    )
  }
  return <div className="flex h-full items-center justify-center border border-violet-300/20 bg-gradient-to-br from-violet-400/20 via-fuchsia-400/10 to-transparent"><div className="relative grid h-32 w-56 place-items-center border border-white/10 bg-black/20 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"><BookOpen className="h-16 w-16 text-violet-200/80" aria-hidden="true" /><span className="absolute bottom-4 left-5 right-5 h-1 bg-violet-300/30" /></div></div>
}
