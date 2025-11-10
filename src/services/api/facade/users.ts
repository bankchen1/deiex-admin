/**
 * Users Facade - 用户管理统一出入口
 *
 * 职责：
 * 1. 根据环境切换Mock/Real数据源
 * 2. 统一返回格式（FacadeResponse）
 * 3. 不暴露底层实现细节给UI层
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type {
  UserListResponse,
  UserDetailResponse,
  UserStats,
  UserQueryParams,
  UserVipUpdatePayload,
  UserTagUpdatePayload,
  User2FAResetPayload,
  UserDisablePayload,
  UserEnablePayload,
  UserExportResponse,
} from '@/contracts/users'

/**
 * 用户查询参数
 */
export interface UserQueryParamsExtended extends PaginationParams {
  status?: 'active' | 'disabled' | 'suspended' | 'all'
  vipLevel?: number
  kycStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  tags?: string[]
  search?: string
  startDate?: string
  endDate?: string
}

/**
 * 获取用户列表
 */
export const listUsers = async (
  params: UserQueryParamsExtended = {}
): Promise<FacadeResponse<UserListResponse>> => {
  try {
    if (isMockMode()) {
      // Mock模式：使用现有的Mock Service
      const response = await safeGet<UserListResponse>('/admin/users', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      // TODO: 等SDK有对应的users list端点后实现
      // const response = await sdk.users.listUsers(params)
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取用户详情
 */
export const getUserById = async (id: string): Promise<FacadeResponse<UserDetailResponse>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safeGet<UserDetailResponse>(`/admin/users/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      // TODO: 等SDK有对应端点后实现
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取用户统计
 */
export const getUserStats = async (params?: {
  startDate?: string
  endDate?: string
}): Promise<FacadeResponse<UserStats>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safeGet<UserStats>('/admin/users/stats', { params })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      // TODO: 等SDK有对应端点后实现
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新用户VIP等级
 */
export const updateUserVip = async (
  id: string,
  payload: UserVipUpdatePayload
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safePost<any>(`/admin/users/${id}/vip`, payload)
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
 * 更新用户风险标签
 */
export const updateUserTags = async (
  id: string,
  payload: UserTagUpdatePayload
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safePost<any>(`/admin/users/${id}/tags`, payload)
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
 * 重置用户2FA
 */
export const resetUser2FA = async (
  id: string,
  payload: User2FAResetPayload
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safePost<any>(`/admin/users/${id}/reset-2fa`, payload)
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
 * 禁用用户账户
 */
export const disableUser = async (
  id: string,
  payload: UserDisablePayload
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safePost<any>(`/admin/users/${id}/disable`, payload)
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
 * 启用用户账户
 */
export const enableUser = async (
  id: string,
  payload: UserEnablePayload
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safePost<any>(`/admin/users/${id}/enable`, payload)
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
 * 导出用户数据
 */
export const exportUsers = async (
  params: UserQueryParamsExtended = {}
): Promise<FacadeResponse<UserExportResponse>> => {
  try {
    if (isMockMode()) {
      // Mock模式
      const response = await safeGet<UserExportResponse>('/admin/users/export', {
        params,
        responseType: 'blob',
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
