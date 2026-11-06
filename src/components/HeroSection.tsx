import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ContactButton } from './ContactButton'
import { FadeIn } from './FadeIn'
import { FollowAvatar } from './FollowAvatar'

const nav = [
  { href: '#about', label: 'Обо мне' },
  { href: '#services', label: 'Услуги' },
  { href: '#projects', label: 'Проекты' },
  { href: '#contact', label: 'Контакт' },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-x-clip overflow-y-visible bg-[#0C0C0C]"
    >
      <FadeIn delay={0} y={-16} className="relative z-40">
        <nav className="flex justify-center px-6 pt-6 pb-2 md:pt-8">
          <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-[0.18em] text-[#D7E2EA] sm:gap-12 md:gap-16 md:text-base lg:gap-20 lg:text-lg">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-opacity duration-200 hover:opacity-70"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      <motion.div
        style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[5.5rem] z-0 sm:top-[6.25rem] md:top-[6.75rem]"
      >
        <FadeIn delay={0.12} y={24}>
          <h1 className="hero-heading hero-bleed-line select-none text-center font-black uppercase leading-none tracking-tight">
            Привет, я Амиль
          </h1>
        </FadeIn>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 top-[22%] z-10 sm:top-[18%] md:top-[16%]">
        <FadeIn delay={0.28} y={36} className="h-full">
          <FollowAvatar />
        </FadeIn>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-6 px-6 pb-8 sm:px-8 sm:pb-10 md:px-12 md:pb-12">
        <FadeIn delay={0.4} y={18} className="pointer-events-auto min-w-0">
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[240px] md:max-w-[300px]"
            style={{ fontSize: 'clamp(0.72rem, 1.35vw, 1.35rem)' }}
          >
            веб-креатор, который делает яркие и запоминающиеся проекты
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={18} className="pointer-events-auto shrink-0">
          <ContactButton href="#contact" label="Написать" />
        </FadeIn>
      </div>
    </section>
  )
}
