type LiveProjectButtonProps = {
  href?: string
  className?: string
  label?: string
}

export function LiveProjectButton({
  href = '#',
  className = '',
  label = 'Смотреть',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className={`pill-btn pill-btn-ghost ${className}`.trim()}
    >
      <span>{label}</span>
    </a>
  )
}
