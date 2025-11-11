/**
 * Analytics Facade - 数据分析统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type {
  TradingVolumeSummary,
  VolumeByInstrument,
  TradingPairPerformance,
  UserTradingActivity,
  TradingVolumeData,
  UserAnalyticsSummary,
  RegistrationTrend,
  RetentionMetric,
  KycCompletionRate,
  VipDistribution,
  RevenueSummary,
  FeeRevenueByType,
  RevenueByInstrument,
  RevenueTrend,
  AnalyticsQueryParams,
} from '@/contracts/analytics'

// Trading Analytics Functions

/**
 * 获取交易统计概览
 */
export const getTradingAnalyticsSummary = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<TradingVolumeSummary>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<TradingVolumeSummary>('/admin/analytics/trading/summary', {
        params,
      })
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
 * 获取按币种分布的交易量
 */
export const getVolumeByInstrument = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<VolumeByInstrument[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<VolumeByInstrument[]>(
        '/admin/analytics/volume-by-instrument',
        { params }
      )
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
 * 获取交易对表现数据
 */
export const getTradingPairPerformance = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<TradingPairPerformance[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<TradingPairPerformance[]>(
        '/admin/analytics/pair-performance',
        { params }
      )
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
 * 获取用户交易活动数据
 */
export const getUserTradingActivities = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<UserTradingActivity[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<UserTradingActivity[]>('/admin/analytics/user-activities', {
        params,
      })
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
 * 获取交易量时序数据
 */
export const getTradingVolumeData = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<TradingVolumeData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<TradingVolumeData[]>('/admin/analytics/volume-timeline', {
        params,
      })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// User Analytics Functions

/**
 * 获取用户统计概览
 */
export const getUserAnalyticsSummary = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<UserAnalyticsSummary>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<UserAnalyticsSummary>('/admin/analytics/users/summary', {
        params,
      })
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
 * 获取注册趋势数据
 */
export const getRegistrationTrends = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<RegistrationTrend[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RegistrationTrend[]>(
        '/admin/analytics/users/registration-trends',
        { params }
      )
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
 * 获取用户留存数据
 */
export const getRetentionMetrics = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<RetentionMetric[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RetentionMetric[]>('/admin/analytics/users/retention', {
        params,
      })
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
 * 获取KYC完成率数据
 */
export const getKycCompletionRates = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<KycCompletionRate[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<KycCompletionRate[]>('/admin/analytics/users/kyc-completion', {
        params,
      })
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
 * 获取VIP分布数据
 */
export const getVipDistribution = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<VipDistribution[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<VipDistribution[]>('/admin/analytics/users/vip-distribution', {
        params,
      })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Revenue Analytics Functions

/**
 * 获取收入统计概览
 */
export const getRevenueAnalyticsSummary = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<RevenueSummary>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RevenueSummary>('/admin/analytics/revenue/summary', { params })
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
 * 获取按费用类型分布的收入
 */
export const getFeeRevenueByType = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<FeeRevenueByType[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FeeRevenueByType[]>('/admin/analytics/revenue/by-type', {
        params,
      })
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
 * 获取按交易对分布的收入
 */
export const getRevenueByInstrument = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<RevenueByInstrument[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RevenueByInstrument[]>(
        '/admin/analytics/revenue/by-instrument',
        { params }
      )
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
 * 获取收入趋势数据
 */
export const getRevenueTrend = async (
  params?: AnalyticsQueryParams
): Promise<FacadeResponse<RevenueTrend[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RevenueTrend[]>('/admin/analytics/revenue/trend', { params })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Export Functions

/**
 * 导出交易分析报告
 */
export const exportTradingAnalytics = async (
  params: AnalyticsQueryParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return sample CSV data
      const csvContent =
        'date,volume,trades,active_users\n' +
        '2024-01-01,1000000,5000,1200\n' +
        '2024-01-02,1200000,5500,1300\n' +
        '2024-01-03,1100000,4500,1250'
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      return createSuccessResponse(blob)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 导出用户分析报告
 */
export const exportUserAnalytics = async (
  params: AnalyticsQueryParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return sample CSV data
      const csvContent =
        'date,new_users,active_users,retention_rate\n' +
        '2024-01-01,50,1200,75.5\n' +
        '2024-01-02,45,1300,76.2\n' +
        '2024-01-03,52,1250,74.8'
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      return createSuccessResponse(blob)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 导出收入分析报告
 */
export const exportRevenueAnalytics = async (
  params: AnalyticsQueryParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return sample CSV data
      const csvContent =
        'date,revenue,fees,other_income\n' +
        '2024-01-01,50000,35000,15000\n' +
        '2024-01-02,55000,38000,17000\n' +
        '2024-01-03,52000,36000,16000'
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      return createSuccessResponse(blob)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
