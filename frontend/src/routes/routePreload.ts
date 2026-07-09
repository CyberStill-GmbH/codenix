export const pageImports = {
  problems: () => import('@/pages/ProblemsPage'),
  problemDetail: () => import('@/pages/ProblemDetailPage'),
  submissions: () => import('@/pages/SubmissionsPage'),
  profile: () => import('@/pages/ProfilePage'),
  settings: () => import('@/pages/SettingsPage'),
  adminProblems: () => import('@/features/admin/problems/pages/AdminProblemsPage'),
  adminProblemForm: () => import('@/features/admin/problems/pages/AdminProblemFormPage'),
  adminProblemTestcases: () =>
    import('@/features/admin/problems/pages/AdminProblemTestcasesPage'),
}

export type PreloadRouteKey = keyof typeof pageImports

export function preloadRoute(route: PreloadRouteKey) {
  pageImports[route]()
}
