import { Outlet, useLocation } from 'react-router-dom'
import { AuthBrandPanel } from '@/features/auth/components/AuthBrandPanel'
import { AuthMobileBrand } from '@/features/auth/components/AuthMobileBrand'

export function AuthLayout() {
  const location = useLocation()

  return (
    <div className="grid min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] lg:grid-cols-[60%_40%]">
      <AuthBrandPanel />

      <main className="relative flex min-h-screen items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:px-8 xl:px-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_38%_at_50%_0%,rgba(56,189,248,0.055),transparent_62%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-[400px]">
          <AuthMobileBrand />

          <div key={location.pathname} className="codenix-auth-route-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
