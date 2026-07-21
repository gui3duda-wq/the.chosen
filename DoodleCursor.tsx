'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * DoodleCursor — efeito estilo Lando Norris.
 * Substitui o cursor por um ponteiro sketchy que deixa um rastro
 * de desenhos à mão (estrelas, círculos, setas) que surgem e somem.
 * Apenas em dispositivos com mouse (pointer: fine).
 */
export default function DoodleCursor() {
  const [enabled, setEnabled] = useState(false)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [doodles, setDoodles] = useState<{ id: number; x: number; y: number; type: string; rot: number }[]>([])
  const idRef = useRef(0)
  const lastDropRef = useRef(0)

  useEffect(() => {
    // One-time browser capability detection (desktop with mouse).
    // setState here is intentional: we can't know matchMedia result during SSR.
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true)

    let raf = 0
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = !!target.closest('a, button, [data-cursor="hover"], input, textarea, select, [role="button"]')
      setHovering(interactive)

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY })

        // Drop a doodle periodically when moving
        const now = performance.now()
        if (now - lastDropRef.current > 280 && Math.random() > 0.35) {
          lastDropRef.current = now
          const types = ['star', 'circle', 'arrow', 'spark', 'cross']
          const type = types[Math.floor(Math.random() * types.length)]
          const id = idRef.current++
          const offsetX = (Math.random() - 0.5) * 60
          const offsetY = (Math.random() - 0.5) * 60
          setDoodles((prev) => [
            ...prev.slice(-14),
            { id, x: e.clientX + offsetX, y: e.clientY + offsetY, type, rot: Math.random() * 360 },
          ])
          // auto-remove
          setTimeout(() => {
            setDoodles((prev) => prev.filter((d) => d.id !== id))
          }, 900)
        }
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      {/* Dropped doodles trail */}
      {doodles.map((d) => (
        <div
          key={d.id}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            transform: `translate(-50%, -50%) rotate(${d.rot}deg)`,
          }}
        >
          <DoodleShape type={d.type} />
        </div>
      ))}

      {/* Main cursor */}
      <div
        className="absolute transition-[width,height] duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {hovering ? (
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
            {/* hand-drawn circle around hovered element */}
            <path
              d="M 8 23 C 8 12, 16 6, 23 6 C 32 6, 40 13, 40 23 C 40 33, 32 40, 23 40 C 14 40, 8 33, 8 22"
              stroke="oklch(0.62 0.20 250)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 6px oklch(0.62 0.20 250 / 0.6))' }}
            />
            <path
              d="M 23 14 L 23 32 M 14 23 L 32 23"
              stroke="oklch(0.62 0.20 250)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {/* arrow/sketch pointer */}
            <path
              d="M 3 3 L 3 16 L 7 12 L 10 18 L 12 17 L 9 11 L 15 11 Z"
              stroke="oklch(0.85 0.15 240)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="oklch(0.16 0.03 255)"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

function DoodleShape({ type }: { type: string }) {
  const stroke = 'oklch(0.62 0.20 250)'
  const common = {
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }
  const size = 26

  switch (type) {
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M 12 2 L 14 9 L 22 10 L 16 15 L 18 22 L 12 18 L 6 22 L 8 15 L 2 10 L 10 9 Z" {...common} className="animate-draw" />
        </svg>
      )
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M 4 12 C 4 6, 9 3, 13 3 C 19 3, 21 8, 21 12 C 21 18, 16 21, 12 21 C 7 21, 4 17, 4 11" {...common} className="animate-draw" />
        </svg>
      )
    case 'arrow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M 3 12 C 8 12, 14 12, 20 12 M 15 7 L 20 12 L 15 17" {...common} className="animate-draw" />
        </svg>
      )
    case 'spark':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M 12 4 L 12 9 M 12 15 L 12 20 M 4 12 L 9 12 M 15 12 L 20 12 M 6 6 L 9 9 M 15 15 L 18 18 M 18 6 L 15 9 M 9 15 L 6 18" {...common} className="animate-draw" />
        </svg>
      )
    case 'cross':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M 6 6 L 18 18 M 18 6 L 6 18" {...common} className="animate-draw" />
        </svg>
      )
    default:
      return null
  }
}
