/**
 * Assets API Service
 *
 * Facade functions for Assets module covering all read/write operations
 * Internal switching between Mock/Real based on environment
 */

import type {
  DepositListResponse,
  WithdrawalListResponse,
  WalletAddressListResponse,
  DepositDetailResponse,
  WithdrawalDetailResponse,
  DepositQueryParams,
  WithdrawalQueryParams,
  WalletAddressQueryParams,
  UpdateDepositNotesPayload,
  ApproveWithdrawalPayload,
  RejectWithdrawalPayload,
  CreateWalletAddressPayload,
  ApiResponse,
} from '@/contracts/assets'

// Real API client (to be replaced with actual SDK)
const realApiClient = {
  async listDeposits(params: DepositQueryParams): Promise<ApiResponse<DepositListResponse>> {
    throw new Error('Real API implementation not available yet')
  },

  async listWithdrawals(
    params: WithdrawalQueryParams
  ): Promise<ApiResponse<WithdrawalListResponse>> {
    throw new Error('Real API implementation not available yet')
  },

  async listWalletAddresses(
    params: WalletAddressQueryParams
  ): Promise<ApiResponse<WalletAddressListResponse>> {
    throw new Error('Real API implementation not available yet')
  },

  async getDepositById(id: string): Promise<ApiResponse<DepositDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },

  async getWithdrawalById(id: string): Promise<ApiResponse<WithdrawalDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },

  async updateDepositNotes(
    id: string,
    payload: UpdateDepositNotesPayload
  ): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },

  async approveWithdrawal(
    id: string,
    payload: ApproveWithdrawalPayload
  ): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },

  async rejectWithdrawal(id: string, payload: RejectWithdrawalPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },

  async createWalletAddress(payload: CreateWalletAddressPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
}

// Mock API client
const mockApiClient = {
  async listDeposits(params: DepositQueryParams): Promise<ApiResponse<DepositListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleListDeposits(params)
      )
      return {
        success: true,
        data: mockResponse,
        meta: {
          pagination: {
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            total: mockResponse.total || 0,
          },
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async listWithdrawals(
    params: WithdrawalQueryParams
  ): Promise<ApiResponse<WithdrawalListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleListWithdrawals(params)
      )
      return {
        success: true,
        data: mockResponse,
        meta: {
          pagination: {
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            total: mockResponse.total || 0,
          },
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async listWalletAddresses(
    params: WalletAddressQueryParams
  ): Promise<ApiResponse<WalletAddressListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleListWalletAddresses(params)
      )
      return {
        success: true,
        data: mockResponse,
        meta: {
          pagination: {
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            total: mockResponse.total || 0,
          },
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async getDepositById(id: string): Promise<ApiResponse<DepositDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleGetDepositById(id)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async getWithdrawalById(id: string): Promise<ApiResponse<WithdrawalDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleGetWithdrawalById(id)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async updateDepositNotes(
    id: string,
    payload: UpdateDepositNotesPayload
  ): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleUpdateDepositNotes(id, payload)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async approveWithdrawal(
    id: string,
    payload: ApproveWithdrawalPayload
  ): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleApproveWithdrawal(id, payload)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async rejectWithdrawal(id: string, payload: RejectWithdrawalPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleRejectWithdrawal(id, payload)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },

  async createWalletAddress(payload: CreateWalletAddressPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/assets').then((mod) =>
        mod.handleCreateWalletAddress(payload)
      )
      return {
        success: true,
        data: mockResponse,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }
    }
  },
}

// Determine which client to use based on environment
const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

// Export facade functions
export const assetsApi = {
  /**
   * List deposits with pagination and filtering
   */
  async listDeposits(params: DepositQueryParams = {}): Promise<ApiResponse<DepositListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listDeposits(params)
    } else {
      return realApiClient.listDeposits(params)
    }
  },

  /**
   * List withdrawals with pagination and filtering
   */
  async listWithdrawals(
    params: WithdrawalQueryParams = {}
  ): Promise<ApiResponse<WithdrawalListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listWithdrawals(params)
    } else {
      return realApiClient.listWithdrawals(params)
    }
  },

  /**
   * List wallet addresses with pagination and filtering
   */
  async listWalletAddresses(
    params: WalletAddressQueryParams = {}
  ): Promise<ApiResponse<WalletAddressListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listWalletAddresses(params)
    } else {
      return realApiClient.listWalletAddresses(params)
    }
  },

  /**
   * Get deposit by ID
   */
  async getDepositById(id: string): Promise<ApiResponse<DepositDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getDepositById(id)
    } else {
      return realApiClient.getDepositById(id)
    }
  },

  /**
   * Get withdrawal by ID
   */
  async getWithdrawalById(id: string): Promise<ApiResponse<WithdrawalDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getWithdrawalById(id)
    } else {
      return realApiClient.getWithdrawalById(id)
    }
  },

  /**
   * Update deposit notes
   */
  async updateDepositNotes(
    id: string,
    payload: UpdateDepositNotesPayload
  ): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateDepositNotes(id, payload)
    } else {
      return realApiClient.updateDepositNotes(id, payload)
    }
  },

  /**
   * Approve withdrawal
   */
  async approveWithdrawal(
    id: string,
    payload: ApproveWithdrawalPayload
  ): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.approveWithdrawal(id, payload)
    } else {
      return realApiClient.approveWithdrawal(id, payload)
    }
  },

  /**
   * Reject withdrawal
   */
  async rejectWithdrawal(id: string, payload: RejectWithdrawalPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.rejectWithdrawal(id, payload)
    } else {
      return realApiClient.rejectWithdrawal(id, payload)
    }
  },

  /**
   * Create wallet address
   */
  async createWalletAddress(payload: CreateWalletAddressPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.createWalletAddress(payload)
    } else {
      return realApiClient.createWalletAddress(payload)
    }
  },
}

// Export individual functions for specific use cases
export {
  listDeposits,
  listWithdrawals,
  listWalletAddresses,
  getDepositById,
  getWithdrawalById,
  updateDepositNotes,
  approveWithdrawal,
  rejectWithdrawal,
  createWalletAddress,
} from './facade/assets'

// Default export for backward compatibility
export default assetsApi
