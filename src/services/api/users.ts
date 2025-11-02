import { apiClient } from './AdminApiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  User,
  LoginRecord,
  DeviceInfo,
  ChainAddress,
  UserOrder,
  UserPosition,
  AuditRecord,
} from '@/types/models'

// Query Parameters
export interface UserQueryParams {
  page?: number
  pageSize?: number
  status?: 'active' | 'disabled' | 'suspended' | 'all'
  vipLevel?: number
  kycStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  tags?: string[]
  search?: string
  startDate?: string
  endDate?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

// User Statistics
export interface UserStats {
  total: number
  active: number
  disabled: number
  suspended: number
  todayRegistrations: number
  kycPending: number
  kycApproved: number
}

// VIP Update Payload
export interface VipUpdatePayload {
  vipLevel: number
  reason: string
  notes?: string
}

// Tag Update Payload
export interface TagUpdatePayload {
  tags: string[]
  reason: string
}

// Reset 2FA Payload
export interface Reset2FAPayload {
  reason: string
  notes?: string
}

// User Detail Response
export interface UserDetailResponse {
  user: User
  loginRecords: LoginRecord[]
  devices: DeviceInfo[]
  chainAddresses: ChainAddress[]
  recentOrders: UserOrder[]
  recentPositions: UserPosition[]
  auditTrail: AuditRecord[]
}

export const usersApi = {
  // Get users list with pagination and filters
  getList(params: UserQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', {
      params,
    })
  },

  // Get user by ID with full details
  getById(id: string) {
    return apiClient.get<ApiResponse<UserDetailResponse>>(`/admin/users/${id}`)
  },

  // Get user statistics
  getStats(params?: { startDate?: string; endDate?: string }) {
    return apiClient.get<ApiResponse<UserStats>>('/admin/users/stats', { params })
  },

  // Update user VIP level (requires dual approval)
  updateVip(id: string, payload: VipUpdatePayload) {
    return apiClient.post<ApiResponse<User>>(`/admin/users/${id}/vip`, payload)
  },

  // Update user risk tags
  updateTags(id: string, payload: TagUpdatePayload) {
    return apiClient.post<ApiResponse<User>>(`/admin/users/${id}/tags`, payload)
  },

  // Reset user 2FA
  reset2FA(id: string, payload: Reset2FAPayload) {
    return apiClient.post<ApiResponse<User>>(`/admin/users/${id}/reset-2fa`, payload)
  },

  // Get user login records
  getLoginRecords(id: string, params?: { page?: number; pageSize?: number }) {
    return apiClient.get<ApiResponse<PaginatedResponse<LoginRecord>>>(`/admin/users/${id}/logins`, {
      params,
    })
  },

  // Get user devices
  getDevices(id: string) {
    return apiClient.get<ApiResponse<DeviceInfo[]>>(`/admin/users/${id}/devices`)
  },

  // Get user chain addresses
  getChainAddresses(id: string) {
    return apiClient.get<ApiResponse<ChainAddress[]>>(`/admin/users/${id}/addresses`)
  },

  // Get user recent orders
  getRecentOrders(
    id: string,
    params?: { page?: number; pageSize?: number; type?: 'spot' | 'futures' }
  ) {
    return apiClient.get<ApiResponse<PaginatedResponse<UserOrder>>>(`/admin/users/${id}/orders`, {
      params,
    })
  },

  // Get user recent positions
  getRecentPositions(id: string) {
    return apiClient.get<ApiResponse<UserPosition[]>>(`/admin/users/${id}/positions`)
  },

  // Get user audit trail
  getAuditTrail(id: string, params?: { page?: number; pageSize?: number }) {
    return apiClient.get<ApiResponse<PaginatedResponse<AuditRecord>>>(`/admin/users/${id}/audit`, {
      params,
    })
  },

  // Export users data
  export(params: UserQueryParams) {
    return apiClient.get<Blob>('/admin/users/export', {
      params,
      responseType: 'blob',
    })
  },

  // Disable user account
  disableUser(id: string, payload: { reason: string; notes?: string }) {
    return apiClient.post<ApiResponse<User>>(`/admin/users/${id}/disable`, payload)
  },

  // Enable user account
  enableUser(id: string, payload: { reason: string; notes?: string }) {
    return apiClient.post<ApiResponse<User>>(`/admin/users/${id}/enable`, payload)
  },
}
