import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

const ACCENT = '11, 127, 195'

export function HeroFogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const noise = createNoise2D()
    const pointer = { x: 0.72, y: 0.42, targetX: 0.72, targetY: 0.42 }
    const nodes = Array.from({ length: 30 }, (_, index) => ({
      x: 0.04 + ((index * 0.173) % 0.92),
      y: 0.08 + ((index * 0.317) % 0.82),
      phase: noise(index * 0.4, 0.5) * Math.PI,
    }))
    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    const resize = () => {
      const bounds = section.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.save()
      context.filter = 'blur(24px)'
      context.lineCap = 'round'
      for (let band = 0; band < 3; band += 1) {
        context.beginPath()
        const baseline = height * (0.2 + band * 0.18)
        context.moveTo(-80, baseline)
        context.bezierCurveTo(width * 0.22, baseline - height * 0.18, width * 0.44, baseline + height * 0.16, width * 0.68, baseline - height * 0.04)
        context.bezierCurveTo(width * 0.82, baseline - height * 0.12, width * 0.95, baseline + height * 0.08, width + 80, baseline - height * 0.02)
        context.strokeStyle = `rgba(${ACCENT}, ${0.055 - band * 0.008})`
        context.lineWidth = 58 - band * 10
        context.stroke()
      }
      context.restore()
      const texture = context.createRadialGradient(width * 0.66, height * 0.44, 0, width * 0.66, height * 0.44, Math.max(width, height) * 0.78)
      texture.addColorStop(0, `rgba(${ACCENT}, 0.075)`)
      texture.addColorStop(1, `rgba(${ACCENT}, 0)`)
      context.fillStyle = texture
      context.fillRect(0, 0, width, height)

      const mouseX = pointer.x * width
      const mouseY = pointer.y * height
      nodes.forEach((node, index) => {
        const x = node.x * width
        const y = node.y * height
        const distance = Math.hypot(x - mouseX, y - mouseY)
        const influence = Math.max(0, 1 - distance / 180)
        const opacity = 0.05 + influence * 0.48
        if (index % 2 === 0) {
          context.beginPath()
          context.arc(x, y, 1.2 + influence * 1.6, 0, Math.PI * 2)
          context.fillStyle = `rgba(${ACCENT}, ${opacity})`
          context.fill()
        }
        nodes.slice(index + 1).forEach((other) => {
          const otherX = other.x * width
          const otherY = other.y * height
          const edgeDistance = Math.hypot(x - otherX, y - otherY)
          if (edgeDistance > 150) return
          const edgeInfluence = Math.max(influence, 1 - Math.hypot(otherX - mouseX, otherY - mouseY) / 180)
          context.beginPath()
          context.moveTo(x, y)
          context.lineTo(otherX, otherY)
          context.strokeStyle = `rgba(${ACCENT}, ${0.028 + edgeInfluence * 0.18})`
          context.lineWidth = 0.7
          context.stroke()
        })
      })

      const glow = context.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, Math.max(width, height) * 0.34)
      glow.addColorStop(0, `rgba(${ACCENT}, 0.2)`)
      glow.addColorStop(0.42, `rgba(${ACCENT}, 0.07)`)
      glow.addColorStop(1, `rgba(${ACCENT}, 0)`)
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)
    }

    const animate = () => {
      if (!visible) return
      pointer.x += (pointer.targetX - pointer.x) * 0.055
      pointer.y += (pointer.targetY - pointer.y) * 0.055
      draw()
      frame = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (mobile || reducedMotion) return
      const bounds = section.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return
      pointer.targetX = (event.clientX - bounds.left) / bounds.width
      pointer.targetY = (event.clientY - bounds.top) / bounds.height
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !reducedMotion && !mobile && !frame) frame = window.requestAnimationFrame(animate)
      if (!visible && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }, { threshold: 0.15 })

    resize()
    observer.observe(section)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', resize)
    if (!reducedMotion && !mobile) frame = window.requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', resize)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={sectionRef} className="pointer-events-none absolute inset-0 z-0 mix-blend-screen" aria-hidden="true"><canvas ref={canvasRef} /></div>
}
