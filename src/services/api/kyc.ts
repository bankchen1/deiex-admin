/**
 * KYC API Service
 * 
 * Facade functions for KYC module covering all read/write operations
 * Internal switching between Mock/Real based on environment
 */

import type { 
  KycApplicationListResponse, 
  KycApplicationDetailResponse, 
  KycStats,
  KycApplicationQueryParams,
  ApproveKycApplicationPayload,
  RejectKycApplicationPayload,
  ApiResponse
} from '@/contracts/kyc'

// Real API client (to be replaced with actual SDK)
const realApiClient = {
  async listApplications(params: KycApplicationQueryParams): Promise<ApiResponse<KycApplicationListResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async getApplicationById(id: string): Promise<ApiResponse<KycApplicationDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async getStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<KycStats>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async approveApplication(id: string, payload: ApproveKycApplicationPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async rejectApplication(id: string, payload: RejectKycApplicationPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  }
}

// Mock API client
const mockApiClient = {
  async listApplications(params: KycApplicationQueryParams): Promise<ApiResponse<KycApplicationListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/kyc').then(mod => mod.handleListApplications(params))
      return {
        success: true,
        data: mockResponse,
        meta: {
          pagination: {
            page: params.page || 1,
            pageSize: params.pageSize || 20,
            total: mockResponse.total || 0
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    }
  },
  
  async getApplicationById(id: string): Promise<ApiResponse<KycApplicationDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/kyc').then(mod => mod.handleGetApplicationById(id))
      return {
        success: true,
        data: mockResponse
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    }
  },
  
  async getStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<KycStats>> {
    try {
      const mockResponse = await import('@/mock/handlers/kyc').then(mod => mod.handleGetStats(params))
      return {
        success: true,
        data: mockResponse
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    }
  },
  
  async approveApplication(id: string, payload: ApproveKycApplicationPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/kyc').then(mod => mod.handleApproveApplication(id, payload))
      return {
        success: true,
        data: mockResponse
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    }
  },
  
  async rejectApplication(id: string, payload: RejectKycApplicationPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/kyc').then(mod => mod.handleRejectApplication(id, payload))
      return {
        success: true,
        data: mockResponse
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    }
  }
}

// Determine which client to use based on environment
const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

// Export facade functions
export const kycApi = {
  /**
   * List KYC applications with pagination and filtering
   */
  async listApplications(params: KycApplicationQueryParams = {}): Promise<ApiResponse<KycApplicationListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listApplications(params)
    } else {
      return realApiClient.listApplications(params)
    }
  },

  /**
   * Get KYC application by ID
   */
  async getApplicationById(id: string): Promise<ApiResponse<KycApplicationDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getApplicationById(id)
    } else {
      return realApiClient.getApplicationById(id)
    }
  },

  /**
   * Get KYC statistics
   */
  async getStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<KycStats>> {
    if (isMockMode()) {
      return mockApiClient.getStats(params)
    } else {
      return realApiClient.getStats(params)
    }
  },

  /**
   * Approve KYC application
   */
  async approveApplication(id: string, payload: ApproveKycApplicationPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.approveApplication(id, payload)
    } else {
      return realApiClient.approveApplication(id, payload)
    }
  },

  /**
   * Reject KYC application
   */
  async rejectApplication(id: string, payload: RejectKycApplicationPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.rejectApplication(id, payload)
    } else {
      return realApiClient.rejectApplication(id, payload)
    }
  }
}

// Export individual functions for specific use cases
export {
  listApplications,
  getApplicationById,
  getStats,
  approveApplication,
  rejectApplication
} from './facade/kyc'

// Default export for backward compatibility
export default kycApi