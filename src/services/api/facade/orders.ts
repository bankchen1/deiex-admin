/**
 * Orders Facade - 订单管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost } from '../_client'
import type {
  Order,
  FuturesOrder,
  Position,
  Liquidation,
  CopyTradingRelation,
} from '@/contracts/orders'

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

// Copy Trading Related Functions

/**
 * 获取跟随交易关系列表
 */
export const listCopyTradingRelations = async (
  params: {
    page?: number
    pageSize?: number
    masterId?: string
    followerId?: string
    status?: string
  } = {}
): Promise<
  FacadeResponse<{ data: CopyTradingRelation[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: CopyTradingRelation[]
        total: number
        page: number
        pageSize: number
      }>('/admin/orders/copy-trading', { params })
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
 * 根据ID获取跟随交易关系
 */
export const getCopyTradingRelationById = async (
  id: string
): Promise<FacadeResponse<CopyTradingRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<CopyTradingRelation>(`/admin/orders/copy-trading/${id}`)
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
 * 更新跟随交易关系
 */
export const updateCopyTradingRelation = async (
  id: string,
  payload: Partial<CopyTradingRelation>
): Promise<FacadeResponse<CopyTradingRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<CopyTradingRelation>(
        `/admin/orders/copy-trading/${id}`,
        payload
      )
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
 * 暂停跟随交易关系
 */
export const pauseCopyTradingRelation = async (
  id: string
): Promise<FacadeResponse<CopyTradingRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<CopyTradingRelation>(`/admin/orders/copy-trading/${id}/pause`)
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
 * 恢复跟随交易关系
 */
export const resumeCopyTradingRelation = async (
  id: string
): Promise<FacadeResponse<CopyTradingRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<CopyTradingRelation>(
        `/admin/orders/copy-trading/${id}/resume`
      )
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
 * 偢复跟随交易关系
 */
export const stopCopyTradingRelation = async (
  id: string
): Promise<FacadeResponse<CopyTradingRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<CopyTradingRelation>(`/admin/orders/copy-trading/${id}/stop`)
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
 * 导出跟随交易列表
 */
export const exportCopyTradingRelations = async (
  params: {
    page?: number
    pageSize?: number
    masterId?: string
    followerId?: string
    status?: string
  } = {}
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Blob>('/admin/orders/copy-trading/export', {
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
 * 导出清算记录
 */
export const exportLiquidations = async (
  params: LiquidationQueryParams = {}
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Blob>('/admin/orders/liquidations/export', {
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
