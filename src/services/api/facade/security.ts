/**
 * Security Facade - 安全管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut, safePatch, safeDelete } from '../_client'
import type {
  Role,
  AdminUser,
  IpWhitelistEntry,
  ApiKey,
  AuditLog,
  PermissionNode,
  Version,
  RoleQueryParams,
  AdminUserQueryParams,
  IpWhitelistQueryParams,
  ApiKeyQueryParams,
  AuditLogQueryParams,
  VersionQueryParams,
  CreateRolePayload,
  UpdateRolePayload,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
  CreateIpWhitelistPayload,
  CreateApiKeyPayload,
  AssignPermissionsPayload,
  UpdateAdminPasswordPayload,
  CreateAuditLogPayload,
} from '@/contracts/security'

/**
 * 获取角色列表
 */
export const listRoles = async (
  params: RoleQueryParams = {}
): Promise<FacadeResponse<{ data: Role[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Role[]
        total: number
        page: number
        pageSize: number
      }>('/admin/security/roles', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 根据ID获取角色
 */
export const getRoleById = async (id: string): Promise<FacadeResponse<Role>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Role>(`/admin/security/roles/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建角色
 */
export const createRole = async (payload: CreateRolePayload): Promise<FacadeResponse<Role>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Role>('/admin/security/roles', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新角色
 */
export const updateRole = async (
  id: string,
  payload: UpdateRolePayload
): Promise<FacadeResponse<Role>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Role>(`/admin/security/roles/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 删除角色
 */
export const deleteRole = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/security/roles/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取权限树
 */
export const getPermissionTree = async (): Promise<FacadeResponse<PermissionNode[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<PermissionNode[]>('/admin/security/permissions/tree')
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取所有权限
 */
export const getAllPermissions = async (): Promise<FacadeResponse<string[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<string[]>('/admin/security/permissions/all')
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取管理员用户列表
 */
export const listAdminUsers = async (
  params: AdminUserQueryParams = {}
): Promise<
  FacadeResponse<{ data: AdminUser[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: AdminUser[]
        total: number
        page: number
        pageSize: number
      }>('/admin/security/admin-users', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 根据ID获取管理员用户
 */
export const getAdminUserById = async (id: string): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<AdminUser>(`/admin/security/admin-users/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建管理员用户
 */
export const createAdminUser = async (
  payload: CreateAdminUserPayload
): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<AdminUser>('/admin/security/admin-users', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新管理员用户
 */
export const updateAdminUser = async (
  id: string,
  payload: UpdateAdminUserPayload
): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<AdminUser>(`/admin/security/admin-users/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 禁用管理员用户
 */
export const disableAdminUser = async (
  id: string,
  reason: string
): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<AdminUser>(`/admin/security/admin-users/${id}/disable`, {
        reason,
      })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 启用管理员用户
 */
export const enableAdminUser = async (id: string): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<AdminUser>(`/admin/security/admin-users/${id}/enable`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 重置管理员密码
 */
export const resetAdminPassword = async (
  id: string,
  newPassword: string
): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<AdminUser>(
        `/admin/security/admin-users/${id}/reset-password`,
        { newPassword }
      )
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取IP白名单列表
 */
export const listIpWhitelist = async (
  params: IpWhitelistQueryParams = {}
): Promise<
  FacadeResponse<{ data: IpWhitelistEntry[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: IpWhitelistEntry[]
        total: number
        page: number
        pageSize: number
      }>('/admin/security/ip-whitelist', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 添加IP到白名单
 */
export const addIpWhitelistEntry = async (
  payload: CreateIpWhitelistPayload
): Promise<FacadeResponse<IpWhitelistEntry>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<IpWhitelistEntry>('/admin/security/ip-whitelist', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 从白名单移除IP
 */
export const removeIpWhitelistEntry = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/security/ip-whitelist/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取API密钥列表
 */
export const getApiKeys = async (
  params: ApiKeyQueryParams = {}
): Promise<FacadeResponse<{ data: { items: ApiKey[]; total: number } }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{ items: ApiKey[]; total: number }>(
        '/admin/security/api-keys',
        { params }
      )
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建API密钥
 */
export const createApiKey = async (
  payload: CreateApiKeyPayload
): Promise<FacadeResponse<ApiKey>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<ApiKey>('/admin/security/api-keys', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 撤销API密钥
 */
export const revokeApiKey = async (id: string): Promise<FacadeResponse<ApiKey>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<ApiKey>(`/admin/security/api-keys/${id}/revoke`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 重新生成API密钥
 */
export const regenerateApiKey = async (id: string): Promise<FacadeResponse<ApiKey>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<ApiKey>(`/admin/security/api-keys/${id}/regenerate`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取审计日志列表
 */
export const getAuditLogs = async (
  params: AuditLogQueryParams = {}
): Promise<FacadeResponse<{ data: AuditLog[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: AuditLog[]
        total: number
        page: number
        pageSize: number
      }>('/admin/security/audit-logs', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 根据ID获取审计日志详情
 */
export const getAuditLogById = async (id: string): Promise<FacadeResponse<AuditLog>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<AuditLog>(`/admin/security/audit-logs/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 导出审计日志
 */
export const exportAuditLogs = async (
  params: AuditLogQueryParams = {}
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // Mock export response - return a CSV blob with sample data
      const csvContent =
        'id,timestamp,action,userId,ip,message\n' +
        'log_001,2024-11-01T10:30:00Z,login_success,user_001,192.168.1.100,Successful login from IP\n' +
        'log_002,2024-11-01T11:45:00Z,deposit_completed,user_002,203.0.113.50,Deposit of 1.0 BTC completed'
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      return createSuccessResponse(blob)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
