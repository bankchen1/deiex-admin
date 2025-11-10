/**
 * Risk Facade - 风险管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type { RiskRule, RiskLimit, BlacklistEntry } from '@/contracts/risk'

/**
 * 风险规则查询参数
 */
export interface RiskRuleQueryParams extends PaginationParams {
  enabled?: boolean
  status?: 'draft' | 'published'
}

/**
 * 风险限制查询参数
 */
export interface RiskLimitQueryParams extends PaginationParams {
  scope?: 'user' | 'country' | 'device' | 'currency'
  type?: 'deposit' | 'withdrawal' | 'trading' | 'position'
  enabled?: boolean
}

/**
 * 黑名单查询参数
 */
export interface BlacklistQueryParams extends PaginationParams {
  type?: 'address' | 'device' | 'ip' | 'country' | 'email' | 'phone'
  status?: 'active' | 'expired' | 'removed'
}

/**
 * 获取风险规则列表
 */
export const listRiskRules = async (
  params: RiskRuleQueryParams = {}
): Promise<FacadeResponse<{ data: RiskRule[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: RiskRule[]
        total: number
        page: number
        pageSize: number
      }>('/admin/risk/rules', { params })
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
 * 获取风险规则详情
 */
export const getRiskRuleById = async (id: string): Promise<FacadeResponse<RiskRule>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RiskRule>(`/admin/risk/rules/${id}`)
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
 * 创建风险规则
 */
export const createRiskRule = async (
  payload: Partial<RiskRule>
): Promise<FacadeResponse<RiskRule>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<RiskRule>('/admin/risk/rules', payload)
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
 * 更新风险规则
 */
export const updateRiskRule = async (
  id: string,
  payload: Partial<RiskRule>
): Promise<FacadeResponse<RiskRule>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<RiskRule>(`/admin/risk/rules/${id}`, payload)
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
 * 删除风险规则
 */
export const deleteRiskRule = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/risk/rules/${id}`)
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
 * 获取风险限制列表
 */
export const listRiskLimits = async (
  params: RiskLimitQueryParams = {}
): Promise<
  FacadeResponse<{ data: RiskLimit[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: RiskLimit[]
        total: number
        page: number
        pageSize: number
      }>('/admin/risk/limits', { params })
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
 * 根据ID获取风险限制
 */
export const getRiskLimitById = async (id: string): Promise<FacadeResponse<RiskLimit>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RiskLimit>(`/admin/risk/limits/${id}`)
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
 * 创建风险限制
 */
export const createRiskLimit = async (
  payload: Partial<RiskLimit>
): Promise<FacadeResponse<RiskLimit>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<RiskLimit>('/admin/risk/limits', payload)
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
 * 更新风险限制
 */
export const updateRiskLimit = async (
  id: string,
  payload: Partial<RiskLimit>
): Promise<FacadeResponse<RiskLimit>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<RiskLimit>(`/admin/risk/limits/${id}`, payload)
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
 * 删除风险限制
 */
export const deleteRiskLimit = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/risk/limits/${id}`)
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
 * 获取黑名单列表
 */
export const listBlacklistEntries = async (
  params: BlacklistQueryParams = {}
): Promise<
  FacadeResponse<{ data: BlacklistEntry[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: BlacklistEntry[]
        total: number
        page: number
        pageSize: number
      }>('/admin/risk/blacklist', { params })
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
 * 根据ID获取黑名单条目
 */
export const getBlacklistEntryById = async (
  id: string
): Promise<FacadeResponse<BlacklistEntry>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<BlacklistEntry>(`/admin/risk/blacklist/${id}`)
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
 * 添加黑名单条目
 */
export const createBlacklistEntry = async (
  payload: Partial<BlacklistEntry>
): Promise<FacadeResponse<BlacklistEntry>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<BlacklistEntry>('/admin/risk/blacklist', payload)
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
 * 更新黑名单条目
 */
export const updateBlacklistEntry = async (
  id: string,
  payload: Partial<BlacklistEntry>
): Promise<FacadeResponse<BlacklistEntry>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<BlacklistEntry>(`/admin/risk/blacklist/${id}`, payload)
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
 * 移除黑名单条目
 */
export const deleteBlacklistEntry = async (
  id: string,
  reason: string
): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/risk/blacklist/${id}`, {
        data: { reason },
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
