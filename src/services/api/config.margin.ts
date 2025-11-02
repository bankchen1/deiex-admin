import { apiClient } from './AdminApiClient'
import type {
  MarginQueryParams,
  MarginTemplateCreatePayload,
  MarginTemplateUpdatePayload,
  MarginBindingPayload,
  PublishPayload,
  ApiResponse,
  PaginatedResponse,
  BatchResult,
  ExportParams,
  ImportPayload,
} from '@/types/api'
import type { MarginTemplate, MarginBinding, Version } from '@/types/models'

export const marginApi = {
  // Fetch published margin templates
  getPublishedTemplates(params?: MarginQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<MarginTemplate>>>(
      '/admin/config/margin/templates/published',
      { params }
    )
  },

  // Fetch draft margin templates
  getDraftTemplates(params?: MarginQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<MarginTemplate>>>(
      '/admin/config/margin/templates/drafts',
      { params }
    )
  },

  // Fetch single template by ID
  getTemplateById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/margin/templates/drafts/${id}`
      : `/admin/config/margin/templates/published/${id}`
    return apiClient.get<ApiResponse<MarginTemplate>>(endpoint)
  },

  // Create draft template
  createDraftTemplate(payload: MarginTemplateCreatePayload) {
    return apiClient.post<ApiResponse<MarginTemplate>>(
      '/admin/config/margin/templates/drafts',
      payload
    )
  },

  // Update draft template
  updateDraftTemplate(id: string, payload: MarginTemplateUpdatePayload) {
    return apiClient.put<ApiResponse<MarginTemplate>>(
      `/admin/config/margin/templates/drafts/${id}`,
      payload
    )
  },

  // Delete draft template
  deleteDraftTemplate(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/margin/templates/drafts/${id}`)
  },

  // Fetch published bindings
  getPublishedBindings(params?: MarginQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<MarginBinding>>>(
      '/admin/config/margin/bindings/published',
      { params }
    )
  },

  // Fetch draft bindings
  getDraftBindings(params?: MarginQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<MarginBinding>>>(
      '/admin/config/margin/bindings/drafts',
      { params }
    )
  },

  // Create/update draft binding
  updateDraftBinding(payload: MarginBindingPayload) {
    return apiClient.post<ApiResponse<MarginBinding>>(
      '/admin/config/margin/bindings/drafts',
      payload
    )
  },

  // Batch bind symbols to template
  batchBind(templateId: string, symbols: string[]) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/margin/bindings/batch-bind', {
      templateId,
      symbols,
    })
  },

  // Unbind symbols
  batchUnbind(symbols: string[]) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/margin/bindings/batch-unbind', {
      symbols,
    })
  },

  // Publish drafts
  publish(payload: PublishPayload) {
    return apiClient.post<ApiResponse<{ version: string }>>('/admin/config/margin/publish', payload)
  },

  // Get version history
  getVersions() {
    return apiClient.get<ApiResponse<Version[]>>('/admin/config/margin/versions')
  },

  // Get specific version
  getVersion(versionId: string) {
    return apiClient.get<
      ApiResponse<{
        templates: MarginTemplate[]
        bindings: MarginBinding[]
      }>
    >(`/admin/config/margin/versions/${versionId}`)
  },

  // Rollback to specific version
  rollback(versionId: string, notes?: string) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      `/admin/config/margin/rollback/${versionId}`,
      { notes }
    )
  },

  // Get diff between draft and published
  getDiff() {
    return apiClient.get<
      ApiResponse<{
        templates: {
          added: MarginTemplate[]
          modified: MarginTemplate[]
          deleted: MarginTemplate[]
        }
        bindings: {
          added: MarginBinding[]
          modified: MarginBinding[]
          deleted: MarginBinding[]
        }
      }>
    >('/admin/config/margin/diff')
  },

  // Get impact estimation for binding changes
  getImpactEstimation() {
    return apiClient.get<
      ApiResponse<{
        affectedSymbols: string[]
        affectedPositions: number
        affectedUsers: number
        warnings: string[]
      }>
    >('/admin/config/margin/impact-estimation')
  },

  // Export margin configuration
  export(params?: ExportParams) {
    return apiClient.get<Blob>('/admin/config/margin/export', {
      params,
      responseType: 'blob',
    })
  },

  // Import margin configuration
  import(payload: ImportPayload) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/margin/import', payload)
  },

  // Validate import data
  validateImport(payload: ImportPayload) {
    return apiClient.post<ApiResponse<{ valid: boolean; errors: any[] }>>(
      '/admin/config/margin/validate-import',
      payload
    )
  },

  // Calculate margin requirements
  calculateMargin(params: { templateId: string; notionalValue: string; leverage: number }) {
    return apiClient.post<
      ApiResponse<{
        initialMargin: string
        maintenanceMargin: string
        liquidationPrice: string
        maxLeverage: number
        tier: {
          notionalFrom: string
          notionalTo: string
          initialMarginRate: number
          maintenanceMarginRate: number
        }
      }>
    >('/admin/config/margin/calculate', params)
  },
}
