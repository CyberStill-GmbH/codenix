import { Suspense, type ReactNode } from 'react'

import { PageLoader, type PageLoaderVariant } from '@/components/feedback/PageLoader'

type AppSuspenseBoundaryProps = {
  children: ReactNode
  fallback?: PageLoaderVariant
}

export function AppSuspenseBoundary({
  children,
  fallback = 'problems',
}: AppSuspenseBoundaryProps) {
  return <Suspense fallback={<PageLoader variant={fallback} />}>{children}</Suspense>
}
