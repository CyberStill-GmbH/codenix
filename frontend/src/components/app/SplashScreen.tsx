import logo from '@/assets/icons/logo.png'

type SplashScreenProps = {
  isVisible: boolean
  theme?: 'light' | 'dark'
}

export function SplashScreen({ isVisible, theme = 'dark' }: SplashScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-theme={theme}
      className={`codenix-splash-screen fixed inset-0 z-[100] grid place-items-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="sr-only">Cargando Codenix...</span>
      <span
        className="h-16 w-16 bg-[var(--color-logo-mark)] [animation:codenix-splash-pulse_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
        style={{ mask: `url(${logo}) center / contain no-repeat`, WebkitMask: `url(${logo}) center / contain no-repeat` }}
        aria-hidden="true"
      />
    </div>
  )
}
