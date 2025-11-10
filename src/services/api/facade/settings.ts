import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type { FacadeResponse } from '../_types'
import { createSuccessResponse, createErrorResponse, isMockMode } from '../_types'
import type {
  GeneralSettings,
  ThemeSettings,
  I18nEntry,
  FeatureFlag,
  CacheStatus,
} from '@/contracts/settings'

// General Settings
export const getGeneralSettings = async (): Promise<FacadeResponse<GeneralSettings>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<GeneralSettings>('/admin/settings/general')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateGeneralSettings = async (
  payload: Partial<GeneralSettings>
): Promise<FacadeResponse<GeneralSettings>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePut<GeneralSettings>('/admin/settings/general', payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Theme Settings
export const getThemeSettings = async (): Promise<FacadeResponse<ThemeSettings>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<ThemeSettings>('/admin/settings/theme')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateThemeSettings = async (
  payload: Partial<ThemeSettings>
): Promise<FacadeResponse<ThemeSettings>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePut<ThemeSettings>('/admin/settings/theme', payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// I18n
export const getI18nEntries = async (params?: {
  module?: string
  search?: string
}): Promise<FacadeResponse<I18nEntry[]>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<I18nEntry[]>('/admin/settings/i18n', { params })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getI18nEntry = async (key: string): Promise<FacadeResponse<I18nEntry>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<I18nEntry>(`/admin/settings/i18n/${key}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateI18nEntry = async (
  key: string,
  payload: Partial<I18nEntry>
): Promise<FacadeResponse<I18nEntry>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePut<I18nEntry>(`/admin/settings/i18n/${key}`, payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createI18nEntry = async (
  payload: Omit<I18nEntry, 'lastUpdated'>
): Promise<FacadeResponse<I18nEntry>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<I18nEntry>('/admin/settings/i18n', payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteI18nEntry = async (key: string): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeDelete<void>(`/admin/settings/i18n/${key}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const bulkImportI18n = async (payload: {
  entries: Array<{ key: string; en: string; zh: string }>
  overwrite: boolean
}): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>('/admin/settings/i18n/bulk-import', payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const exportI18n = async (params?: { module?: string }): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<Blob>('/admin/settings/i18n/export', {
      params,
      responseType: 'blob',
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const scanMissingKeys = async (): Promise<FacadeResponse<{ missingKeys: string[] }>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<{ missingKeys: string[] }>('/admin/settings/i18n/scan-missing')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Feature Flags
export const getFeatureFlags = async (): Promise<FacadeResponse<FeatureFlag[]>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<FeatureFlag[]>('/admin/settings/feature-flags')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateFeatureFlag = async (
  key: string,
  enabled: boolean
): Promise<FacadeResponse<FeatureFlag>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePut<FeatureFlag>(`/admin/settings/feature-flags/${key}`, { enabled })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Cache Management
export const getCacheStatus = async (): Promise<FacadeResponse<CacheStatus>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<CacheStatus>('/admin/settings/cache/status')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const refreshCache = async (targets: string[]): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>('/admin/settings/cache/refresh', { targets })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const clearCache = async (targets: string[]): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>('/admin/settings/cache/clear', { targets })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
