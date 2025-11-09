/**
 * Orders Facade - 订单管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet } from '../_client'
import type { Order, FuturesOrder, Position, Liquidation } from '@/contracts/orders'

/**
 * 订单查询参数
 */
export interface OrderQueryParams extends PaginationParams {
  symbol?: string
  side?: 'buy' | 'sell'
  status?: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  userId?: string
  startDate?: string
  endDate?: string
}

/**
 * 持仓查询参数
 */
export interface PositionQueryParams extends PaginationParams {
  symbol?: string
  side?: 'long' | 'short'
  userId?: string
}

/**
 * 获取现货订单列表
 */
export const listSpotOrders = async (
  params: OrderQueryParams = {}
): Promise<FacadeResponse<{ data: Order[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Order[]
        total: number
        page: number
        pageSize: number
      }>('/admin/orders/spot', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK Trading API
      const response = await sdk.trading.apiV1TradingOrdersGet({
        symbol: params.symbol,
        status: params.status,
        side: params.side,
        limit: params.pageSize || 20,
        offset: ((params.page || 1) - 1) * (params.pageSize || 20),
      })

      const orders = (response.data.data as any)?.items || []
      const total = (response.data.data as any)?.total || 0

      return createSuccessResponse(
        {
          data: orders,
          total,
          page: params.page || 1,
          pageSize: params.pageSize || 20,
        },
        {
          pagination: {
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            total,
          },
        }
      )
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取期货订单列表
 */
export const listFuturesOrders = async (
  params: OrderQueryParams = {}
): Promise<
  FacadeResponse<{ data: FuturesOrder[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: FuturesOrder[]
        total: number
        page: number
        pageSize: number
      }>('/admin/orders/futures', { params })
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
 * 获取持仓列表
 */
export const listPositions = async (
  params: PositionQueryParams = {}
): Promise<FacadeResponse<{ data: Position[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Position[]
        total: number
        page: number
        pageSize: number
      }>('/admin/orders/positions', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK Trading API
      const response = await sdk.trading.apiV1TradingPositionsGet({
        symbol: params.symbol,
      })

      const positions = (response.data.data as any) || []
      const total = positions.length

      // 手动分页（SDK不支持分页参数）
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedPositions = positions.slice(start, end)

      return createSuccessResponse(
        {
          data: paginatedPositions,
          total,
          page,
          pageSize,
        },
        {
          pagination: {
            page,
            pageSize,
            total,
          },
        }
      )
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取清算记录列表
 */
export const listLiquidations = async (
  params: PaginationParams = {}
): Promise<
  FacadeResponse<{ data: Liquidation[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Liquidation[]
        total: number
        page: number
        pageSize: number
      }>('/admin/orders/liquidations', { params })
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
 * 获取现货订单详情
 */
export const getSpotOrderById = async (id: string): Promise<FacadeResponse<Order>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Order>(`/admin/orders/spot/${id}`)
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
 * 获取期货订单详情
 */
export const getFuturesOrderById = async (id: string): Promise<FacadeResponse<FuturesOrder>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FuturesOrder>(`/admin/orders/futures/${id}`)
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
 * 获取持仓详情
 */
export const getPositionById = async (id: string): Promise<FacadeResponse<Position>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Position>(`/admin/orders/positions/${id}`)
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
 * 获取清算记录详情
 */
export const getLiquidationById = async (id: string): Promise<FacadeResponse<Liquidation>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Liquidation>(`/admin/orders/liquidations/${id}`)
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
 * 导出现货订单
 */
export const exportSpotOrders = async (
  params: OrderQueryParams = {}
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Blob>('/admin/orders/spot/export', {
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

/**
 * 导出期货订单
 */
export const exportFuturesOrders = async (
  params: OrderQueryParams = {}
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Blob>('/admin/orders/futures/export', {
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
