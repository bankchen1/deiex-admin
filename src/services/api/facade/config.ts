/**
 * Config Facade - 配置管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type {
  Instrument,
  MarginTemplate,
  TradingFeeTemplate,
  MarginBinding,
  MarginBindingQueryParams,
  CreateMarginBindingPayload,
  UpdateMarginBindingPayload,
} from '@/contracts/config'

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

/**
 * 计算影响评估
 */
export const calculateImpact = async (params: any): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/instruments/impact-estimation', { params })
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
 * 获取保证金绑定列表
 */
export const listMarginBindings = async (
  params: MarginBindingQueryParams = {}
): Promise<
  FacadeResponse<{ data: MarginBinding[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: MarginBinding[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/margin/bindings', { params })
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
 * 根据ID获取保证金绑定
 */
export const getMarginBindingById = async (id: string): Promise<FacadeResponse<MarginBinding>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MarginBinding>(`/admin/config/margin/bindings/${id}`)
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
 * 创建保证金绑定
 */
export const createMarginBinding = async (
  payload: CreateMarginBindingPayload
): Promise<FacadeResponse<MarginBinding>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<MarginBinding>('/admin/config/margin/bindings', payload)
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
 * 更新保证金绑定
 */
export const updateMarginBinding = async (
  id: string,
  payload: UpdateMarginBindingPayload
): Promise<FacadeResponse<MarginBinding>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<MarginBinding>(`/admin/config/margin/bindings/${id}`, payload)
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
 * 删除保证金绑定
 */
export const deleteMarginBinding = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/margin/bindings/${id}`)
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
 * 发布保证金模板
 */
export const publishMarginTemplate = async (
  id: string
): Promise<FacadeResponse<MarginTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<MarginTemplate>(
        `/admin/config/margin/templates/${id}/publish`
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
 * 导入保证金数据
 */
export const importMarginData = async (payload: any): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<any>('/admin/config/margin/import', payload)
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
 * 导出保证金数据
 */
export const exportMarginData = async (params?: any): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return a sample CSV blob
      const csvContent =
        'symbol,templateId,templateName,status\n' +
        'BTCUSDT,temp_001,Basic Template,published\n' +
        'ETHUSDT,temp_002,Advanced Template,draft'
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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
 * 获取保证金版本列表
 */
export const getMarginVersions = async (): Promise<FacadeResponse<any[]>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any[]>('/admin/config/margin/versions')
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
 * 获取保证金特定版本
 */
export const getMarginVersion = async (id: string): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>(`/admin/config/margin/versions/${id}`)
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
 * 回滚保证金版本
 */
export const rollbackMarginVersion = async (id: string): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<any>(`/admin/config/margin/versions/rollback/${id}`)
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
 * 获取保证金模板差异
 */
export const getMarginTemplateDiff = async (): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/margin/diff/templates')
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
 * 获取保证金绑定差异
 */
export const getMarginBindingDiff = async (): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/margin/diff/bindings')
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
