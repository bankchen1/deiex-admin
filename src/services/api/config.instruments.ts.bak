import { apiClient } from './AdminApiClient'
import type {
  InstrumentQueryParams,
  InstrumentCreatePayload,
  InstrumentUpdatePayload,
  PublishPayload,
  ApiResponse,
  PaginatedResponse,
  BatchResult,
  ImportPayload,
  ExportParams,
} from '@/types/api'
import type { Instrument, Version } from '@/types/models'

export const instrumentsApi = {
  // Fetch published instruments
  getPublished(params?: InstrumentQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<Instrument>>>(
      '/admin/config/instruments/published',
      { params }
    )
  },

  // Fetch draft instruments
  getDrafts(params?: InstrumentQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<Instrument>>>(
      '/admin/config/instruments/drafts',
      { params }
    )
  },

  // Fetch single instrument by symbol
  getById(symbol: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/instruments/drafts/${symbol}`
      : `/admin/config/instruments/published/${symbol}`
    return apiClient.get<ApiResponse<Instrument>>(endpoint)
  },

  // Create draft instrument
  createDraft(payload: InstrumentCreatePayload) {
    return apiClient.post<ApiResponse<Instrument>>('/admin/config/instruments/drafts', payload)
  },

  // Update draft instrument
  updateDraft(symbol: string, payload: InstrumentUpdatePayload) {
    return apiClient.put<ApiResponse<Instrument>>(
      `/admin/config/instruments/drafts/${symbol}`,
      payload
    )
  },

  // Delete draft instrument
  deleteDraft(symbol: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/instruments/drafts/${symbol}`)
  },

  // Batch update (for inline editing)
  batchUpdate(updates: Array<{ symbol: string; updates: Partial<Instrument> }>) {
    return apiClient.post<ApiResponse<BatchResult>>(
      '/admin/config/instruments/drafts/batch-update',
      { updates }
    )
  },

  // Publish drafts
  publish(payload: PublishPayload) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      '/admin/config/instruments/publish',
      payload
    )
  },

  // Get version history
  getVersions() {
    return apiClient.get<ApiResponse<Version[]>>('/admin/config/instruments/versions')
  },

  // Get specific version
  getVersion(versionId: string) {
    return apiClient.get<ApiResponse<Instrument[]>>(
      `/admin/config/instruments/versions/${versionId}`
    )
  },

  // Rollback to specific version
  rollback(versionId: string, notes?: string) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      `/admin/config/instruments/rollback/${versionId}`,
      { notes }
    )
  },

  // Get diff between draft and published
  getDiff() {
    return apiClient.get<ApiResponse<any>>('/admin/config/instruments/diff')
  },

  // Export instruments
  export(params?: ExportParams) {
    return apiClient.get<Blob>('/admin/config/instruments/export', {
      params,
      responseType: 'blob',
    })
  },

  // Import instruments
  import(payload: ImportPayload) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/instruments/import', payload)
  },

  // Validate import data
  validateImport(payload: ImportPayload) {
    return apiClient.post<ApiResponse<{ valid: boolean; errors: any[] }>>(
      '/admin/config/instruments/validate-import',
      payload
    )
  },

  // Get impact estimation for publish
  getImpactEstimation() {
    return apiClient.get<
      ApiResponse<{
        affectedUsers: number
        affectedOrders: number
        warnings: string[]
      }>
    >('/admin/config/instruments/impact-estimation')
  },

  // Batch operations
  batchShow(symbols: string[]) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/instruments/batch-show', {
      symbols,
    })
  },

  batchHide(symbols: string[]) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/instruments/batch-hide', {
      symbols,
    })
  },
}
