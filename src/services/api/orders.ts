import { apiClient } from './AdminApiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

// Query Parameters
export interface OrderQueryParams {
  page?: number
  pageSize?: number
  symbol?: string
  type?: 'spot' | 'futures'
  side?: 'buy' | 'sell'
  status?: string
  userId?: string
  startTime?: string
  endTime?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PositionQueryParams {
  page?: number
  pageSize?: number
  symbol?: string
  side?: 'long' | 'short'
  userId?: string
  riskRatioMin?: number
  riskRatioMax?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface LiquidationQueryParams {
  page?: number
  pageSize?: number
  symbol?: string
  userId?: string
  startTime?: string
  endTime?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CopyTradingQueryParams {
  page?: number
  pageSize?: number
  leaderId?: string
  followerId?: string
  status?: 'active' | 'paused' | 'stopped'
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

// Data Models
export interface Order {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  type: 'spot' | 'futures'
  side: 'buy' | 'sell'
  orderType: 'limit' | 'market' | 'stop-limit' | 'stop-market'
  price?: string
  quantity: string
  filled: string
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  errorCode?: string
  matchingLatency?: number
  createdAt: string
  updatedAt: string
}

export interface FuturesOrder extends Order {
  leverage: number
  marginMode: 'isolated' | 'cross'
  positionSide: 'long' | 'short'
  liquidationPrice?: string
  fundingImpact?: string
  reduceOnly?: boolean
}

export interface Position {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  marginMode: 'isolated' | 'cross'
  entryPrice: string
  markPrice: string
  liquidationPrice: string
  quantity: string
  margin: string
  unrealizedPnl: string
  unrealizedPnlPercent: number
  riskRatio: number
  createdAt: string
  updatedAt: string
}

export interface Liquidation {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  entryPrice: string
  liquidationPrice: string
  quantity: string
  loss: string
  lossPercent: number
  liquidatedAt: string
  reason: string
  timeline: LiquidationEvent[]
}

export interface LiquidationEvent {
  timestamp: string
  event: string
  markPrice: string
  riskRatio: number
  description: string
}

export interface CopyTradingRelation {
  id: string
  leaderId: string
  leaderNickname: string
  followerId: string
  followerNickname: string
  status: 'active' | 'paused' | 'stopped'
  copyRatio: number
  maxPositionSize: string
  stopLossPercent?: number
  takeProfitPercent?: number
  profitSharePercent: number
  totalProfit: string
  totalLoss: string
  createdAt: string
  updatedAt: string
}

// API Service
export const ordersApi = {
  // Spot Orders
  getSpotOrders(params: OrderQueryParams) {
    return apiClient.get<PaginatedResponse<Order>>('/admin/orders/spot', { params })
  },

  getSpotOrderById(id: string) {
    return apiClient.get<ApiResponse<Order>>(`/admin/orders/spot/${id}`)
  },

  exportSpotOrders(params: OrderQueryParams) {
    return apiClient.get<Blob>('/admin/orders/spot/export', {
      params,
      responseType: 'blob',
    })
  },

  // Futures Orders
  getFuturesOrders(params: OrderQueryParams) {
    return apiClient.get<PaginatedResponse<FuturesOrder>>('/admin/orders/futures', { params })
  },

  getFuturesOrderById(id: string) {
    return apiClient.get<ApiResponse<FuturesOrder>>(`/admin/orders/futures/${id}`)
  },

  exportFuturesOrders(params: OrderQueryParams) {
    return apiClient.get<Blob>('/admin/orders/futures/export', {
      params,
      responseType: 'blob',
    })
  },

  // Positions
  getPositions(params: PositionQueryParams) {
    return apiClient.get<PaginatedResponse<Position>>('/admin/positions', { params })
  },

  getPositionById(id: string) {
    return apiClient.get<ApiResponse<Position>>(`/admin/positions/${id}`)
  },

  exportPositions(params: PositionQueryParams) {
    return apiClient.get<Blob>('/admin/positions/export', {
      params,
      responseType: 'blob',
    })
  },

  // Liquidations
  getLiquidations(params: LiquidationQueryParams) {
    return apiClient.get<PaginatedResponse<Liquidation>>('/admin/liquidations', { params })
  },

  getLiquidationById(id: string) {
    return apiClient.get<ApiResponse<Liquidation>>(`/admin/liquidations/${id}`)
  },

  exportLiquidations(params: LiquidationQueryParams) {
    return apiClient.get<Blob>('/admin/liquidations/export', {
      params,
      responseType: 'blob',
    })
  },

  // Copy Trading
  getCopyTradingRelations(params: CopyTradingQueryParams) {
    return apiClient.get<PaginatedResponse<CopyTradingRelation>>('/admin/copy-trading', {
      params,
    })
  },

  getCopyTradingById(id: string) {
    return apiClient.get<ApiResponse<CopyTradingRelation>>(`/admin/copy-trading/${id}`)
  },

  updateCopyTrading(id: string, payload: Partial<CopyTradingRelation>) {
    return apiClient.put<ApiResponse<CopyTradingRelation>>(`/admin/copy-trading/${id}`, payload)
  },

  pauseCopyTrading(id: string) {
    return apiClient.post<ApiResponse<CopyTradingRelation>>(`/admin/copy-trading/${id}/pause`)
  },

  resumeCopyTrading(id: string) {
    return apiClient.post<ApiResponse<CopyTradingRelation>>(`/admin/copy-trading/${id}/resume`)
  },

  stopCopyTrading(id: string) {
    return apiClient.post<ApiResponse<CopyTradingRelation>>(`/admin/copy-trading/${id}/stop`)
  },

  exportCopyTrading(params: CopyTradingQueryParams) {
    return apiClient.get<Blob>('/admin/copy-trading/export', {
      params,
      responseType: 'blob',
    })
  },
}
