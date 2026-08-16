import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { SplashScreen } from '@/components/app/SplashScreen'
import { useAuth } from '@/features/auth/context/useAuth'
import { useTheme } from '@/shared/providers/ThemeProvider'

type AppBootstrapProps = {
  children: React.ReactNode
}

const SPLASH_EXIT_MS = 300

export function AppBootstrap({ children }: AppBootstrapProps) {
  const { initializeSession, status } = useAuth()
  const { resolvedTheme } = useTheme()
  const location = useLocation()
  const [isBootstrapped, setIsBootstrapped] = useState(false)
  const [isSplashMounted, setIsSplashMounted] = useState(true)
  const [isTransitionSplashMounted, setIsTransitionSplashMounted] = useState(false)

  const isDarkPublicRoute = ['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(
    location.pathname,
  )
  const splashTheme = isDarkPublicRoute ? 'dark' : resolvedTheme

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

  useEffect(() => {
    if (!isBootstrapped) return

    if (status === 'loading') {
      setIsTransitionSplashMounted(true)
      return
    }

    if (!isTransitionSplashMounted) return

    const timer = window.setTimeout(() => setIsTransitionSplashMounted(false), SPLASH_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [isBootstrapped, isTransitionSplashMounted, status])

  return (
    <>
      {isBootstrapped && children}
      {(isSplashMounted || isTransitionSplashMounted) && (
        <SplashScreen
          isVisible={!isBootstrapped || status === 'loading'}
          theme={splashTheme}
        />
      )}
    </>
  )
}
