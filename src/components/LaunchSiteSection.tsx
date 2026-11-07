import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import {
  ArrowRightCircle,
  Fingerprint,
  LockKeyhole,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import {
  useEffect,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const NAV_LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#projects', label: 'Проекты' },
  { href: '#contact', label: 'Контакт' },
] as const

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/launch-hero.mp4`

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: EASE },
  }),
}

const inlineIconStyle: CSSProperties = {
  display: 'inline',
  verticalAlign: 'middle',
  position: 'relative',
  top: -2,
}

function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      overflow="visible"
      viewBox="0 0 256 256"
      aria-hidden
    >
      <path
        d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z"
        fill="#192837"
      />
    </svg>
  )
}

function scrollToContact(event?: MouseEvent) {
  event?.preventDefault()
  const target = document.getElementById('contact')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    window.location.hash = 'contact'
  }
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40"
            style={{
              background: 'rgba(25,40,55,0.35)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex flex-col"
            style={{
              width: 'min(88vw, 360px)',
              height: '100dvh',
              background: '#CFC8C5',
              boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
            }}
            initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: EASE }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <button
                type="button"
                aria-label="Закрыть"
                className="rounded-full p-2 transition-opacity hover:opacity-70"
                onClick={onClose}
              >
                <X color="#192837" size={22} />
              </button>
            </div>
            <div
              style={{ height: 1, background: 'rgba(25,40,55,0.15)' }}
            />
            <nav className="flex flex-1 flex-col px-6 pt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="py-3 text-2xl font-medium transition-opacity hover:opacity-70"
                  style={{ color: '#192837' }}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.18 + i * 0.07,
                    duration: 0.45,
                    ease: EASE,
                  }}
                  onClick={onClose}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="flex flex-col gap-3 px-6 pb-8"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.18 + NAV_LINKS.length * 0.07,
                duration: 0.45,
                ease: EASE,
              }}
            >
              <a
                href="#contact"
                className="rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-accent)' }}
                onClick={(event) => {
                  onClose()
                  scrollToContact(event)
                }}
              >
                Начать
              </a>
              <a
                href="#contact"
                className="rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--color-login-bg)',
                  color: 'var(--color-text)',
                }}
                onClick={(event) => {
                  onClose()
                  scrollToContact(event)
                }}
              >
                Написать
              </a>
            </motion.div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export function LaunchSiteSection() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="launch"
      className="launch-site-section relative w-full min-h-screen overflow-hidden"
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
      }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(242,242,238,0.72) 0%, rgba(242,242,238,0.35) 42%, rgba(242,242,238,0.08) 70%, transparent 100%)',
        }}
        aria-hidden
      />

      <header className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center justify-between">
          <a href="#launch" aria-label="AmilKa">
            <Logo />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: '#192837' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#contact"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-accent)' }}
              onClick={scrollToContact}
            >
              Начать
            </a>
            <a
              href="#contact"
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                background: 'var(--color-login-bg)',
                color: 'var(--color-text)',
              }}
              onClick={scrollToContact}
            >
              Написать
            </a>
          </div>

          <button
            type="button"
            className="rounded-full p-2 transition-opacity hover:opacity-70 md:hidden"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu color="#192837" size={22} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div
          style={{
            paddingTop: 'clamp(40px, 8vw, 72px)',
            paddingBottom: 'clamp(48px, 10vw, 96px)',
            maxWidth: 560,
          }}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.65rem, 5vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: '#192837',
              marginBottom: 24,
            }}
          >
            <Zap size={24} color="#192837" style={inlineIconStyle} /> Запусти
            сильный сайт{' '}
            <LockKeyhole size={24} color="#192837" style={inlineIconStyle} />{' '}
            для роста бизнеса{' '}
            <Fingerprint size={24} color="#192837" style={inlineIconStyle} />
          </motion.h2>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
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
            animate="visible"
            className="mt-8 inline-flex items-center justify-between font-semibold"
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
            whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
            whileTap={{ scale: 0.96 }}
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
