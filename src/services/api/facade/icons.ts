/**
 * Icons Facade - 图标管理统一出入口
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
  IconAsset,
  IconMapping,
  Version,
  IconAssetQueryParams,
  IconMappingQueryParams,
  CreateIconAssetPayload,
  UpdateIconAssetPayload,
  CreateIconMappingPayload,
  UpdateIconMappingPayload,
  BulkUploadPayload,
  ValidateIconPayload,
  PublishIconPayload,
  ValidationResult,
  BulkUploadResult
} from '@/contracts/icons'

/**
 * 获取图标资源列表
 */
export const listIconAssets = async (
  params: IconAssetQueryParams = {}
): Promise<FacadeResponse<{ data: IconAsset[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: IconAsset[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/icons/assets', { params })
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
 * 根据ID获取图标资源
 */
export const getIconAssetById = async (id: string): Promise<FacadeResponse<IconAsset>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<IconAsset>(`/admin/config/icons/assets/${id}`)
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
 * 创建图标资源
 */
export const createIconAsset = async (
  payload: CreateIconAssetPayload
): Promise<FacadeResponse<IconAsset>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<IconAsset>('/admin/config/icons/assets', payload)
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
 * 更新图标资源
 */
export const updateIconAsset = async (
  id: string,
  payload: UpdateIconAssetPayload
): Promise<FacadeResponse<IconAsset>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<IconAsset>(`/admin/config/icons/assets/${id}`, payload)
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
 * 删除图标资源
 */
export const deleteIconAsset = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/icons/assets/${id}`)
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
 * 获取图标映射列表
 */
export const listIconMappings = async (
  params: IconMappingQueryParams = {}
): Promise<FacadeResponse<{ data: IconMapping[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: IconMapping[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/icons/mappings', { params })
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
 * 根据ID获取图标映射
 */
export const getIconMappingById = async (id: string): Promise<FacadeResponse<IconMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<IconMapping>(`/admin/config/icons/mappings/${id}`)
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
 * 创建图标映射
 */
export const createIconMapping = async (
  payload: CreateIconMappingPayload
): Promise<FacadeResponse<IconMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<IconMapping>('/admin/config/icons/mappings', payload)
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
 * 更新图标映射
 */
export const updateIconMapping = async (
  id: string,
  payload: UpdateIconMappingPayload
): Promise<FacadeResponse<IconMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<IconMapping>(`/admin/config/icons/mappings/${id}`, payload)
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
 * 删除图标映射
 */
export const deleteIconMapping = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/icons/mappings/${id}`)
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
 * 批量上传图标
 */
export const bulkUploadIcons = async (
  payload: BulkUploadPayload
): Promise<FacadeResponse<BulkUploadResult>> => {
  try {
    if (isMockMode()) {
      // Mock response for bulk upload
      const result: BulkUploadResult = {
        success: payload.files.length,
        failed: 0,
        errors: [],
        createdAssets: []
      };
      
      // Create mock data for uploaded icons
      for (let i = 0; i < payload.files.length; i++) {
        result.createdAssets.push({
          id: `icon_${Date.now()}_${i}`,
          name: payload.files[i].name,
          category: payload.category,
          type: payload.files[i].name.split('.').pop() as any || 'svg',
          size: `${payload.files[i].size} bytes`,
          width: 24,
          height: 24,
          tags: payload.tags,
          version: '1.0.0',
          status: 'draft',
          source: 'upload',
          uploadDate: new Date().toISOString(),
          uploader: 'current_user',
          fileUrl: `/assets/icons/${payload.files[i].name}`,
          thumbnailUrl: `/assets/icons/thumb/${payload.files[i].name}`,
        })
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
 * 验证图标文件
 */
export const validateIcon = async (payload: ValidateIconPayload): Promise<FacadeResponse<ValidationResult>> => {
  try {
    if (isMockMode()) {
      // Mock validation response
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
        metadata: {
          size: payload.file.size,
          mimeType: payload.file.type,
          dimensions: { width: 24, height: 24 },
          accessibility: {
            hasAltText: true,
            hasTitle: true
          }
        }
      }
      
      // Simple validation rules
      if (!['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(payload.file.type)) {
        result.valid = false
        result.errors.push('Unsupported file type')
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
 * 发布图标资源
 */
export const publishIconAsset = async (
  id: string,
  payload: PublishIconPayload = { id }
): Promise<FacadeResponse<IconAsset>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<IconAsset>(`/admin/config/icons/assets/${id}/publish`, payload)
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
 * 导出图标资源
 */
export const exportIcons = async (params: any): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // Mock export response
      const csvContent = "id,name,category,type,size,tags,status,createdAt\n" +
        "icon_001,home-icon,navigation,svg,2.3KB,\"house,home\",published,2024-01-01T00:00:00Z\n" +
        "icon_002,user-profile,user,png,4.5KB,\"profile,user\",published,2024-01-02T00:00:00Z"
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
 * 替换图标资源
 */
export const replaceIconAsset = async (
  id: string,
  payload: { file: File }
): Promise<FacadeResponse<IconAsset>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<IconAsset>(`/admin/config/icons/assets/${id}/replace`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}