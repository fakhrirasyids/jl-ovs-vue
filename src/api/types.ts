export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER'
export type AdminStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type TourStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type ApiResponse<T> = {
  success?: boolean
  message?: string
  data?: T
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
  lastLoginAt?: string | null
}

export type LoginResponse = {
  accessToken: string
  expiresIn: number
  admin: AdminUser
}

export type LoginRequest = {
  email: string
  password: string
}

export type CreateStaffRequest = {
  name: string
  email: string
  password: string
  role: AdminRole
}

export type UpdateStaffRequest = {
  name?: string
  role?: AdminRole
  status?: AdminStatus
}

export type PackageRequest = {
  name: string
  startDate?: string | null
  endDate?: string | null
  inventory?: number | null
  adultPrice: number
  childPrice?: number | null
  currency: string
  active?: boolean
}

export type PackageResponse = PackageRequest & {
  id: string
}

export type Tour = {
  id: string
  slug: string
  title: string
  description?: string | null
  destinationName?: string | null
  partnerName?: string | null
  heroImageUrl?: string | null
  durationDays?: number | null
  durationNights?: number | null
  minPax?: number | null
  maxPax?: number | null
  status: TourStatus
  packages?: PackageResponse[]
}

export type CreateTourRequest = {
  slug: string
  title: string
  description?: string
  destinationName?: string
  partnerName?: string
  heroImageUrl?: string
  durationDays?: number
  durationNights?: number
  minPax?: number
  maxPax?: number
}

export type UpdateTourRequest = Omit<Partial<CreateTourRequest>, 'slug'>
