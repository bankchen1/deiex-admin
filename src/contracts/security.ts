// Security Contracts

// Role
export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  status: 'active' | 'inactive' | 'archived'
  isSystemRole: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface PermissionNode {
  id: string
  name: string
  description: string
  children?: PermissionNode[]
}

export interface RoleQueryParams {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CreateRolePayload {
  name: string
  description?: string
  permissions: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permissions?: string[]
}

// Admin User
export interface AdminUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  status: 'active' | 'inactive' | 'locked' | 'pending'
  lastLoginAt?: string
  lastLoginIp?: string
  failedLoginAttempts: number
  lockedAt?: string
  lockedUntil?: string
  twoFactorEnabled: boolean
  twoFactorVerified: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface AdminUserQueryParams {
  search?: string
  status?: string
  role?: string
  page?: number
  pageSize?: number
}

export interface CreateAdminUserPayload {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  roles: string[]
  permissions?: string[]
  twoFactorEnabled?: boolean
}

export interface UpdateAdminUserPayload {
  firstName?: string
  lastName?: string
  email?: string
  roles?: string[]
  permissions?: string[]
  status?: 'active' | 'inactive' | 'locked'
}

export interface UpdateAdminPasswordPayload {
  oldPassword: string
  newPassword: string
}

// IP Whitelist
export interface IpWhitelistEntry {
  id: string
  ip: string
  description?: string
  userId?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

export interface IpWhitelistQueryParams {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CreateIpWhitelistPayload {
  ip: string
  description?: string
  userId?: string
}

// API Keys
export interface ApiKey {
  id: string
  name: string
  key: string
  secret: string
  status: 'active' | 'inactive' | 'revoked'
  permissions: string[]
  expiresAt?: string
  lastUsedAt?: string
  ipRestrictions?: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ApiKeyQueryParams {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CreateApiKeyPayload {
  name: string
  permissions: string[]
  expiresAt?: string
  ipRestrictions?: string[]
}

// Audit Logs
export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  ip: string
  userAgent?: string
  oldValue?: any
  newValue?: any
  metadata?: Record<string, any>
}

export interface AuditLogQueryParams {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface CreateAuditLogPayload {
  userId: string
  action: string
  resource: string
  resourceId?: string
  oldValue?: any
  newValue?: any
  metadata?: Record<string, any>
}

// Version
export interface Version {
  id: string
  version: string
  description: string
  createdAt: string
  publishedBy: string
  status: 'draft' | 'published' | 'archived'
}

export interface VersionQueryParams {
  status?: string
  page?: number
  pageSize?: number
}

// Assign Permissions
export interface AssignPermissionsPayload {
  userId: string
  permissions: string[]
}
