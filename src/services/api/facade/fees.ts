/**
 * Fees Facade - 费率管理统一出入口
 * 
 * 职责：
 * 1. 根据环境切换Mock/Real数据源
 * 2. 统一返回格式（FacadeResponse）
 * 3. 不暴露底层实现细节给UI层
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type { 
  TradingFeeTemplate,
  WithdrawalFeeTemplate,
  Version,
  TradingFeeQueryParams,
  WithdrawalFeeQueryParams,
  VersionQueryParams,
  CreateTradingFeeTemplatePayload,
  UpdateTradingFeeTemplatePayload,
  CreateWithdrawalFeeTemplatePayload,
  UpdateWithdrawalFeeTemplatePayload,
  PublishPayload,
  ImportPayload,
  ExportParams,
  ValidateImportPayload,
  CalculateFeeParams,
  FeeCalculationResult,
  ValidateConsistencyResult
} from '@/contracts/fees'

/**
 * 获取交易费模板列表
 */
export const listTradingFeeTemplates = async (
  params: TradingFeeQueryParams = {}
): Promise<FacadeResponse<{ data: TradingFeeTemplate[]; total: number; page: number; pageSize: number }>> => {
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
 * 根据ID获取交易费模板
 */
export const getTradingFeeTemplateById = async (
  id: string,
  isDraft = false
): Promise<FacadeResponse<TradingFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const endpoint = isDraft 
        ? `/admin/config/fees/trading/draft/${id}`
        : `/admin/config/fees/trading/${id}`
      const response = await safeGet<TradingFeeTemplate>(endpoint)
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
 * 创建交易费模板草稿
 */
export const createTradingFeeTemplateDraft = async (
  payload: CreateTradingFeeTemplatePayload
): Promise<FacadeResponse<TradingFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<TradingFeeTemplate>('/admin/config/fees/trading/draft', payload)
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
 * 更新交易费模板草稿
 */
export const updateTradingFeeTemplateDraft = async (
  id: string,
  payload: UpdateTradingFeeTemplatePayload
): Promise<FacadeResponse<TradingFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<TradingFeeTemplate>(`/admin/config/fees/trading/draft/${id}`, payload)
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
 * 删除交易费模板草稿
 */
export const deleteTradingFeeTemplateDraft = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/fees/trading/draft/${id}`)
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
 * 获取提现费模板列表
 */
export const listWithdrawalFeeTemplates = async (
  params: WithdrawalFeeQueryParams = {}
): Promise<FacadeResponse<{ data: WithdrawalFeeTemplate[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: WithdrawalFeeTemplate[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/fees/withdrawal', { params })
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
 * 根据ID获取提现费模板
 */
export const getWithdrawalFeeTemplateById = async (
  id: string,
  isDraft = false
): Promise<FacadeResponse<WithdrawalFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const endpoint = isDraft 
        ? `/admin/config/fees/withdrawal/draft/${id}`
        : `/admin/config/fees/withdrawal/${id}`
      const response = await safeGet<WithdrawalFeeTemplate>(endpoint)
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
 * 创建提现费模板草稿
 */
export const createWithdrawalFeeTemplateDraft = async (
  payload: CreateWithdrawalFeeTemplatePayload
): Promise<FacadeResponse<WithdrawalFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<WithdrawalFeeTemplate>('/admin/config/fees/withdrawal/draft', payload)
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
 * 更新提现费模板草稿
 */
export const updateWithdrawalFeeTemplateDraft = async (
  id: string,
  payload: UpdateWithdrawalFeeTemplatePayload
): Promise<FacadeResponse<WithdrawalFeeTemplate>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<WithdrawalFeeTemplate>(`/admin/config/fees/withdrawal/draft/${id}`, payload)
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
 * 删除提现费模板草稿
 */
export const deleteWithdrawalFeeTemplateDraft = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/fees/withdrawal/draft/${id}`)
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
 * 发布费用配置
 */
export const publishFees = async (payload: PublishPayload): Promise<FacadeResponse<Version>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Version>('/admin/config/fees/publish', payload)
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
 * 获取版本历史
 */
export const getFeeVersions = async (
  params: VersionQueryParams = {}
): Promise<FacadeResponse<{ data: Version[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{ data: Version[]; total: number; page: number; pageSize: number }>(
        '/admin/config/fees/versions',
        { params }
      )
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
 * 根据版本ID获取详情
 */
export const getFeeVersionById = async (versionId: string): Promise<FacadeResponse<Version>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Version>(`/admin/config/fees/versions/${versionId}`)
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
 * 回滚到指定版本
 */
export const rollbackFeeVersion = async (
  versionId: string,
  notes: string
): Promise<FacadeResponse<Version>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Version>(`/admin/config/fees/versions/${versionId}/rollback`, { notes })
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
 * 获取版本差异
 */
export const getFeeVersionDiff = async (): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/fees/versions/diff')
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
 * 导出费用配置
 */
export const exportFees = async (params: ExportParams): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // Generate mock CSV data
      const csvContent = "id,vipLevel,makerRate,takerRate,status,version,createdAt,updatedAt\n" +
        "1,0,0.001,0.001,draft,v1.0.0,2024-01-01T00:00:00Z,2024-01-01T00:00:00Z\n" +
        "2,1,0.0008,0.0008,published,v1.0.0,2024-01-01T00:00:00Z,2024-01-01T00:00:00Z"
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
 * 导入费用配置
 */
export const importFees = async (payload: ImportPayload): Promise<FacadeResponse<Version>> => {
  try {
    if (isMockMode()) {
      // Mock import response
      const mockVersion: Version = {
        id: `version_${Date.now()}`,
        version: `v${Math.floor(Date.now()/100000)}.${Math.floor(Math.random()*10)}.0`,
        createdAt: new Date().toISOString(),
        createdBy: 'mock_admin',
        notes: 'Imported via mock upload',
        tags: ['import']
      }
      return createSuccessResponse(mockVersion)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 验证导入文件
 */
export const validateFeeImport = async (payload: ValidateImportPayload): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // Mock validation response
      return createSuccessResponse({
        valid: true,
        errors: [],
        summary: {
          totalRecords: 10,
          validRecords: 10,
          invalidRecords: 0
        }
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
 * 计算费用
 */
export const calculateFee = async (params: CalculateFeeParams): Promise<FacadeResponse<FeeCalculationResult>> => {
  try {
    if (isMockMode()) {
      // Mock calculation response
      const result: FeeCalculationResult = {
        type: params.type,
        vipLevel: params.vipLevel,
        makerFee: params.amount ? (parseFloat(params.amount) * 0.001).toString() : '0',
        takerFee: params.amount ? (parseFloat(params.amount) * 0.001).toString() : '0',
        withdrawalFee: params.type === 'withdrawal' ? '1' : undefined,
        effectiveRate: 0.001,
        breakdown: {
          fixedFee: params.type === 'withdrawal' ? '0.5' : undefined,
          percentageFee: params.type === 'trading' ? '0.1' : undefined,
          totalFee: '1'
        }
      }
      return createSuccessResponse(result)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 验证费用配置一致性
 */
export const validateFeeConsistency = async (): Promise<FacadeResponse<ValidateConsistencyResult>> => {
  try {
    if (isMockMode()) {
      // Mock validation response
      return createSuccessResponse({
        isValid: true,
        issues: []
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}