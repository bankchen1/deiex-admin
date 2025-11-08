/**
 * KYC Facade - KYC管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { safeGet, safePost } from '../_client'
import type { KycApplication } from '@/types/models'

/**
 * KYC查询参数
 */
export interface KycQueryParams extends PaginationParams {
  status?: 'pending' | 'approved' | 'rejected'
  country?: string
  riskLevel?: 'low' | 'medium' | 'high'
  startDate?: string
  endDate?: string
}

/**
 * KYC统计
 */
export interface KycStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

/**
 * 获取KYC申请列表
 */
export const listKycApplications = async (
  params: KycQueryParams = {}
): Promise<
  FacadeResponse<{ data: KycApplication[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: KycApplication[]
        total: number
        page: number
        pageSize: number
      }>('/admin/kyc', { params })
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
 * 获取KYC申请详情
 */
export const getKycApplicationById = async (
  id: string
): Promise<FacadeResponse<KycApplication>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<KycApplication>(`/admin/kyc/${id}`)
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
 * 获取KYC统计
 */
export const getKycStats = async (): Promise<FacadeResponse<KycStats>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<KycStats>('/admin/kyc/stats')
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
 * 审批KYC申请
 */
export const approveKycApplication = async (
  id: string,
  payload: { reason?: string; notes?: string }
): Promise<FacadeResponse<KycApplication>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<KycApplication>(`/admin/kyc/${id}/approve`, payload)
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
 * 拒绝KYC申请
 */
export const rejectKycApplication = async (
  id: string,
  payload: { reason: string; notes?: string }
): Promise<FacadeResponse<KycApplication>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<KycApplication>(`/admin/kyc/${id}/reject`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
