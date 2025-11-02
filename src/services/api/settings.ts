import { apiClient } from './AdminApiClient'

export interface GeneralSettings {
  siteName: string
  logo: string
  operationMode: 'normal' | 'maintenance' | 'readonly'
  maintenanceMessage?: string
  cacheStatus: {
    lastRefresh: string
    nextRefresh: string
    status: 'healthy' | 'stale' | 'error'
  }
}

export interface ThemeSettings {
  primaryColor: string
  mode: 'light' | 'dark' | 'auto'
  loginPageText: string
  copyright: string
  logoUrl?: string
  faviconUrl?: string
}

export interface I18nEntry {
  key: string
  en: string
  zh: string
  module: string
  lastUpdated: string
}

export interface I18nImportPayload {
  entries: Array<{
    key: string
    en: string
    zh: string
  }>
  overwrite: boolean
}

export interface FeatureFlag {
  key: string
  name: string
  enabled: boolean
  description: string
  module: string
}

export interface CacheRefreshPayload {
  targets: string[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const settingsApi = {
  // General Settings
  getGeneralSettings() {
    return apiClient.get<ApiResponse<GeneralSettings>>('/admin/settings/general')
  },

  updateGeneralSettings(payload: Partial<GeneralSettings>) {
    return apiClient.put<ApiResponse<GeneralSettings>>('/admin/settings/general', payload)
  },

  // Theme Settings
  getThemeSettings() {
    return apiClient.get<ApiResponse<ThemeSettings>>('/admin/settings/theme')
  },

  updateThemeSettings(payload: Partial<ThemeSettings>) {
    return apiClient.put<ApiResponse<ThemeSettings>>('/admin/settings/theme', payload)
  },

  // I18n Settings
  getI18nEntries(params?: { module?: string; search?: string }) {
    return apiClient.get<ApiResponse<I18nEntry[]>>('/admin/settings/i18n', { params })
  },

  getI18nEntry(key: string) {
    return apiClient.get<ApiResponse<I18nEntry>>(`/admin/settings/i18n/${encodeURIComponent(key)}`)
  },

  updateI18nEntry(key: string, payload: Partial<I18nEntry>) {
    return apiClient.put<ApiResponse<I18nEntry>>(
      `/admin/settings/i18n/${encodeURIComponent(key)}`,
      payload
    )
  },

  createI18nEntry(payload: Omit<I18nEntry, 'lastUpdated'>) {
    return apiClient.post<ApiResponse<I18nEntry>>('/admin/settings/i18n', payload)
  },

  deleteI18nEntry(key: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/settings/i18n/${encodeURIComponent(key)}`)
  },

  bulkImportI18n(payload: I18nImportPayload) {
    return apiClient.post<ApiResponse<{ imported: number; skipped: number }>>(
      '/admin/settings/i18n/bulk-import',
      payload
    )
  },

  exportI18n(params?: { module?: string }) {
    return apiClient.get<Blob>('/admin/settings/i18n/export', {
      params,
      responseType: 'blob',
    })
  },

  scanMissingKeys() {
    return apiClient.post<ApiResponse<{ missingKeys: string[] }>>(
      '/admin/settings/i18n/scan-missing'
    )
  },

  // Feature Flags
  getFeatureFlags() {
    return apiClient.get<ApiResponse<FeatureFlag[]>>('/admin/settings/features')
  },

  updateFeatureFlag(key: string, enabled: boolean) {
    return apiClient.put<ApiResponse<FeatureFlag>>(`/admin/settings/features/${key}`, { enabled })
  },

  // Cache Management
  getCacheStatus() {
    return apiClient.get<
      ApiResponse<{
        caches: Array<{
          name: string
          status: 'healthy' | 'stale' | 'error'
          lastRefresh: string
          size: number
        }>
      }>
    >('/admin/settings/cache/status')
  },

  refreshCache(payload: CacheRefreshPayload) {
    return apiClient.post<ApiResponse<{ refreshed: string[] }>>(
      '/admin/settings/cache/refresh',
      payload
    )
  },

  clearCache(targets: string[]) {
    return apiClient.post<ApiResponse<{ cleared: string[] }>>('/admin/settings/cache/clear', {
      targets,
    })
  },
}
