import { useEffect } from 'react'

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function scrollToY(targetY: number, duration = 1100) {
  const startY = window.scrollY
  const delta = targetY - startY
  if (Math.abs(delta) < 2) return
  const start = performance.now()

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    window.scrollTo(0, startY + delta * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Smooth in-page navigation for hash links (nav, buttons). */
export function SmoothScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return

      const href = link.getAttribute('href')
      if (!href || href === '#') return

      const el = document.querySelector(href)
      if (!(el instanceof HTMLElement)) return

      event.preventDefault()
      const top = el.getBoundingClientRect().top + window.scrollY - 12
      scrollToY(top, 1200)
      history.pushState(null, '', href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
