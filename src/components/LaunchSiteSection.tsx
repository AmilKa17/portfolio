import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { ArrowRightCircle } from 'lucide-react'
import { type MouseEvent, useRef } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/launch-hero.mp4`

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.14, duration: 0.72, ease: EASE },
  }),
}

const viewportIn = { once: true, amount: 0.28, margin: '0px 0px -8% 0px' } as const

function scrollToContact(event?: MouseEvent) {
  event?.preventDefault()
  const target = document.getElementById('contact')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    window.location.hash = 'contact'
  }
}

export function LaunchSiteSection() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const videoY = useTransform(scrollYProgress, [0, 1], [56, -56])
  const videoScale = useTransform(scrollYProgress, [0, 0.35, 1], [1.06, 1, 1.02])
  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42],
    [0.42, 0.92, 1],
  )
  const washOpacity = useTransform(scrollYProgress, [0, 0.28], [0.55, 1])
  const topBlendOpacity = useTransform(scrollYProgress, [0, 0.22, 0.48], [1, 0.85, 0.55])

  return (
    <section
      ref={sectionRef}
      id="launch"
      className="launch-site-section relative w-full min-h-screen overflow-hidden"
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
        marginTop: -56,
      }}
    >
      <motion.video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        aria-hidden
        style={
          reduceMotion
            ? undefined
            : { y: videoY, scale: videoScale, opacity: videoOpacity }
        }
      />

      {/* Soft left wash for readable copy */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(242,242,238,0.62) 0%, rgba(242,242,238,0.28) 40%, rgba(12,12,12,0.08) 72%, transparent 100%)',
          opacity: reduceMotion ? 1 : washOpacity,
        }}
        aria-hidden
      />

      {/* Incoming handoff from dark #projects */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
        style={{
          height: 'clamp(96px, 18vh, 180px)',
          background:
            'linear-gradient(180deg, #0C0C0C 0%, rgba(12,12,12,0.72) 38%, rgba(12,12,12,0.22) 72%, transparent 100%)',
          opacity: reduceMotion ? 1 : topBlendOpacity,
        }}
        aria-hidden
      />

      {/* Soft vignette so light UI does not slam into black */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 42%, rgba(12,12,12,0.28) 100%)',
        }}
        aria-hidden
      />

      {/* Exit handoff into dark page / next surface */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
        style={{
          height: 'clamp(140px, 28vh, 280px)',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.35) 42%, rgba(12,12,12,0.82) 78%, #0C0C0C 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div
          style={{
            paddingTop: 'clamp(72px, 12vw, 120px)',
            paddingBottom: 'clamp(96px, 16vw, 160px)',
            maxWidth: 560,
          }}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={viewportIn}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.65rem, 5vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: '#192837',
              marginBottom: 24,
            }}
          >
            Запусти сильный сайт для роста бизнеса
          </motion.h2>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={viewportIn}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: 1.65,
                opacity: 0.8,
                maxWidth: 560,
                color: '#192837',
              }}
            >
              Структура, дизайн и запуск под ключ. Соберу сайт, который выглядит
              уверенно, быстро открывается и приводит заявки, а не просто
              занимает место в сети.
            </p>
          </motion.div>

          <motion.a
            href="#contact"
            custom={2}
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={viewportIn}
            className="mt-14 inline-flex items-center justify-between font-semibold sm:mt-16"
            style={{
              background: '#7342E2',
              color: '#ffffff',
              borderRadius: 50,
              padding: '17px 24px',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
              minWidth: 210,
              gap: 32,
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            onClick={scrollToContact}
          >
            <span>Запустить сайт</span>
            <ArrowRightCircle size={20} />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
