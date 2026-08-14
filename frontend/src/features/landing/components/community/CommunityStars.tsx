import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; radius: number; opacity: number; phase: number }

export function CommunityStars({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !parent || !context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars: Star[] = Array.from({ length: 100 }, (_, index) => ({
      x: (index * 47.3) % 100,
      y: (index * 71.7) % 100,
      radius: 0.6 + (index % 3) * 0.3,
      opacity: 0.2 + (index % 5) * 0.1,
      phase: (index % 9) * 0.7,
    }))
    let frame = 0
    let width = 0
    let height = 0

    const resize = () => {
      const bounds = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      stars.forEach((star, index) => {
        const twinkle = !reducedMotion && active && index % 7 === 0 ? Math.sin(time * 0.00035 + star.phase) * 0.12 : 0
        context.beginPath()
        context.arc((star.x / 100) * width, (star.y / 100) * height, star.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(226, 232, 240, ${Math.max(0.08, star.opacity + twinkle)})`
        context.fill()
      })
    }
    const animate = (time: number) => { draw(time); frame = window.requestAnimationFrame(animate) }
    resize()
    draw()
    const observer = new ResizeObserver(resize)
    observer.observe(parent)
    if (active && !reducedMotion) frame = window.requestAnimationFrame(animate)
    return () => { observer.disconnect(); if (frame) window.cancelAnimationFrame(frame) }
  }, [active])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
}
