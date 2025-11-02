import { apiClient } from './AdminApiClient'
import type {
  RiskRule,
  RiskLimit,
  BlacklistEntry,
  Version,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from '@/types/api'

// Risk Rules API
export const riskRulesApi = {
  // Fetch published rules
  getPublished(params?: PaginationParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<RiskRule>>>('/admin/risk/rules/published', {
      params,
    })
  },

  // Fetch draft rules
  getDrafts(params?: PaginationParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<RiskRule>>>('/admin/risk/rules/drafts', {
      params,
    })
  },

  // Get rule by ID
  getById(id: string) {
    return apiClient.get<ApiResponse<RiskRule>>(`/admin/risk/rules/${id}`)
  },

  // Create draft rule
  createDraft(payload: Partial<RiskRule>) {
    return apiClient.post<ApiResponse<RiskRule>>('/admin/risk/rules/drafts', payload)
  },

  // Update draft rule
  updateDraft(id: string, payload: Partial<RiskRule>) {
    return apiClient.put<ApiResponse<RiskRule>>(`/admin/risk/rules/drafts/${id}`, payload)
  },

  // Delete draft rule
  deleteDraft(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/risk/rules/drafts/${id}`)
  },

  // Publish draft rules
  publish(payload: { notes: string; tags?: string[] }) {
    return apiClient.post<ApiResponse<{ version: string }>>('/admin/risk/rules/publish', payload)
  },

  // Get versions
  getVersions() {
    return apiClient.get<ApiResponse<Version[]>>('/admin/risk/rules/versions')
  },

  // Rollback to version
  rollback(versionId: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/risk/rules/rollback/${versionId}`)
  },

  // Get diff between draft and published
  getDiff() {
    return apiClient.get<
      ApiResponse<{ added: RiskRule[]; modified: RiskRule[]; deleted: RiskRule[] }>
    >('/admin/risk/rules/diff')
  },

  // Simulate rule
  simulate(ruleId: string, testData: any) {
    return apiClient.post<ApiResponse<{ matched: boolean; actions: any[] }>>(
      `/admin/risk/rules/${ruleId}/simulate`,
      testData
    )
  },

  // Export rules
  export(format: 'json' | 'csv') {
    return apiClient.get<Blob>('/admin/risk/rules/export', {
      params: { format },
      responseType: 'blob',
    })
  },

  // Import rules
  import(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<{ imported: number; errors: string[] }>>(
      '/admin/risk/rules/import',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
  },
}

// Risk Limits API
export const riskLimitsApi = {
  // Get all limits
  getList(params?: { scope?: string; type?: string } & PaginationParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<RiskLimit>>>('/admin/risk/limits', {
      params,
    })
  },

  // Get limit by ID
  getById(id: string) {
    return apiClient.get<ApiResponse<RiskLimit>>(`/admin/risk/limits/${id}`)
  },

  // Create limit
  create(payload: Partial<RiskLimit>) {
    return apiClient.post<ApiResponse<RiskLimit>>('/admin/risk/limits', payload)
  },

  // Update limit
  update(id: string, payload: Partial<RiskLimit>) {
    return apiClient.put<ApiResponse<RiskLimit>>(`/admin/risk/limits/${id}`, payload)
  },

  // Delete limit
  delete(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/risk/limits/${id}`)
  },

  // Batch update limits
  batchUpdate(payload: { limits: Array<{ id: string; enabled: boolean }> }) {
    return apiClient.post<ApiResponse<void>>('/admin/risk/limits/batch', payload)
  },

  // Export limits
  export(format: 'json' | 'csv') {
    return apiClient.get<Blob>('/admin/risk/limits/export', {
      params: { format },
      responseType: 'blob',
    })
  },
}

// Blacklist API
export const blacklistApi = {
  // Get blacklist entries
  getList(params?: { type?: string; status?: string } & PaginationParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<BlacklistEntry>>>('/admin/risk/blacklist', {
      params,
    })
  },

  // Get entry by ID
  getById(id: string) {
    return apiClient.get<ApiResponse<BlacklistEntry>>(`/admin/risk/blacklist/${id}`)
  },

  // Add to blacklist
  add(payload: Partial<BlacklistEntry>) {
    return apiClient.post<ApiResponse<BlacklistEntry>>('/admin/risk/blacklist', payload)
  },

  // Update blacklist entry
  update(id: string, payload: Partial<BlacklistEntry>) {
    return apiClient.put<ApiResponse<BlacklistEntry>>(`/admin/risk/blacklist/${id}`, payload)
  },

  // Remove from blacklist
  remove(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/risk/blacklist/${id}`)
  },

  // Bulk import
  bulkImport(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<{ imported: number; errors: string[] }>>(
      '/admin/risk/blacklist/bulk-import',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
  },

  // Export blacklist
  export(format: 'json' | 'csv', type?: string) {
    return apiClient.get<Blob>('/admin/risk/blacklist/export', {
      params: { format, type },
      responseType: 'blob',
    })
  },

  // Check if value is blacklisted
  check(type: string, value: string) {
    return apiClient.post<ApiResponse<{ blacklisted: boolean; entry?: BlacklistEntry }>>(
      '/admin/risk/blacklist/check',
      {
        type,
        value,
      }
    )
  },
}
