import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type LandingButtonVariant = 'primary' | 'ghost' | 'soft'

type LandingButtonBaseProps = {
  children: ReactNode
  variant?: LandingButtonVariant
  icon?: ReactNode
  className?: string
  fullWidth?: boolean
  ariaLabel?: string
}

type LandingButtonProps =
  | (LandingButtonBaseProps & {
    to: string
    href?: never
    target?: never
    rel?: never
    disabled?: never
    type?: never
    onClick?: never
  })
  | (LandingButtonBaseProps & {
    href: string
    to?: never
    target?: '_blank' | '_self' | '_parent' | '_top'
    rel?: string
    disabled?: never
    type?: never
    onClick?: never
  })
  | (LandingButtonBaseProps & {
    to?: never
    href?: never
    target?: never
    rel?: never
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
  })

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]'

const VARIANTS: Record<LandingButtonVariant, string> = {
  primary:
    'border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-glow)] hover:border-[var(--color-primary-hover)] hover:bg-[var(--color-primary-hover)]',

  ghost:
    'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',

  soft:
    'border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[rgba(56,189,248,0.2)]',
}


export function LandingButton(props: LandingButtonProps) {
  const {
    children,
    variant = 'primary',
    icon,
    className = '',
    fullWidth = false,
    ariaLabel,
  } = props

  const composedClassName = [
    BASE,
    VARIANTS[variant],
    fullWidth ? 'w-full' : '',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
    'aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
    'sm:w-auto',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span>{children}</span>

      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  )

  if ('to' in props && props.to) {
    return (
      <Link
        to={props.to}
        className={composedClassName}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const rel =
      props.target === '_blank'
        ? props.rel ?? 'noreferrer noopener'
        : props.rel

    return (
      <a
        href={props.href}
        target={props.target}
        rel={rel}
        className={composedClassName}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={composedClassName}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}