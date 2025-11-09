/**
 * Reports Facade - 报表管理统一出入口
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
  TradeReport,
  FinanceReport, 
  RetentionReport,
  TradeDailyData,
  SymbolVolumeData,
  FinanceDailyData,
  FeeIncomeData,
  RetentionData,
  FunnelData,
  TradeReportQueryParams,
  FinanceReportQueryParams,
  RetentionReportQueryParams,
  GenerateReportPayload,
  ExportReportParams
} from '@/contracts/reports'

/**
 * 获取交易报表列表
 */
export const listTradeReports = async (
  params: TradeReportQueryParams = {}
): Promise<FacadeResponse<{ data: TradeReport[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: TradeReport[]
        total: number
        page: number
        pageSize: number
      }>('/admin/reports/trades', { params })
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
 * 获取财务报表列表
 */
export const listFinanceReports = async (
  params: FinanceReportQueryParams = {}
): Promise<FacadeResponse<{ data: FinanceReport[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: FinanceReport[]
        total: number
        page: number
        pageSize: number
      }>('/admin/reports/finance', { params })
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
 * 获取留存报表列表
 */
export const listRetentionReports = async (
  params: RetentionReportQueryParams = {}
): Promise<FacadeResponse<{ data: RetentionReport[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: RetentionReport[]
        total: number
        page: number
        pageSize: number
      }>('/admin/reports/retention', { params })
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
 * 获取交易日报数据
 */
export const getTradeDailyData = async (
  params: { startDate?: string; endDate?: string; symbol?: string }
): Promise<FacadeResponse<TradeDailyData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<TradeDailyData[]>('/admin/reports/trades/daily', { params })
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
 * 获取品种成交量数据
 */
export const getSymbolVolumeData = async (
  params: { startDate?: string; endDate?: string; currency?: string }
): Promise<FacadeResponse<SymbolVolumeData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<SymbolVolumeData[]>('/admin/reports/trades/symbol-volume', { params })
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
 * 获取财务日报数据
 */
 export const getFinanceDailyData = async (
  params: { startDate?: string; endDate?: string; currency?: string }
): Promise<FacadeResponse<FinanceDailyData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FinanceDailyData[]>('/admin/reports/finance/daily', { params })
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
 * 获取手续费收入数据
 */
export const getFeeIncomeData = async (
  params: { startDate?: string; endDate?: string; feeType?: string; currency?: string }
): Promise<FacadeResponse<FeeIncomeData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FeeIncomeData[]>('/admin/reports/finance/fee-income', { params })
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
 * 获取留存率数据
 */
export const getRetentionData = async (
  params: { startDate?: string; endDate?: string; period?: string }
): Promise<FacadeResponse<RetentionData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RetentionData[]>('/admin/reports/retention/data', { params })
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
 * 获取转化漏斗数据
 */
export const getFunnelData = async (
  params: { startDate?: string; endDate?: string; step?: string }
): Promise<FacadeResponse<FunnelData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FunnelData[]>('/admin/reports/retention/funnel', { params })
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
 * 导出交易报表
 */
export const exportTradeReport = async (
  params: ExportReportParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return a simulated blob response
      const data = `symbol,date,volume,turnover,trades,takerBuyVolume,takerBuyTurnover
BTCUSDT,2024-11-08,125.5,6250000.00,2450,65.2,3250000.00
ETHUSDT,2024-11-08,320.2,12800000.00,3560,180.1,7200000.00`
      const blob = new Blob([data], { type: 'text/csv' })
      return createSuccessResponse(blob)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 导出财务报表
 */
export const exportFinanceReport = async (
  params: ExportReportParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return a simulated blob response
      const data = `date,depositAmount,depositCount,withdrawalAmount,withdrawalCount,feeIncome,userCount,activeUserCount
2024-11-08,1250000.00,125,850000.00,85,15000.00,50000,1250`
      const blob = new Blob([data], { type: 'text/csv' })
      return createSuccessResponse(blob)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 导出留存报表
 */
export const exportRetentionReport = async (
  params: ExportReportParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return a simulated blob response
      const data = `date,newUserCount,day1,day7,day30,day90,MTD,QTD,YTD
2024-11-08,125,0.25,0.18,0.12,0.08,0.15,0.12,0.10`
      const blob = new Blob([data], { type: 'text/csv' })
      return createSuccessResponse(blob)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}