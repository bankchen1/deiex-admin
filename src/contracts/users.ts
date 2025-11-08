/**
 * Users Module Contracts
 * 
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// User Entity Contracts
export interface User {
  id: string
  nickname: string
  email: string
  phone: string
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected'
  vipLevel: number
  riskTags: string[]
  assetSnapshot: AssetSnapshot
  createdAt: string
  lastLoginAt: string
  status: 'active' | 'disabled' | 'suspended'
  country?: string
  registrationIp?: string
  twoFactorEnabled?: boolean
}

export interface AssetSnapshot {
  totalUsd: number
  availableUsd: number
  frozenUsd: number
  currencies: Record<string, CurrencyBalance>
}

export interface CurrencyBalance {
  currency: string
  available: string
  frozen: string
  usdValue: number
}

export interface LoginRecord {
  id: string
  userId: string
  ip: string
  location: string
  device: string
  userAgent: string
  timestamp: string
  success: boolean
}

export interface DeviceInfo {
  id: string
  userId: string
  deviceId: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  deviceName: string
  os: string
  browser: string
  firstSeen: string
  lastSeen: string
  trusted: boolean
}

// List Response Contract
export interface UserListResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contract
export interface UserDetailResponse {
  user: User
  loginRecords?: LoginRecord[]
  devices?: DeviceInfo[]
  chainAddresses?: any[]
  recentOrders?: any[]
  recentPositions?: any[]
  auditTrail?: any[]
}

// Statistics Contract
export interface UserStats {
  total: number
  active: number
  disabled: number
  suspended: number
  todayRegistrations: number
  kycPending: number
  kycApproved: number
}

// Query Contracts
export interface UserQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'disabled' | 'suspended' | 'all'
  vipLevel?: number
  kycStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  tags?: string[]
  search?: string
  startDate?: string
  endDate?: string
}

// Update Payloads Contracts
export interface UserVipUpdatePayload {
  vipLevel: number
  reason: string
  notes?: string
}

export interface UserTagUpdatePayload {
  tags: string[]
  reason: string
}

export interface User2FAResetPayload {
  reason: string
  notes?: string
}

export interface UserDisablePayload {
  reason: string
  notes?: string
}

export interface UserEnablePayload {
  reason: string
  notes?: string
}

// Response Wrapper Contract
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      total: number
    }
  }
}

// Export Response Contract
export type UserExportResponse = Blob

// Constants for field validation
export const USER_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Suspended', value: 'suspended' },
] as const

export const KYC_STATUS_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const VIP_LEVEL_OPTIONS = [
  { label: 'VIP 0', value: 0 },
  { label: 'VIP 1', value: 1 },
  { label: 'VIP 2', value: 2 },
  { label: 'VIP 3', value: 3 },
  { label: 'VIP 4', value: 4 },
  { label: 'VIP 5', value: 5 },
] as const

export const DEVICE_TYPES = ['mobile', 'desktop', 'tablet'] as const
export type DeviceType = typeof DEVICE_TYPES[number]