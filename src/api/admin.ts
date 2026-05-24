import { apiRequest, clearSession, setStoredAdmin, setToken } from './client'
import type {
  AdminUser,
  CreateStaffRequest,
  CreateTourRequest,
  LoginRequest,
  LoginResponse,
  PackageRequest,
  Tour,
  UpdateStaffRequest,
  UpdateTourRequest,
} from './types'

const ADMIN_API = '/admin/api/v1'

export async function loginAdmin(payload: LoginRequest) {
  const session = await apiRequest<LoginResponse>(`${ADMIN_API}/auth/login`, {
    method: 'POST',
    body: payload,
  })

  setToken(session.accessToken)
  setStoredAdmin(session.admin)
  return session
}

export async function getCurrentAdmin() {
  const admin = await apiRequest<AdminUser>(`${ADMIN_API}/auth/me`)
  setStoredAdmin(admin)
  return admin
}

export function logoutAdmin() {
  clearSession()
}

export function listStaff() {
  return apiRequest<AdminUser[]>(`${ADMIN_API}/staff`)
}

export function createStaff(payload: CreateStaffRequest) {
  return apiRequest<AdminUser>(`${ADMIN_API}/staff`, {
    method: 'POST',
    body: payload,
  })
}

export function updateStaff(staffId: string, payload: UpdateStaffRequest) {
  return apiRequest<AdminUser>(`${ADMIN_API}/staff/${staffId}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function listTours() {
  return apiRequest<Tour[]>(`${ADMIN_API}/tours`)
}

export function createTour(payload: CreateTourRequest) {
  return apiRequest<Tour>(`${ADMIN_API}/tours`, {
    method: 'POST',
    body: payload,
  })
}

export function getTour(tourId: string) {
  return apiRequest<Tour>(`${ADMIN_API}/tours/${tourId}`)
}

export function updateTour(tourId: string, payload: UpdateTourRequest) {
  return apiRequest<Tour>(`${ADMIN_API}/tours/${tourId}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function publishTour(tourId: string) {
  return apiRequest<Tour>(`${ADMIN_API}/tours/${tourId}/publish`, {
    method: 'POST',
  })
}

export function replaceTourPackages(tourId: string, packages: PackageRequest[]) {
  return apiRequest<Tour>(`${ADMIN_API}/tours/${tourId}/packages`, {
    method: 'PUT',
    body: { packages },
  })
}
