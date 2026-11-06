type ContactButtonProps = {
  href?: string
  className?: string
  label?: string
}

export function ContactButton({
  href = '#contact',
  className = '',
  label = 'Написать',
}: ContactButtonProps) {
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`pill-btn pill-btn-gradient contact-btn-fixed ${className}`.trim()}
    >
      <span>{label}</span>
    </a>
  )
}
