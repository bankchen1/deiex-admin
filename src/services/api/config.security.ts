import { apiClient } from './AdminApiClient'

// Types
export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  username: string
  email: string
  roles: string[]
  status: 'active' | 'disabled'
  lastLoginAt: string
  createdAt: string
  updatedAt: string
}

export interface IpWhitelistEntry {
  id: string
  ip: string
  description: string
  adminId: string
  adminName: string
  createdAt: string
  expiresAt?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  secret?: string
  permissions: string[]
  status: 'active' | 'disabled'
  lastUsedAt?: string
  createdAt: string
  expiresAt?: string
}

export interface AuditLog {
  id: string
  adminId: string
  adminName: string
  action: string
  objectType: string
  objectId: string
  before?: any
  after?: any
  ip: string
  userAgent: string
  timestamp: string
}

export interface PermissionNode {
  key: string
  title: string
  children?: PermissionNode[]
}

// Query params
export interface RoleQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface AdminUserQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'active' | 'disabled'
  role?: string
}

export interface IpWhitelistQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface ApiKeyQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'active' | 'disabled'
}

export interface AuditLogQueryParams {
  page?: number
  pageSize?: number
  objectType?: string
  objectId?: string
  adminId?: string
  action?: string
  startTime?: string
  endTime?: string
}

// Payloads
export interface CreateRolePayload {
  name: string
  description: string
  permissions: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permissions?: string[]
}

export interface CreateAdminUserPayload {
  username: string
  email: string
  password: string
  roles: string[]
}

export interface UpdateAdminUserPayload {
  email?: string
  roles?: string[]
  status?: 'active' | 'disabled'
}

export interface CreateIpWhitelistPayload {
  ip: string
  description: string
  expiresAt?: string
}

export interface CreateApiKeyPayload {
  name: string
  permissions: string[]
  expiresAt?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// API Service
export const securityApi = {
  // Roles
  getRoles(params: RoleQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<Role>>>('/admin/security/roles', { params })
  },

  getRoleById(id: string) {
    return apiClient.get<ApiResponse<Role>>(`/admin/security/roles/${id}`)
  },

  createRole(payload: CreateRolePayload) {
    return apiClient.post<ApiResponse<Role>>('/admin/security/roles', payload)
  },

  updateRole(id: string, payload: UpdateRolePayload) {
    return apiClient.put<ApiResponse<Role>>(`/admin/security/roles/${id}`, payload)
  },

  deleteRole(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/security/roles/${id}`)
  },

  // Permissions
  getPermissionTree() {
    return apiClient.get<ApiResponse<PermissionNode[]>>('/admin/security/permissions/tree')
  },

  getAllPermissions() {
    return apiClient.get<ApiResponse<string[]>>('/admin/security/permissions')
  },

  // Admin Users
  getAdminUsers(params: AdminUserQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>('/admin/security/admin-users', {
      params,
    })
  },

  getAdminUserById(id: string) {
    return apiClient.get<ApiResponse<AdminUser>>(`/admin/security/admin-users/${id}`)
  },

  createAdminUser(payload: CreateAdminUserPayload) {
    return apiClient.post<ApiResponse<AdminUser>>('/admin/security/admin-users', payload)
  },

  updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
    return apiClient.put<ApiResponse<AdminUser>>(`/admin/security/admin-users/${id}`, payload)
  },

  disableAdminUser(id: string, reason: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/security/admin-users/${id}/disable`, {
      reason,
    })
  },

  enableAdminUser(id: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/security/admin-users/${id}/enable`)
  },

  resetAdminPassword(id: string, newPassword: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/security/admin-users/${id}/reset-password`, {
      newPassword,
    })
  },

  // IP Whitelist
  getIpWhitelist(params: IpWhitelistQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<IpWhitelistEntry>>>(
      '/admin/security/ip-whitelist',
      { params }
    )
  },

  addIpWhitelist(payload: CreateIpWhitelistPayload) {
    return apiClient.post<ApiResponse<IpWhitelistEntry>>('/admin/security/ip-whitelist', payload)
  },

  removeIpWhitelist(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/security/ip-whitelist/${id}`)
  },

  // API Keys
  getApiKeys(params: ApiKeyQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<ApiKey>>>('/admin/security/api-keys', {
      params,
    })
  },

  createApiKey(payload: CreateApiKeyPayload) {
    return apiClient.post<ApiResponse<ApiKey>>('/admin/security/api-keys', payload)
  },

  revokeApiKey(id: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/security/api-keys/${id}/revoke`)
  },

  regenerateApiKey(id: string) {
    return apiClient.post<ApiResponse<ApiKey>>(`/admin/security/api-keys/${id}/regenerate`)
  },

  // Audit Logs
  getAuditLogs(params: AuditLogQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>('/admin/security/audit-logs', {
      params,
    })
  },

  getAuditLogById(id: string) {
    return apiClient.get<ApiResponse<AuditLog>>(`/admin/security/audit-logs/${id}`)
  },

  exportAuditLogs(params: AuditLogQueryParams) {
    return apiClient.get<Blob>('/admin/security/audit-logs/export', {
      params,
      responseType: 'blob',
    })
  },
}
