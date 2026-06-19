import { Outlet, useLocation } from 'react-router-dom'
import { AuthBrandPanel } from '@/features/auth/components/AuthBrandPanel'
import { AuthMobileBrand } from '@/features/auth/components/AuthMobileBrand'
import { landingTokens } from '@/features/landing/theme/tokens'

export function AuthLayout() {
  const location = useLocation()

  return (
    <div className={landingTokens.auth.page}>
      <AuthBrandPanel />

      <main className={landingTokens.auth.main}>
        <div
          className={landingTokens.auth.mainGlow}
          aria-hidden="true"
        />

        <div className={landingTokens.auth.formWrap}>
          <AuthMobileBrand />

          <div key={location.pathname} className="codenix-auth-route-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
