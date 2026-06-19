import '@/styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from '@/app/router/AppRouter'
import { AppBootstrap } from '@/components/app/AppBootstrap'
import { AuthProvider } from '@/features/auth/context/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppBootstrap>
          <AppRouter />
        </AppBootstrap>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
