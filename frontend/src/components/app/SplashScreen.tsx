
type SplashScreenProps = {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] grid place-items-center bg-[var(--color-bg)] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="sr-only">Cargando Codenix...</span>
      <img
        src="/favicon.svg"
        className="h-16 w-16 bg-[var(--color-logo-mark)] [animation:codenix-splash-pulse_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}
