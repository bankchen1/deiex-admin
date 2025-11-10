/**
 * Mappings Facade - 映射配置统一出入口
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
  NavToApiMapping,
  RouteRedirect,
  PageApiRelation,
  MappingValidationResult,
  BulkSyncPayload,
  NavMappingQueryParams,
  RedirectQueryParams,
  PageApiRelationQueryParams,
} from '@/contracts/mappings'

/**
 * 导航映射查询参数
 */
export interface NavMappingQueryParams extends PaginationParams {
  status?: 'active' | 'deprecated'
  navKey?: string
  search?: string
}

/**
 * 重定向查询参数
 */
export interface RedirectQueryParams extends PaginationParams {
  status?: 'active' | 'inactive'
  search?: string
}

/**
 * 页面API关系查询参数
 */
export interface PageApiRelationQueryParams extends PaginationParams {
  status?: 'active' | 'broken'
  search?: string
}

/**
 * 获取导航映射列表
 */
export const listNavMappings = async (
  params: NavMappingQueryParams = {}
): Promise<
  FacadeResponse<{ data: NavToApiMapping[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: NavToApiMapping[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/nav-mappings', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 根据ID获取导航映射
 */
export const getNavMappingById = async (id: string): Promise<FacadeResponse<NavToApiMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<NavToApiMapping>(`/admin/config/nav-mappings/${id}`)
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
 * 创建导航映射
 */
export const createNavMapping = async (
  payload: Omit<NavToApiMapping, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FacadeResponse<NavToApiMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<NavToApiMapping>('/admin/config/nav-mappings', payload)
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
 * 更新导航映射
 */
export const updateNavMapping = async (
  id: string,
  payload: Partial<NavToApiMapping>
): Promise<FacadeResponse<NavToApiMapping>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<NavToApiMapping>(`/admin/config/nav-mappings/${id}`, payload)
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
 * 删除导航映射
 */
export const deleteNavMapping = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/nav-mappings/${id}`)
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
 * 验证导航映射
 */
export const validateNavMappings = async (): Promise<FacadeResponse<MappingValidationResult>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MappingValidationResult>('/admin/config/nav-mappings/validate')
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
 * 批量同步导航映射
 */
export const bulkSyncNavMappings = async (
  payload: BulkSyncPayload
): Promise<FacadeResponse<{ success: number; failed: number; errors?: any[] }>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<{ success: number; failed: number; errors?: any[] }>(
        '/admin/config/nav-mappings/bulk-sync',
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
 * 获取路由重定向
 */
export const listRouteRedirects = async (
  params: RedirectQueryParams = {}
): Promise<
  FacadeResponse<{ data: RouteRedirect[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: RouteRedirect[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/redirects', { params })
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
 * 根据ID获取重定向
 */
export const getRedirectById = async (id: string): Promise<FacadeResponse<RouteRedirect>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<RouteRedirect>(`/admin/config/redirects/${id}`)
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
 * 创建重定向
 */
export const createRedirect = async (
  payload: Omit<RouteRedirect, 'id' | 'hitCount' | 'createdAt'>
): Promise<FacadeResponse<RouteRedirect>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<RouteRedirect>('/admin/config/redirects', payload)
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
 * 更新重定向
 */
export const updateRedirect = async (
  id: string,
  payload: Partial<RouteRedirect>
): Promise<FacadeResponse<RouteRedirect>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<RouteRedirect>(`/admin/config/redirects/${id}`, payload)
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
 * 删除重定向
 */
export const deleteRedirect = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/redirects/${id}`)
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
 * 获取重定向图谱
 */
export const getRedirectGraph = async (): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/redirects/graph')
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
 * 验证重定向
 */
export const validateRedirects = async (): Promise<FacadeResponse<MappingValidationResult>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MappingValidationResult>('/admin/config/redirects/validate')
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
 * 获取页面API关系
 */
export const getPageApiRelations = async (params?: {
  status?: string
  search?: string
}): Promise<FacadeResponse<{ data: PageApiRelation[]; total: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{ data: PageApiRelation[]; total: number }>(
        '/admin/config/page-api-relations',
        { params }
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
 * 获取指定页面的API关系
 */
export const getPageApiRelation = async (
  pageKey: string
): Promise<FacadeResponse<PageApiRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<PageApiRelation>(`/admin/config/page-api-relations/${pageKey}`)
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
 * 更新页面API关系
 */
export const updatePageApiRelation = async (
  pageKey: string,
  payload: Partial<PageApiRelation>
): Promise<FacadeResponse<PageApiRelation>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<PageApiRelation>(
        `/admin/config/page-api-relations/${pageKey}`,
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
 * 扫描页面API关系
 */
export const scanPageApiRelations = async (): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<any>('/admin/config/page-api-relations/scan')
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
 * 验证页面API关系
 */
export const validatePageApiRelations = async (): Promise<
  FacadeResponse<MappingValidationResult>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MappingValidationResult>(
        '/admin/config/page-api-relations/validate'
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
 * 导出映射配置
 */
export const exportMappings = async (
  type: 'nav-to-api' | 'redirects' | 'page-to-api'
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return an empty blob
      const blob = new Blob(
        [JSON.stringify({ exported: type, timestamp: new Date().toISOString() })],
        {
          type: 'application/json',
        }
      )
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
 * 导入映射配置
 */
export const importMappings = async (
  type: 'nav-to-api' | 'redirects' | 'page-to-api',
  file: File
): Promise<FacadeResponse<any>> => {
  try {
    if (isMockMode()) {
      // In mock mode, simulate import
      const response = await safePost(`/admin/config/mappings/import`, {
        type,
        fileName: file.name,
        fileSize: file.size,
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
