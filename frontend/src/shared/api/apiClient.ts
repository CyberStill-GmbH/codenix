const DEFAULT_API_BASE_URL = 'http://localhost:4000/api'
const TOKEN_STORAGE_KEY = 'codenix:access-token'

export type ApiErrorBody = {
  code?: string
  message?: string
  details?: {
    issues?: Array<{
      path?: Array<string | number>
      message?: string
    }>
    [key: string]: unknown
  }
}

export class ApiError extends Error {
  status: number
  code?: string
  details?: ApiErrorBody['details']

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || 'Something went wrong.')
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.details = body.details
  }
}

type ApiRequestBody = BodyInit | Record<string, unknown> | Array<unknown> | null

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: ApiRequestBody
  skipAuth?: boolean
}

type UnauthorizedListener = () => void

const unauthorizedListeners = new Set<UnauthorizedListener>()

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
}

export function getAccessToken() {
  return (
    window.localStorage.getItem(TOKEN_STORAGE_KEY) ??
    window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
  )
}

export function setAccessToken(token: string, storage: 'local' | 'session' = 'local') {
  clearAccessToken()
  const targetStorage = storage === 'local' ? window.localStorage : window.sessionStorage
  targetStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener)
  return () => {
    unauthorizedListeners.delete(listener)
  }
}

function emitUnauthorized() {
  unauthorizedListeners.forEach((listener) => listener())
}

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path

  return `${apiConfig.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) return undefined

  const text = await response.text()
  if (!text) return undefined

  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

export async function apiRequest<T>(
  path: string,
  { body, headers, skipAuth = false, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const token = getAccessToken()
  const requestHeaders = new Headers(headers)

  const isFormDataBody = typeof FormData !== 'undefined' && body instanceof FormData

  if (body !== undefined && !isFormDataBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  requestHeaders.set('Accept', 'application/json')

  if (!skipAuth && token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormDataBody || typeof body === 'string' || body instanceof Blob
          ? body
          : JSON.stringify(body),
  })

  const responseBody = await parseResponseBody(response)

  if (!response.ok) {
    const errorBody =
      responseBody && typeof responseBody === 'object'
        ? (responseBody as ApiErrorBody)
        : { message: 'Something went wrong.' }

    if (response.status === 401 && !skipAuth) {
      clearAccessToken()
      emitUnauthorized()
    }

    throw new ApiError(response.status, errorBody)
  }

  return responseBody as T
}
