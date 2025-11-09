/**
 * Config Facade - 配置管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut } from '../_client'
import type { Instrument, MarginTemplate, TradingFeeTemplate } from '@/contracts/config'

/**
 * 交易对查询参数
 */
export interface InstrumentQueryParams extends PaginationParams {
  type?: 'spot' | 'futures'
  status?: 'draft' | 'published'
  visible?: boolean
  search?: string
}

/**
 * 获取交易对列表
 */
export const listInstruments = async (
  params: InstrumentQueryParams = {}
): Promise<
  FacadeResponse<{ data: Instrument[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Instrument[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/instruments', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.instruments.adminConfigInstrumentsGet(
        params.page,
        params.pageSize,
        params.type,
        params.status
      )
      return createSuccessResponse(
        response.data.data || { data: [], total: 0, page: 1, pageSize: 10 }
      )
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取交易对详情
 */
export const getInstrumentBySymbol = async (
  symbol: string
): Promise<FacadeResponse<Instrument>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Instrument>(`/admin/config/instruments/${symbol}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      const response = await sdk.instruments.adminConfigInstrumentsSymbolGet(symbol)
      return createSuccessResponse(response.data.data || null)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建交易对
 */
export const createInstrument = async (
  payload: Partial<Instrument>
): Promise<FacadeResponse<Instrument>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Instrument>('/admin/config/instruments', payload)
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
 * 更新交易对
 */
export const updateInstrument = async (
  symbol: string,
  payload: Partial<Instrument>
): Promise<FacadeResponse<Instrument>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Instrument>(`/admin/config/instruments/${symbol}`, payload)
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
 * 发布交易对
 */
export const publishInstrument = async (symbol: string): Promise<FacadeResponse<Instrument>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Instrument>(`/admin/config/instruments/${symbol}/publish`)
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
 * 获取保证金模板列表
 */
export const listMarginTemplates = async (
  params: PaginationParams = {}
): Promise<
  FacadeResponse<{ data: MarginTemplate[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: MarginTemplate[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/margin', { params })
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
 * 获取费用模板列表
 */
export const listTradingFeeTemplates = async (
  params: PaginationParams = {}
): Promise<
  FacadeResponse<{ data: TradingFeeTemplate[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: TradingFeeTemplate[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/fees/trading', { params })
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
