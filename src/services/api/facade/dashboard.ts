/**
 * Dashboard Facade - 仪表板统一出入口
 */

import type { FacadeResponse } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { safeGet } from '../_client'

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
