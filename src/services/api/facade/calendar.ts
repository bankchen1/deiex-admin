/**
 * Calendar Facade - 日历配置统一出入口
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
  FundingRule,
  MaintenanceWindow,
  Announcement,
  Version,
  FundingRuleQueryParams,
  MaintenanceWindowQueryParams,
  AnnouncementQueryParams,
  VersionQueryParams,
  CreateFundingRulePayload,
  UpdateFundingRulePayload,
  CreateMaintenanceWindowPayload,
  UpdateMaintenanceWindowPayload,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  PublishPayload,
  ImportPayload,
  ExportParams
} from '@/contracts/calendar'

/**
 * 获取资金费率规则列表
 */
export const listFundingRules = async (
  params: FundingRuleQueryParams = {}
): Promise<FacadeResponse<{ data: FundingRule[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: FundingRule[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/calendar/funding-rules', { params })
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
 * 根据ID获取资金费率规则
 */
export const getFundingRuleById = async (id: string): Promise<FacadeResponse<FundingRule>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<FundingRule>(`/admin/config/calendar/funding-rules/${id}`)
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
 * 创建资金费率规则
 */
export const createFundingRule = async (
  payload: CreateFundingRulePayload
): Promise<FacadeResponse<FundingRule>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<FundingRule>('/admin/config/calendar/funding-rules', payload)
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
 * 更新资金费率规则
 */
export const updateFundingRule = async (
  id: string,
  payload: UpdateFundingRulePayload
): Promise<FacadeResponse<FundingRule>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<FundingRule>(`/admin/config/calendar/funding-rules/${id}`, payload)
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
 * 删除资金费率规则
 */
export const deleteFundingRule = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/calendar/funding-rules/${id}`)
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
 * 获取维护窗口列表
 */
export const listMaintenanceWindows = async (
  params: MaintenanceWindowQueryParams = {}
): Promise<FacadeResponse<{ data: MaintenanceWindow[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: MaintenanceWindow[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/calendar/maintenance-windows', { params })
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
 * 根据ID获取维护窗口
 */
export const getMaintenanceWindowById = async (id: string): Promise<FacadeResponse<MaintenanceWindow>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<MaintenanceWindow>(`/admin/config/calendar/maintenance-windows/${id}`)
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
 * 创建维护窗口
 */
export const createMaintenanceWindow = async (
  payload: CreateMaintenanceWindowPayload
): Promise<FacadeResponse<MaintenanceWindow>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<MaintenanceWindow>('/admin/config/calendar/maintenance-windows', payload)
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
 * 更新维护窗口
 */
export const updateMaintenanceWindow = async (
  id: string,
  payload: UpdateMaintenanceWindowPayload
): Promise<FacadeResponse<MaintenanceWindow>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<MaintenanceWindow>(`/admin/config/calendar/maintenance-windows/${id}`, payload)
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
 * 删除维护窗口
 */
export const deleteMaintenanceWindow = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/calendar/maintenance-windows/${id}`)
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
 * 获取公告列表
 */
export const listAnnouncements = async (
  params: AnnouncementQueryParams = {}
): Promise<FacadeResponse<{ data: Announcement[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Announcement[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/calendar/announcements', { params })
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
 * 根据ID获取公告
 */
export const getAnnouncementById = async (id: string): Promise<FacadeResponse<Announcement>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Announcement>(`/admin/config/calendar/announcements/${id}`)
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
 * 创建公告
 */
export const createAnnouncement = async (
  payload: CreateAnnouncementPayload
): Promise<FacadeResponse<Announcement>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Announcement>('/admin/config/calendar/announcements', payload)
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
 * 更新公告
 */
export const updateAnnouncement = async (
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<FacadeResponse<Announcement>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<Announcement>(`/admin/config/calendar/announcements/${id}`, payload)
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
 * 发布公告
 */
export const publishAnnouncement = async (
  id: string,
  payload: PublishPayload = {}
): Promise<FacadeResponse<Announcement>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Announcement>(`/admin/config/calendar/announcements/${id}/publish`, payload)
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
 * 删除公告
 */
export const deleteAnnouncement = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/config/calendar/announcements/${id}`)
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
export const getVersionHistory = async (
  params: VersionQueryParams = {}
): Promise<FacadeResponse<{ data: Version[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Version[]
        total: number
        page: number
        pageSize: number
      }>('/admin/config/calendar/versions', { params })
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
 * 导出日历配置数据
 */
export const exportCalendarConfig = async (
  params: ExportParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      // In mock mode, return a simulated CSV blob response
      const dataStr = 'id,symbol,period,nextFundingTime,calculationRule,enabled,status,version,createdAt,updatedAt\n'
      const blob = new Blob([dataStr], { type: 'text/csv;charset=utf-8;' })
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
 * 导入日历配置数据
 */
export const importCalendarConfig = async (
  payload: ImportPayload
): Promise<FacadeResponse<Version>> => {
  try {
    if (isMockMode()) {
      // In mock mode, simulate import
      const newVersion: Version = {
        id: `version_${Date.now()}`,
        version: `v${Math.floor(Date.now()/100000)}.${Math.floor(Math.random()*10)},.${Math.floor(Math.random()*10)}`,
        createdAt: new Date().toISOString(),
        createdBy: 'mock_admin',
        notes: 'Imported via mock upload',
        tags: ['import']
      }
      return createSuccessResponse(newVersion)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}