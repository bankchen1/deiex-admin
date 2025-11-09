/**
 * Strategies Facade - 策略管理统一出入口
 * 
 * 职责：
 * 1. 根据环境切换Mock/Real数据源
 * 2. 统一返回格式（FacadeResponse）
 * 3. 不暴露底层实现细节给UI层
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { sdk } from '../_sdk'
import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type { 
  StrategyTemplate, 
  StrategyInstance, 
  BacktestResult, 
  StrategyPerformance, 
  StrategyMonitoring,
  StrategyTemplateQueryParams, 
  StrategyInstanceQueryParams, 
  BacktestQueryParams, 
  StrategyPerformanceQueryParams, 
  StrategyMonitoringQueryParams,
  CreateStrategyTemplatePayload,
  UpdateStrategyTemplatePayload,
  CreateStrategyInstancePayload,
  UpdateStrategyInstancePayload,
  RunBacktestPayload,
  UpdateStrategyMonitoringPayload
} from '@/contracts/strategies'

/**
 * 获取策略模板列表
 */
export const listStrategyTemplates = async (
  params: StrategyTemplateQueryParams = {}
): Promise<FacadeResponse<{ data: StrategyTemplate[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: StrategyTemplate[]
        total: number
        page: number
        pageSize: number
      }>('/admin/strategies/templates', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.listStrategyTemplates({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortField,
        sortOrder: params.sortOrder,
        status: params.status,
        category: params.category,
        search: params.search,
      })

      const templates = response.data.data
      const total = response.data.total

      return createSuccessResponse(
        {
          data: templates,
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
 * 根据ID获取策略模板
 */
export const getStrategyTemplateById = async (id: string): Promise<FacadeResponse<StrategyTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<StrategyTemplate>(`/admin/strategies/templates/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.getStrategyTemplateById(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建策略模板
 */
export const createStrategyTemplate = async (
  payload: CreateStrategyTemplatePayload
): Promise<FacadeResponse<StrategyTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<StrategyTemplate>('/admin/strategies/templates', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.createStrategyTemplate(payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新策略模板
 */
export const updateStrategyTemplate = async (
  id: string,
  payload: UpdateStrategyTemplatePayload
): Promise<FacadeResponse<StrategyTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<StrategyTemplate>(`/admin/strategies/templates/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.updateStrategyTemplate(id, payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 删除策略模板
 */
export const deleteStrategyTemplate = async (id: string): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<any>(`/admin/strategies/templates/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.deleteStrategyTemplate(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取策略实例列表
 */
export const listStrategyInstances = async (
  params: StrategyInstanceQueryParams = {}
): Promise<FacadeResponse<{ data: StrategyInstance[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: StrategyInstance[]
        total: number
        page: number
        pageSize: number
      }>('/admin/strategies/instances', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.listStrategyInstances({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortField,
        sortOrder: params.sortOrder,
        status: params.status,
        templateId: params.templateId,
        symbol: params.symbol,
      })

      const instances = response.data.data
      const total = response.data.total

      return createSuccessResponse(
        {
          data: instances,
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
 * 根据ID获取策略实例
 */
export const getStrategyInstanceById = async (id: string): Promise<FacadeResponse<StrategyInstance>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<StrategyInstance>(`/admin/strategies/instances/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.getStrategyInstanceById(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建策略实例
 */
export const createStrategyInstance = async (
  payload: CreateStrategyInstancePayload
): Promise<FacadeResponse<StrategyInstance>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<StrategyInstance>('/admin/strategies/instances', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.createStrategyInstance(payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新策略实例
 */
export const updateStrategyInstance = async (
  id: string,
  payload: UpdateStrategyInstancePayload
): Promise<FacadeResponse<StrategyInstance>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<StrategyInstance>(`/admin/strategies/instances/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.updateStrategyInstance(id, payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 开始策略实例
 */
export const startStrategyInstance = async (id: string): Promise<FacadeResponse<StrategyInstance>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<StrategyInstance>(`/admin/strategies/instances/${id}/start`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.startStrategyInstance(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 停止策略实例
 */
export const stopStrategyInstance = async (id: string): Promise<FacadeResponse<StrategyInstance>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<StrategyInstance>(`/admin/strategies/instances/${id}/stop`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.stopStrategyInstance(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 删除策略实例
 */
export const deleteStrategyInstance = async (id: string): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<any>(`/admin/strategies/instances/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.deleteStrategyInstance(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取回测结果列表
 */
export const listBacktestResults = async (
  params: BacktestQueryParams = {}
): Promise<FacadeResponse<{ data: BacktestResult[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: BacktestResult[]
        total: number
        page: number
        pageSize: number
      }>('/admin/strategies/backtest-results', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.listBacktestResults({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortField,
        sortOrder: params.sortOrder,
        status: params.status,
        strategyId: params.strategyId,
        symbol: params.symbol,
        startDate: params.startDate,
        endDate: params.endDate,
        search: params.search,
      })

      const results = response.data.data
      const total = response.data.total

      return createSuccessResponse(
        {
          data: results,
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
 * 根据ID获取回测结果
 */
export const getBacktestResultById = async (id: string): Promise<FacadeResponse<BacktestResult>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<BacktestResult>(`/admin/strategies/backtest-results/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.getBacktestResultById(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 运行回测
 */
export const runBacktest = async (payload: RunBacktestPayload): Promise<FacadeResponse<BacktestResult>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<BacktestResult>('/admin/strategies/backtest-run', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.runBacktest(payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 删除回测结果
 */
export const deleteBacktestResult = async (id: string): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<any>(`/admin/strategies/backtest-results/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.deleteBacktestResult(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取策略性能列表
 */
export const listStrategyPerformance = async (
  params: StrategyPerformanceQueryParams = {}
): Promise<FacadeResponse<{ data: StrategyPerformance[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: StrategyPerformance[]
        total: number
        page: number
        pageSize: number
      }>('/admin/strategies/performance', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.listStrategyPerformance({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortField,
        sortOrder: params.sortOrder,
        strategyId: params.strategyId,
        symbol: params.symbol,
        periodStart: params.periodStart,
        periodEnd: params.periodEnd,
      })

      const performance = response.data.data
      const total = response.data.total

      return createSuccessResponse(
        {
          data: performance,
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
 * 根据ID获取策略性能
 */
export const getStrategyPerformanceById = async (id: string): Promise<FacadeResponse<StrategyPerformance>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<StrategyPerformance>(`/admin/strategies/performance/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.getStrategyPerformanceById(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取策略监控列表
 */
export const listStrategyMonitoring = async (
  params: StrategyMonitoringQueryParams = {}
): Promise<FacadeResponse<{ data: StrategyMonitoring[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: StrategyMonitoring[]
        total: number
        page: number
        pageSize: number
      }>('/admin/strategies/monitoring', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.listStrategyMonitoring({
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sortBy: params.sortField,
        sortOrder: params.sortOrder,
        status: params.status,
        alertSeverity: params.alertSeverity,
        symbol: params.symbol,
      })

      const monitoring = response.data.data
      const total = response.data.total

      return createSuccessResponse(
        {
          data: monitoring,
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
 * 获取策略监控详情
 */
export const getStrategyMonitoringById = async (id: string): Promise<FacadeResponse<StrategyMonitoring>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<StrategyMonitoring>(`/admin/strategies/monitoring/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.getStrategyMonitoringById(id)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新策略监控设置
 */
export const updateStrategyMonitoring = async (
  id: string,
  payload: UpdateStrategyMonitoringPayload
): Promise<FacadeResponse<StrategyMonitoring>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<StrategyMonitoring>(`/admin/strategies/monitoring/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式：使用SDK
      const response = await sdk.strategies.updateStrategyMonitoring(id, payload)
      return createSuccessResponse(response.data)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}