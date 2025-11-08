/**
 * Users API Service
 * 
 * Facade functions for Users module covering all read/write operations
 * Internal switching between Mock/Real based on environment
 */

import type { 
  UserListResponse, 
  UserDetailResponse, 
  UserStats, 
  UserQueryParams, 
  UserVipUpdatePayload, 
  UserTagUpdatePayload, 
  User2FAResetPayload, 
  UserDisablePayload, 
  UserEnablePayload,
  UserExportResponse,
  ApiResponse
} from '@/contracts/users'

// Real API client (to be replaced with actual SDK)
const realApiClient = {
  async listUsers(params: UserQueryParams): Promise<ApiResponse<UserListResponse>> {
    // Placeholder for real API call
    // const response = await sdk.users.listUsers(params)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async getUserById(id: string): Promise<ApiResponse<UserDetailResponse>> {
    // Placeholder for real API call
    // const response = await sdk.users.getUserById(id)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async getUserStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<UserStats>> {
    // Placeholder for real API call
    // const response = await sdk.users.getUserStats(params)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async updateUserVip(id: string, payload: UserVipUpdatePayload): Promise<ApiResponse<any>> {
    // Placeholder for real API call
    // const response = await sdk.users.updateUserVip(id, payload)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async updateUserTags(id: string, payload: UserTagUpdatePayload): Promise<ApiResponse<any>> {
    // Placeholder for real API call
    // const response = await sdk.users.updateUserTags(id, payload)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async resetUser2FA(id: string, payload: User2FAResetPayload): Promise<ApiResponse<any>> {
    // Placeholder for real API call
    // const response = await sdk.users.resetUser2FA(id, payload)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async disableUser(id: string, payload: UserDisablePayload): Promise<ApiResponse<any>> {
    // Placeholder for real API call
    // const response = await sdk.users.disableUser(id, payload)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async enableUser(id: string, payload: UserEnablePayload): Promise<ApiResponse<any>> {
    // Placeholder for real API call
    // const response = await sdk.users.enableUser(id, payload)
    // return response
    throw new Error('Real API implementation not available yet')
  },
  
  async exportUsers(params: UserQueryParams): Promise<ApiResponse<UserExportResponse>> {
    // Placeholder for real API call
    // const response = await sdk.users.exportUsers(params)
    // return response
    throw new Error('Real API implementation not available yet')
  }
}

// Mock API client
const mockApiClient = {
  async listUsers(params: UserQueryParams): Promise<ApiResponse<UserListResponse>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleListUsers(params))
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
  
  async getUserById(id: string): Promise<ApiResponse<UserDetailResponse>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleGetUserById(id))
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
  
  async getUserStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<UserStats>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleGetUserStats(params))
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
  
  async updateUserVip(id: string, payload: UserVipUpdatePayload): Promise<ApiResponse<any>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleUpdateUserVip(id, payload))
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
  
  async updateUserTags(id: string, payload: UserTagUpdatePayload): Promise<ApiResponse<any>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleUpdateUserTags(id, payload))
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
  
  async resetUser2FA(id: string, payload: User2FAResetPayload): Promise<ApiResponse<any>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleResetUser2FA(id, payload))
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
  
  async disableUser(id: string, payload: UserDisablePayload): Promise<ApiResponse<any>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleDisableUser(id, payload))
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
  
  async enableUser(id: string, payload: UserEnablePayload): Promise<ApiResponse<any>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleEnableUser(id, payload))
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
  
  async exportUsers(params: UserQueryParams): Promise<ApiResponse<UserExportResponse>> {
    try {
      // In mock mode, call the mock handler
      const mockResponse = await import('@/mock/handlers/users').then(mod => mod.handleExportUsers(params))
      return {
        success: true,
        data: mockResponse as UserExportResponse
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
export const usersApi = {
  /**
   * List users with pagination and filtering
   */
  async listUsers(params: UserQueryParams = {}): Promise<ApiResponse<UserListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listUsers(params)
    } else {
      return realApiClient.listUsers(params)
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<ApiResponse<UserDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getUserById(id)
    } else {
      return realApiClient.getUserById(id)
    }
  },

  /**
   * Get user statistics
   */
  async getStats(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<UserStats>> {
    if (isMockMode()) {
      return mockApiClient.getUserStats(params)
    } else {
      return realApiClient.getUserStats(params)
    }
  },

  /**
   * Update user VIP level
   */
  async updateVip(id: string, payload: UserVipUpdatePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateUserVip(id, payload)
    } else {
      return realApiClient.updateUserVip(id, payload)
    }
  },

  /**
   * Update user risk tags
   */
  async updateTags(id: string, payload: UserTagUpdatePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateUserTags(id, payload)
    } else {
      return realApiClient.updateUserTags(id, payload)
    }
  },

  /**
   * Reset user 2FA
   */
  async reset2FA(id: string, payload: User2FAResetPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.resetUser2FA(id, payload)
    } else {
      return realApiClient.resetUser2FA(id, payload)
    }
  },

  /**
   * Disable user account
   */
  async disable(id: string, payload: UserDisablePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.disableUser(id, payload)
    } else {
      return realApiClient.disableUser(id, payload)
    }
  },

  /**
   * Enable user account
   */
  async enable(id: string, payload: UserEnablePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.enableUser(id, payload)
    } else {
      return realApiClient.enableUser(id, payload)
    }
  },

  /**
   * Export users data
   */
  async export(params: UserQueryParams = {}): Promise<ApiResponse<UserExportResponse>> {
    if (isMockMode()) {
      return mockApiClient.exportUsers(params)
    } else {
      return realApiClient.exportUsers(params)
    }
  }
}

// Export individual functions for specific use cases
export {
  listUsers,
  getUserById,
  getUserStats,
  updateUserVip,
  updateUserTags,
  resetUser2FA,
  disableUser,
  enableUser,
  exportUsers
} from './facade/users'

// Default export for backward compatibility
export default usersApi