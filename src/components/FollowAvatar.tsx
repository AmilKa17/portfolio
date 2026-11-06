import { useEffect, useRef } from 'react'

type Target = { x: number; y: number }

/**
 * Flat AI bust that gently tracks the cursor across the whole page.
 * Soft damp only - no twitchy snaps.
 */
export function FollowAvatar() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const target = useRef<Target>({ x: 0, y: 0 })
  const current = useRef<Target>({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      target.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      }
    }

    const onLeave = () => {
      target.current = { x: 0, y: 0 }
    }

    const tick = () => {
      const el = wrapRef.current
      const t = target.current
      const c = current.current
      // slow ease toward pointer
      c.x += (t.x - c.x) * 0.045
      c.y += (t.y - c.y) * 0.045

      if (el) {
        const rotY = c.x * 9
        const rotX = -c.y * 6
        const shiftX = c.x * 10
        const shiftY = c.y * 6
        el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`
      }

      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div className="pointer-events-none relative mx-auto flex h-full w-full items-end justify-center [perspective:1200px]">
      <div
        ref={wrapRef}
        className="origin-[50%_70%] will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}amil-avatar.png`}
          alt="Amil avatar"
          className="mx-auto h-[min(72vh,720px)] w-auto max-w-[min(92vw,520px)] select-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
          draggable={false}
        />
      </div>
    </div>
  )
}
