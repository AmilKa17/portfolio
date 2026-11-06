import { useEffect, useMemo, useRef } from 'react'
import { marqueeItems, type MarqueeItem } from '../data/content'

function MarqueeTile({ item, playVideo }: { item: MarqueeItem; playVideo: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || item.kind !== 'video') return

    if (!playVideo) {
      video.pause()
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { rootMargin: '80px', threshold: 0.15 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [item.kind, playVideo])

  if (item.kind === 'video' && playVideo) {
    return (
      <video
        ref={videoRef}
        className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover [content-visibility:auto]"
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={item.title}
      />
    )
  }

  return (
    <img
      src={item.poster || item.src}
      alt={item.title}
      loading="lazy"
      decoding="async"
      className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover [content-visibility:auto]"
    />
  )
}

function Row({
  items,
  rowRef,
}: {
  items: MarqueeItem[]
  rowRef: React.RefObject<HTMLDivElement | null>
}) {
  // Only the first occurrence of each video actually plays.
  const seenVideos = new Set<string>()

  return (
    <div
      ref={rowRef}
      className="flex gap-3 will-change-transform"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {items.map((item, index) => {
        let playVideo = false
        if (item.kind === 'video') {
          if (!seenVideos.has(item.src)) {
            seenVideos.add(item.src)
            playVideo = true
          }
        }
        return (
          <MarqueeTile
            key={`${item.title}-${index}`}
            item={item}
            playVideo={playVideo}
          />
        )
      })}
    </div>
  )
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const row1Ref = useRef<HTMLDivElement | null>(null)
  const row2Ref = useRef<HTMLDivElement | null>(null)

  const row1Base = useMemo(
    () => marqueeItems.filter((_, i) => i % 2 === 0),
    [],
  )
  const row2Base = useMemo(
    () => marqueeItems.filter((_, i) => i % 2 === 1),
    [],
  )
  const row1 = useMemo(
    () => [...row1Base, ...row1Base, ...row1Base],
    [row1Base],
  )
  const row2 = useMemo(
    () => [...row2Base, ...row2Base, ...row2Base],
    [row2Base],
  )

  useEffect(() => {
    let raf = 0
    let running = true
    let target = 0
    let current = 0

    const measure = () => {
      const section = sectionRef.current
      if (!section) return
      target = (window.scrollY - section.offsetTop + window.innerHeight) * 0.28
    }

    const tick = () => {
      if (!running) return
      current += (target - current) * 0.14
      const a = current - 200
      if (row1Ref.current) {
        row1Ref.current.style.transform = `translate3d(${a}px,0,0)`
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translate3d(${-a}px,0,0)`
      }
      raf = window.requestAnimationFrame(tick)
    }

    measure()
    raf = window.requestAnimationFrame(tick)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      running = false
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div className="mb-8 px-6 md:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-[#D7E2EA]/50">Лента работ</p>
        <h2
          className="hero-heading mt-2 font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2rem, 6vw, 72px)' }}
        >
          Мои проекты
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        <Row items={row1} rowRef={row1Ref} />
        <Row items={row2} rowRef={row2Ref} />
      </div>
    </section>
  )
}
