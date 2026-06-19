import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/app/layouts/AuthLayout'
import { AppSuspenseBoundary } from '@/components/feedback/AppSuspenseBoundary'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import {
  LazyAdminProblemFormPage,
  LazyAdminProblemTestcasesPage,
  LazyAdminProblemsPage,
  LazyProblemDetailPage,
  LazyProblemsPage,
  LazyProfilePage,
  LazySubmissionsPage,
} from '@/routes/lazyRoutes'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/problems"
        element={
          <RequireAuth fallback="problems">
            <AppSuspenseBoundary fallback="problems">
              <LazyProblemsPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/problems/:problemSlug"
        element={
          <RequireAuth fallback="editor">
            <AppSuspenseBoundary fallback="editor">
              <LazyProblemDetailPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/problems" replace />} />
      <Route
        path="/admin/problems"
        element={
          <RequireAuth role="admin" fallback="admin-list">
            <AppSuspenseBoundary fallback="admin-list">
              <LazyAdminProblemsPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/problems/new"
        element={
          <RequireAuth role="admin" fallback="admin-form">
            <AppSuspenseBoundary fallback="admin-form">
              <LazyAdminProblemFormPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/problems/:problemId/edit"
        element={
          <RequireAuth role="admin" fallback="admin-form">
            <AppSuspenseBoundary fallback="admin-form">
              <LazyAdminProblemFormPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/problems/:problemId/testcases"
        element={
          <RequireAuth role="admin" fallback="admin-testcases">
            <AppSuspenseBoundary fallback="admin-testcases">
              <LazyAdminProblemTestcasesPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/submissions"
        element={
          <RequireAuth fallback="submissions">
            <AppSuspenseBoundary fallback="submissions">
              <LazySubmissionsPage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth fallback="profile">
            <AppSuspenseBoundary fallback="profile">
              <LazyProfilePage />
            </AppSuspenseBoundary>
          </RequireAuth>
        }
      />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  )
}
