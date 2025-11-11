/**
 * Dashboard Facade - 仪表板统一出入口
 */

import type { FacadeResponse } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type { Alert, AlertDetail, DashboardQueryParams } from '@/contracts/dashboard'

/**
 * Dashboard统计数据
 */
export interface DashboardStats {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  trading: {
    volume24h: number
    orders24h: number
    growth: number
  }
  revenue: {
    total: number
    today: number
    growth: number
  }
  kyc: {
    pending: number
    approved: number
    rejected: number
  }
}

/**
 * Dashboard图表数据
 */
export interface DashboardCharts {
  userGrowth: Array<{ date: string; count: number }>
  tradingVolume: Array<{ date: string; volume: number }>
  revenue: Array<{ date: string; amount: number }>
  orderDistribution: Array<{ type: string; count: number }>
}

/**
 * 日期范围参数
 */
export interface DateRangeParams {
  startDate?: string
  endDate?: string
}

/**
 * 获取Dashboard统计数据
 */
export const getDashboardStats = async (
  params?: DateRangeParams
): Promise<FacadeResponse<DashboardStats>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<DashboardStats>('/admin/dashboard/stats', { params })
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
 * 获取Dashboard图表数据
 */
export const getDashboardCharts = async (
  params?: DateRangeParams
): Promise<FacadeResponse<DashboardCharts>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<DashboardCharts>('/admin/dashboard/charts', { params })
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
 * 获取Dashboard警报列表
 */
export const getDashboardAlerts = async (params?: {
  status?: string
  type?: string
  limit?: number
}): Promise<FacadeResponse<Alert[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Alert[]>('/admin/dashboard/alerts', { params })
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
 * 根据ID获取Dashboard警报详情
 */
export const getDashboardAlertById = async (id: string): Promise<FacadeResponse<AlertDetail>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<AlertDetail>(`/admin/dashboard/alerts/${id}`)
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
 * 更新警报状态
 */
export const updateAlertStatus = async (
  id: string,
  status: string,
  notes?: string
): Promise<FacadeResponse<Alert>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Alert>(`/admin/dashboard/alerts/${id}`, { status, notes })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
