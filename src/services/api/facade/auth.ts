/**
 * Auth Facade - 认证管理统一出入口
 */

import type { FacadeResponse } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type { AdminUser } from '@/contracts/auth'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AdminUser
}

interface RefreshTokenPayload {
  refreshToken: string
}

/**
 * 用户登录
 */
export const login = async (
  payload: LoginPayload
): Promise<FacadeResponse<LoginResponse>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<LoginResponse>('/auth/login', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 用户登出
 */
export const logout = async (): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<boolean>('/auth/logout')
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 刷新访问令牌
 */
export const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<FacadeResponse<{ accessToken: string; refreshToken: string }>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<{ accessToken: string; refreshToken: string }>('/auth/refresh', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<AdminUser>('/auth/me')
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新用户权限
 */
export const updateUserPermissions = async (
  userId: string,
  permissions: string[]
): Promise<FacadeResponse<AdminUser>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<AdminUser>(`/admin/users/${userId}/permissions`, { permissions })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 重置用户密码
 */
export const resetUserPassword = async (
  userId: string,
  newPassword: string
): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<boolean>(`/admin/users/${userId}/reset-password`, { newPassword })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}