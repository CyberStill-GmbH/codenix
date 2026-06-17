import { Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/app/layouts/AuthLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { ProblemsPage } from '@/pages/ProblemsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SubmissionsPage } from '@/pages/SubmissionsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problems" element={<ProblemsPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}
