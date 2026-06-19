const ADMIN_LAST_PATH_KEY = 'codenix:last-admin-path'
const ADMIN_FALLBACK_PATH = '/admin/problems'

export function rememberAdminPath(pathname: string) {
  if (!pathname.startsWith('/admin')) return

  window.sessionStorage.setItem(ADMIN_LAST_PATH_KEY, pathname)
}

export function getLastAdminPath() {
  return window.sessionStorage.getItem(ADMIN_LAST_PATH_KEY) ?? ADMIN_FALLBACK_PATH
}
