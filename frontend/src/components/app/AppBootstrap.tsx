import { useEffect, useState } from 'react'

import { SplashScreen } from '@/components/app/SplashScreen'
import { useAuth } from '@/features/auth/context/useAuth'

type AppBootstrapProps = {
  children: React.ReactNode
}

const SPLASH_EXIT_MS = 300

export function AppBootstrap({ children }: AppBootstrapProps) {
  const { initializeSession } = useAuth()
  const [isBootstrapped, setIsBootstrapped] = useState(false)
  const [isSplashMounted, setIsSplashMounted] = useState(true)

  useEffect(() => {
    let isMounted = true
    let unmountSplashTimer: number | undefined

    async function bootstrap() {
      await initializeSession()

      if (!isMounted) return

      setIsBootstrapped(true)
      unmountSplashTimer = window.setTimeout(() => {
        if (isMounted) setIsSplashMounted(false)
      }, SPLASH_EXIT_MS)
    }

    bootstrap()

    return () => {
      isMounted = false
      if (unmountSplashTimer) window.clearTimeout(unmountSplashTimer)
    }
  }, [initializeSession])

  return (
    <>
      {isBootstrapped && children}
      {isSplashMounted && <SplashScreen isVisible={!isBootstrapped} />}
    </>
  )
}
