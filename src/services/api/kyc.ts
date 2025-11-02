import { apiClient } from './AdminApiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { KycApplication } from '@/types/models'

// Query Parameters
export interface KycQueryParams {
  page?: number
  pageSize?: number
  status?: 'pending' | 'approved' | 'rejected' | 'all'
  country?: string
  startDate?: string
  endDate?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  userId?: string
  riskLevel?: string
}

// Review Payload
export interface ReviewPayload {
  action: 'approve' | 'reject'
  notes?: string
  evidence?: string[]
  reason?: string
}

// Batch Review Payload
export interface BatchReviewPayload {
  ids: string[]
  action: 'approve' | 'reject'
  notes?: string
  reason?: string
}

// Batch Result
export interface BatchResult {
  success: number
  failed: number
  errors: Array<{ id: string; error: string }>
}

// KYC Statistics
export interface KycStats {
  total: number
  pending: number
  approved: number
  rejected: number
  avgProcessingTime: number
  todaySubmissions: number
}

export const kycApi = {
  // Get KYC list with pagination and filters
  getList(params: KycQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<KycApplication>>>('/admin/kyc', {
      params,
    })
  },

  // Get KYC application by ID
  getById(id: string) {
    return apiClient.get<ApiResponse<KycApplication>>(`/admin/kyc/${id}`)
  },

  // Review KYC application (approve or reject)
  review(id: string, payload: ReviewPayload) {
    return apiClient.post<ApiResponse<KycApplication>>(`/admin/kyc/${id}/review`, payload)
  },

  // Batch review KYC applications
  batchReview(payload: BatchReviewPayload) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/kyc/batch-review', payload)
  },

  // Get KYC statistics
  getStats(params?: { startDate?: string; endDate?: string }) {
    return apiClient.get<ApiResponse<KycStats>>('/admin/kyc/stats', { params })
  },

  // Export KYC data
  export(params: KycQueryParams) {
    return apiClient.get<Blob>('/admin/kyc/export', {
      params,
      responseType: 'blob',
    })
  },

  // Get review history for a KYC application
  getReviewHistory(id: string) {
    return apiClient.get<ApiResponse<any[]>>(`/admin/kyc/${id}/history`)
  },
}
