/**
 * Market Facade - 市场数据统一出入口
 */

import type { FacadeResponse } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type {
  KlineData,
  MarketTrade,
  MarketDepth,
  MarketSummary,
  KlineQueryParams,
  MarketTradeQueryParams,
  MarketDepthQueryParams,
} from '@/contracts/market'

/**
 * 获取K线数据
 */
export const getKlineData = async (
  params: KlineQueryParams
): Promise<FacadeResponse<KlineData[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<KlineData[]>(`/admin/market/klines`, { params })
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
 * 获取市场成交数据
 */
export const getMarketTrades = async (
  params: MarketTradeQueryParams
): Promise<FacadeResponse<MarketTrade[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MarketTrade[]>(`/admin/market/trades`, { params })
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
 * 获取市场深度数据
 */
export const getMarketDepth = async (
  params: MarketDepthQueryParams
): Promise<FacadeResponse<MarketDepth>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MarketDepth>(`/admin/market/depth`, { params })
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
 * 获取市场摘要数据
 */
export const getMarketSummary = async (symbol?: string): Promise<FacadeResponse<MarketSummary>> => {
  try {
    if (isMockMode()) {
      const endpoint = symbol ? `/admin/market/summary/${symbol}` : '/admin/market/summary'
      const response = await safeGet<MarketSummary>(endpoint)
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
 * 获取多个市场的摘要数据
 */
export const getMarketSummaries = async (params?: {
  symbols?: string[]
  category?: string
}): Promise<FacadeResponse<MarketSummary[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MarketSummary[]>(`/admin/market/summaries`, { params })
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
