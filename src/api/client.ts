import type { ApiResponse } from './types'

const TOKEN_KEY = 'jalan_overseas_admin_token'
const ADMIN_KEY = 'jalan_overseas_admin_user'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

export function getStoredAdmin<T>() {
  const raw = localStorage.getItem(ADMIN_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(ADMIN_KEY)
    return null
  }
}

export function setStoredAdmin(admin: unknown) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('Missing VITE_API_BASE_URL environment variable', 0, null)
  }

  const headers = new Headers(options.headers)
  const token = getToken()

  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = readMessage(payload) || `Request failed with status ${response.status}`
    if (response.status === 401) clearSession()
    throw new ApiError(message, response.status, payload)
  }

  const wrapped = payload as ApiResponse<T>
  if (wrapped && typeof wrapped === 'object' && 'data' in wrapped) {
    if (wrapped.success === false) throw new ApiError(wrapped.message || 'Request failed', response.status, payload)
    return wrapped.data as T
  }

  return payload as T
}

function readMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') return ''
  const candidate = payload as { message?: unknown; error?: unknown }
  return typeof candidate.message === 'string'
    ? candidate.message
    : typeof candidate.error === 'string'
      ? candidate.error
      : ''
}
