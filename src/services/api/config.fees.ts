import { apiClient } from './AdminApiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  BatchResult,
  ExportParams,
  ImportPayload,
  PublishPayload,
} from '@/types/api'
import type {
  TradingFeeTemplate,
  WithdrawalFeeTemplate,
  Version,
  FeeQueryParams,
  TradingFeeCreatePayload,
  TradingFeeUpdatePayload,
  WithdrawalFeeCreatePayload,
  WithdrawalFeeUpdatePayload,
  FeeCalculationParams,
  FeeCalculationResult,
} from '@/types/models'

export const feesApi = {
  // Trading Fees - Published
  getPublishedTradingFees(params?: FeeQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<TradingFeeTemplate>>>(
      '/admin/config/fees/trading/published',
      { params }
    )
  },

  // Trading Fees - Drafts
  getDraftTradingFees(params?: FeeQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<TradingFeeTemplate>>>(
      '/admin/config/fees/trading/drafts',
      { params }
    )
  },

  // Get single trading fee by ID
  getTradingFeeById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/fees/trading/drafts/${id}`
      : `/admin/config/fees/trading/published/${id}`
    return apiClient.get<ApiResponse<TradingFeeTemplate>>(endpoint)
  },

  // Create draft trading fee
  createDraftTradingFee(payload: TradingFeeCreatePayload) {
    return apiClient.post<ApiResponse<TradingFeeTemplate>>(
      '/admin/config/fees/trading/drafts',
      payload
    )
  },

  // Update draft trading fee
  updateDraftTradingFee(id: string, payload: TradingFeeUpdatePayload) {
    return apiClient.put<ApiResponse<TradingFeeTemplate>>(
      `/admin/config/fees/trading/drafts/${id}`,
      payload
    )
  },

  // Delete draft trading fee
  deleteDraftTradingFee(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/fees/trading/drafts/${id}`)
  },

  // Withdrawal Fees - Published
  getPublishedWithdrawalFees(params?: FeeQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<WithdrawalFeeTemplate>>>(
      '/admin/config/fees/withdrawal/published',
      { params }
    )
  },

  // Withdrawal Fees - Drafts
  getDraftWithdrawalFees(params?: FeeQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<WithdrawalFeeTemplate>>>(
      '/admin/config/fees/withdrawal/drafts',
      { params }
    )
  },

  // Get single withdrawal fee by ID
  getWithdrawalFeeById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/fees/withdrawal/drafts/${id}`
      : `/admin/config/fees/withdrawal/published/${id}`
    return apiClient.get<ApiResponse<WithdrawalFeeTemplate>>(endpoint)
  },

  // Create draft withdrawal fee
  createDraftWithdrawalFee(payload: WithdrawalFeeCreatePayload) {
    return apiClient.post<ApiResponse<WithdrawalFeeTemplate>>(
      '/admin/config/fees/withdrawal/drafts',
      payload
    )
  },

  // Update draft withdrawal fee
  updateDraftWithdrawalFee(id: string, payload: WithdrawalFeeUpdatePayload) {
    return apiClient.put<ApiResponse<WithdrawalFeeTemplate>>(
      `/admin/config/fees/withdrawal/drafts/${id}`,
      payload
    )
  },

  // Delete draft withdrawal fee
  deleteDraftWithdrawalFee(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/fees/withdrawal/drafts/${id}`)
  },

  // Version Control
  publish(payload: PublishPayload) {
    return apiClient.post<ApiResponse<{ version: string }>>('/admin/config/fees/publish', payload)
  },

  getVersions() {
    return apiClient.get<ApiResponse<Version[]>>('/admin/config/fees/versions')
  },

  getVersion(versionId: string) {
    return apiClient.get<
      ApiResponse<{
        tradingFees: TradingFeeTemplate[]
        withdrawalFees: WithdrawalFeeTemplate[]
      }>
    >(`/admin/config/fees/versions/${versionId}`)
  },

  rollback(versionId: string, notes?: string) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      `/admin/config/fees/rollback/${versionId}`,
      { notes }
    )
  },

  getDiff() {
    return apiClient.get<
      ApiResponse<{
        tradingFees: {
          added: TradingFeeTemplate[]
          modified: TradingFeeTemplate[]
          deleted: TradingFeeTemplate[]
        }
        withdrawalFees: {
          added: WithdrawalFeeTemplate[]
          modified: WithdrawalFeeTemplate[]
          deleted: WithdrawalFeeTemplate[]
        }
      }>
    >('/admin/config/fees/diff')
  },

  // Import/Export
  export(params?: ExportParams) {
    return apiClient.get<Blob>('/admin/config/fees/export', {
      params,
      responseType: 'blob',
    })
  },

  import(payload: ImportPayload) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/config/fees/import', payload)
  },

  validateImport(payload: ImportPayload) {
    return apiClient.post<ApiResponse<{ valid: boolean; errors: any[] }>>(
      '/admin/config/fees/validate-import',
      payload
    )
  },

  // Fee Calculator
  calculateFee(params: FeeCalculationParams) {
    return apiClient.post<ApiResponse<FeeCalculationResult>>('/admin/config/fees/calculate', params)
  },

  // Consistency Validation
  validateConsistency() {
    return apiClient.get<
      ApiResponse<{
        valid: boolean
        inconsistencies: Array<{
          type: 'trading' | 'withdrawal'
          id: string
          field: string
          adminValue: any
          frontendValue: any
        }>
      }>
    >('/admin/config/fees/validate-consistency')
  },
}
