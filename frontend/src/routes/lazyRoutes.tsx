import { lazy } from 'react'

import { pageImports } from '@/routes/routePreload'

export const LazyProblemsPage = lazy(() =>
  pageImports.problems().then((module) => ({ default: module.ProblemsPage })),
)

export const LazyProblemDetailPage = lazy(() =>
  pageImports
    .problemDetail()
    .then((module) => ({ default: module.ProblemDetailPage })),
)

export const LazySubmissionsPage = lazy(() =>
  pageImports.submissions().then((module) => ({ default: module.SubmissionsPage })),
)

export const LazyProfilePage = lazy(() =>
  pageImports.profile().then((module) => ({ default: module.ProfilePage })),
)

export const LazyAdminProblemsPage = lazy(() =>
  pageImports.adminProblems().then((module) => ({ default: module.AdminProblemsPage })),
)

export const LazyAdminProblemFormPage = lazy(() =>
  pageImports
    .adminProblemForm()
    .then((module) => ({ default: module.AdminProblemFormPage })),
)

export const LazyAdminProblemTestcasesPage = lazy(() =>
  pageImports
    .adminProblemTestcases()
    .then((module) => ({ default: module.AdminProblemTestcasesPage })),
)

export const LazySettingsPage = lazy(() =>
  pageImports.settings().then((module) => ({ default: module.SettingsPage })),
)

