import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  x?: number
  y?: number
  as?: ElementType
} & Omit<HTMLMotionProps<'div'>, 'children'>

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  ...rest
}: FadeInProps) {
  const Component = motion.create(as as 'div')

  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Component>
  )
}
