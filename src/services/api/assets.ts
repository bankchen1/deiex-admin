import { apiClient } from './AdminApiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Deposit, Withdrawal, WalletAddress, ChainHealth, RetryTask } from '@/types/models'

// Query Parameters
export interface DepositQueryParams {
  page?: number
  pageSize?: number
  userId?: string
  currency?: string
  chain?: string
  status?: string
  startTime?: string
  endTime?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface WithdrawalQueryParams {
  page?: number
  pageSize?: number
  userId?: string
  currency?: string
  chain?: string
  status?: string
  startTime?: string
  endTime?: string
  minRiskScore?: number
  maxRiskScore?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface WalletQueryParams {
  chain?: string
  type?: 'hot' | 'cold'
  status?: string
}

// Request Payloads
export interface ApproveWithdrawalPayload {
  role?: string // For multi-role approval workflow
  reason?: string
  notes?: string
}

export interface RejectWithdrawalPayload {
  reason: string
  notes?: string
}

export interface BatchApprovePayload {
  ids: string[]
  role?: string // For multi-role approval workflow
  reason?: string
}

export interface BatchRejectPayload {
  ids: string[]
  reason: string
}

// Deposits API
export const depositsApi = {
  getList(params: DepositQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<Deposit>>>('/admin/deposits', {
      params,
    })
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<Deposit>>(`/admin/deposits/${id}`)
  },

  export(params: DepositQueryParams) {
    return apiClient.get<Blob>('/admin/deposits/export', {
      params,
      responseType: 'blob',
    })
  },

  updateNotes(id: string, notes: string) {
    return apiClient.patch<ApiResponse<Deposit>>(`/admin/deposits/${id}/notes`, { notes })
  },
}

// Withdrawals API
export const withdrawalsApi = {
  getList(params: WithdrawalQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<Withdrawal>>>('/admin/withdrawals', {
      params,
    })
  },

  getById(id: string) {
    return apiClient.get<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}`)
  },

  approve(id: string, payload: ApproveWithdrawalPayload) {
    return apiClient.post<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}/approve`, payload)
  },

  reject(id: string, payload: RejectWithdrawalPayload) {
    return apiClient.post<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}/reject`, payload)
  },

  batchApprove(payload: BatchApprovePayload) {
    return apiClient.post<ApiResponse<{ success: number; failed: number }>>(
      '/admin/withdrawals/batch-approve',
      payload
    )
  },

  batchReject(payload: BatchRejectPayload) {
    return apiClient.post<ApiResponse<{ success: number; failed: number }>>(
      '/admin/withdrawals/batch-reject',
      payload
    )
  },

  export(params: WithdrawalQueryParams) {
    return apiClient.get<Blob>('/admin/withdrawals/export', {
      params,
      responseType: 'blob',
    })
  },

  updateNotes(id: string, notes: string) {
    return apiClient.patch<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}/notes`, { notes })
  },
}

// Wallets API
export const walletsApi = {
  getAddresses(params: WalletQueryParams) {
    return apiClient.get<ApiResponse<WalletAddress[]>>('/admin/wallets/addresses', { params })
  },

  getChainHealth() {
    return apiClient.get<ApiResponse<ChainHealth[]>>('/admin/wallets/chain-health')
  },

  getRetryQueue() {
    return apiClient.get<ApiResponse<RetryTask[]>>('/admin/wallets/retry-queue')
  },

  retryTask(taskId: string) {
    return apiClient.post<ApiResponse<RetryTask>>(`/admin/wallets/retry-queue/${taskId}/retry`)
  },

  cancelTask(taskId: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/wallets/retry-queue/${taskId}/cancel`)
  },

  syncBalance(addressId: string) {
    return apiClient.post<ApiResponse<WalletAddress>>(`/admin/wallets/addresses/${addressId}/sync`)
  },
}
