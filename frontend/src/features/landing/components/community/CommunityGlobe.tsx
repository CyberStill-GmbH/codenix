import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

type CommunityGlobeProps = { active: boolean }

const pointsData = [{ lat: -12.0464, lng: -77.0428, label: 'IEEE Computer Society UNI — Lima, Perú' }]

export default function CommunityGlobe({ active }: CommunityGlobeProps) {
  const globeRef = useRef<any>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(390)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const resize = () => setSize(Math.min(wrapper.clientWidth, 410))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const controls = globeRef.current?.controls?.()
    const renderer = globeRef.current?.renderer?.()
    if (controls) {
      controls.autoRotate = active && !reducedMotion
      controls.autoRotateSpeed = 0.38
      controls.enabled = active
      controls.enableZoom = false
    }
    renderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5))
  }, [active, reducedMotion])

  function pauseAfterDrag() {
    const controls = globeRef.current?.controls?.()
    if (!controls || reducedMotion) return
    controls.autoRotate = false
    window.setTimeout(() => {
      if (active) controls.autoRotate = true
    }, 1200)
  }

  return (
    <div ref={wrapperRef} className="relative z-10 h-[min(82vw,26rem)] w-full max-w-[26rem]" onPointerDown={() => { const controls = globeRef.current?.controls?.(); if (controls) controls.autoRotate = false }} onPointerUp={pauseAfterDrag}>
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#0B7FC3"
        atmosphereAltitude={0.12}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => '#0B7FC3'}
        pointAltitude={0.025}
        pointRadius={0.65}
        pointResolution={16}
        pointLabel="label"
        pointsMerge={false}
        showAtmosphere
        enablePointerInteraction
      />
    </div>
  )
}
