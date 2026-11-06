import { useCallback, useRef, useState, type ReactNode } from 'react'

type MagnetProps = {
  children: ReactNode
  className?: string
  padding?: number
  strength?: number
  activeTransition?: string
  inactiveTransition?: string
}

export function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState({
    transform: 'translate3d(0px, 0px, 0)',
    transition: inactiveTransition,
    willChange: 'transform' as const,
  })

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = event.clientX - centerX
      const distY = event.clientY - centerY
      const near =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding

      if (!near) {
        setStyle({
          transform: 'translate3d(0px, 0px, 0)',
          transition: inactiveTransition,
          willChange: 'transform',
        })
        return
      }

      setStyle({
        transform: `translate3d(${distX / strength}px, ${distY / strength}px, 0)`,
        transition: activeTransition,
        willChange: 'transform',
      })
    },
    [activeTransition, inactiveTransition, padding, strength],
  )

  const onLeave = useCallback(() => {
    setStyle({
      transform: 'translate3d(0px, 0px, 0)',
      transition: inactiveTransition,
      willChange: 'transform',
    })
  }, [inactiveTransition])

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}
