import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { projects } from '../data/content'
import { LiveProjectButton } from './LiveProjectButton'
import { SiteScrollPreview } from './SiteScrollPreview'

function SlotFrame({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`min-h-0 min-w-0 overflow-hidden rounded-[28px] bg-[#161616] sm:rounded-[40px] md:rounded-[48px] ${className}`}
    >
      {children}
    </div>
  )
}

type Project = (typeof projects)[number]

function TopMedia({ project }: { project: Project }) {
  const fitContain = 'topFit' in project && project.topFit === 'contain'
  const mediaClass = fitContain
    ? 'h-full w-full object-contain object-center'
    : 'h-full w-full object-cover'
  const frameClass = 'h-[38%] w-full'

  return (
    <SlotFrame className={frameClass}>
      <img
        src={project.images.top}
        alt=""
        className={mediaClass}
        style={{ objectPosition: project.objectPositions.top }}
      />
    </SlotFrame>
  )
}

function TallMedia({ project }: { project: Project }) {
  return (
    <SlotFrame className="h-full w-full">
      <SiteScrollPreview src={project.images.tall} durationSec={16} />
    </SlotFrame>
  )
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project
  index: number
  total: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, index === total - 1 ? 0 : -8])

  return (
    <div ref={ref} className="relative h-[85vh] w-full max-w-none">
      <motion.article
        style={{
          y,
          top: `calc(6rem + ${index * 28}px)`,
        }}
        className="sticky top-24 box-border flex h-[min(78vh,820px)] w-full max-w-none flex-col overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] px-10 pb-8 pt-12 sm:rounded-[50px] sm:px-14 sm:pb-12 sm:pt-14 md:top-32 md:rounded-[60px] md:px-20 md:pb-16 md:pt-16"
      >
        <div className="relative z-20 mb-6 flex w-full min-w-0 items-center justify-between gap-4 sm:mb-8">
          <div className="flex min-w-0 flex-1 items-end gap-3 sm:gap-5">
            <span
              className="shrink-0 font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(2rem, 5.4vw, 80px)' }}
            >
              {project.n}
            </span>
            <div className="min-w-0 pb-1 sm:pb-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/70 sm:text-sm">
                {project.category}
              </p>
              <h3
                className="truncate font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2.2rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          {project.live ? (
            <LiveProjectButton href={project.href} className="relative z-20 shrink-0" />
          ) : null}
        </div>

        <div className="grid min-h-0 w-full max-w-none flex-1 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 sm:gap-4 md:gap-5">
          <div className="flex min-h-0 min-w-0 flex-col gap-3 sm:gap-4 md:gap-5">
            <TopMedia project={project} />
            <SlotFrame className="w-full flex-1">
              <img
                src={project.images.bottom}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: project.objectPositions.bottom }}
              />
            </SlotFrame>
          </div>
          <TallMedia project={project} />
        </div>
      </motion.article>
    </div>
  )
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 w-full max-w-none rounded-t-[40px] bg-[#0C0C0C] px-5 pb-28 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
    >
      <h2
        className="hero-heading mb-14 text-center font-black uppercase leading-none tracking-tight sm:mb-20"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Проекты
      </h2>

      <div className="flex w-full max-w-none flex-col gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.n}
            project={project}
            index={index}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  )
}
