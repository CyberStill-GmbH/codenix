import { useState } from 'react'

type UserAvatarProps = {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClassNames: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
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
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-full)] font-display font-semibold ${sizeClassNames[size]}`}
      style={{
        background: 'rgba(56,189,248,0.12)',
        color: 'var(--color-difficulty-easy)',
        border: '1px solid rgba(56,189,248,0.18)',
      }}
      aria-label={name}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  )
}
