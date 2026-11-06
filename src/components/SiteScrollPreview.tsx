import { useState } from 'react'

type SiteScrollPreviewProps = {
  src: string
  className?: string
  durationSec?: number
}

/**
 * Smooth CSS pan through a tall screenshot. Ping-pong loop, no hard jump.
 */
export function SiteScrollPreview({
  src,
  className = '',
  durationSec = 14,
}: SiteScrollPreviewProps) {
  const [ready, setReady] = useState(false)

  return (
    <div className={`site-scroll-frame ${className}`.trim()}>
      <img
        src={src}
        alt=""
        className={`site-scroll-strip${ready ? ' is-ready' : ''}`}
        style={{ animationDuration: `${durationSec}s` }}
        draggable={false}
        decoding="async"
        onLoad={() => setReady(true)}
      />
    </div>
  )
}
