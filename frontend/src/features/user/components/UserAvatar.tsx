import { useState } from 'react'

type UserAvatarSize = 'sm' | 'md' | 'menu' | 'lg'

type UserAvatarProps = {
  src?: string
  name: string
  size?: UserAvatarSize
}

const sizeClassNames: Record<UserAvatarSize, string> = {
  sm: 'h-9 w-9 text-xs',       // 36px — navbar mobile
  md: 'h-10 w-10 text-sm',     // 40px — navbar desktop/tablet
  menu: 'h-14 w-14 text-xl',   // 56px — dropdown header
  lg: 'h-16 w-16 text-2xl md:h-20 md:w-20 md:text-3xl',
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserAvatar({ src, name, size = 'md' }: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = Boolean(src) && !hasImageError

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-full)] font-display font-bold shadow-[0_14px_36px_rgba(14,165,233,0.18)] ${sizeClassNames[size]}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(11,127,195,0.92), rgba(56,189,248,0.78))',
        color: 'white',
        border: '1px solid rgba(125,211,252,0.34)',
      }}
      aria-label={name}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  )
}
