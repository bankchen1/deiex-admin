/**
 * Risk API Service
 * 
 * Facade functions for Risk module covering all read/write operations
 * Internal switching between Mock/Real based on environment
 */

import type { 
  RiskRuleListResponse, 
  RiskLimitListResponse, 
  BlacklistEntryListResponse,
  RiskRuleDetailResponse,
  RiskLimitDetailResponse,
  BlacklistEntryDetailResponse,
  RiskRuleQueryParams,
  RiskLimitQueryParams,
  BlacklistEntryQueryParams,
  CreateRiskRulePayload,
  UpdateRiskRulePayload,
  CreateRiskLimitPayload,
  UpdateRiskLimitPayload,
  CreateBlacklistEntryPayload,
  UpdateBlacklistEntryPayload,
  RiskSimulationPayload,
  ApiResponse
} from '@/contracts/risk'

// Real API client (to be replaced with actual SDK)
const realApiClient = {
  async listRiskRules(params: RiskRuleQueryParams): Promise<ApiResponse<RiskRuleListResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async listRiskLimits(params: RiskLimitQueryParams): Promise<ApiResponse<RiskLimitListResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async listBlacklistEntries(params: BlacklistEntryQueryParams): Promise<ApiResponse<BlacklistEntryListResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async getRiskRuleById(id: string): Promise<ApiResponse<RiskRuleDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async getRiskLimitById(id: string): Promise<ApiResponse<RiskLimitDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async getBlacklistEntryById(id: string): Promise<ApiResponse<BlacklistEntryDetailResponse>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async createRiskRule(payload: CreateRiskRulePayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async updateRiskRule(id: string, payload: UpdateRiskRulePayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async deleteRiskRule(id: string): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async createRiskLimit(payload: CreateRiskLimitPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async updateRiskLimit(id: string, payload: UpdateRiskLimitPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async deleteRiskLimit(id: string): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async createBlacklistEntry(payload: CreateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async updateBlacklistEntry(id: string, payload: UpdateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async deleteBlacklistEntry(id: string): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  },
  
  async simulateRisk(payload: RiskSimulationPayload): Promise<ApiResponse<any>> {
    throw new Error('Real API implementation not available yet')
  }
}

// Mock API client
const mockApiClient = {
  async listRiskRules(params: RiskRuleQueryParams): Promise<ApiResponse<RiskRuleListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleListRiskRules(params))
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
  
  async listRiskLimits(params: RiskLimitQueryParams): Promise<ApiResponse<RiskLimitListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleListRiskLimits(params))
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
  
  async listBlacklistEntries(params: BlacklistEntryQueryParams): Promise<ApiResponse<BlacklistEntryListResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleListBlacklistEntries(params))
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
  
  async getRiskRuleById(id: string): Promise<ApiResponse<RiskRuleDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleGetRiskRuleById(id))
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
  
  async getRiskLimitById(id: string): Promise<ApiResponse<RiskLimitDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleGetRiskLimitById(id))
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
  
  async getBlacklistEntryById(id: string): Promise<ApiResponse<BlacklistEntryDetailResponse>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleGetBlacklistEntryById(id))
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
  
  async createRiskRule(payload: CreateRiskRulePayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleCreateRiskRule(payload))
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
  
  async updateRiskRule(id: string, payload: UpdateRiskRulePayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleUpdateRiskRule(id, payload))
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
  
  async deleteRiskRule(id: string): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleDeleteRiskRule(id))
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
  
  async createRiskLimit(payload: CreateRiskLimitPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleCreateRiskLimit(payload))
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
  
  async updateRiskLimit(id: string, payload: UpdateRiskLimitPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleUpdateRiskLimit(id, payload))
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
  
  async deleteRiskLimit(id: string): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleDeleteRiskLimit(id))
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
  
  async createBlacklistEntry(payload: CreateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleCreateBlacklistEntry(payload))
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
  
  async updateBlacklistEntry(id: string, payload: UpdateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleUpdateBlacklistEntry(id, payload))
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
  
  async deleteBlacklistEntry(id: string): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleDeleteBlacklistEntry(id))
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
  
  async simulateRisk(payload: RiskSimulationPayload): Promise<ApiResponse<any>> {
    try {
      const mockResponse = await import('@/mock/handlers/risk').then(mod => mod.handleSimulateRisk(payload))
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
export const riskApi = {
  /**
   * List risk rules with pagination and filtering
   */
  async listRiskRules(params: RiskRuleQueryParams = {}): Promise<ApiResponse<RiskRuleListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listRiskRules(params)
    } else {
      return realApiClient.listRiskRules(params)
    }
  },

  /**
   * List risk limits with pagination and filtering
   */
  async listRiskLimits(params: RiskLimitQueryParams = {}): Promise<ApiResponse<RiskLimitListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listRiskLimits(params)
    } else {
      return realApiClient.listRiskLimits(params)
    }
  },

  /**
   * List blacklist entries with pagination and filtering
   */
  async listBlacklistEntries(params: BlacklistEntryQueryParams = {}): Promise<ApiResponse<BlacklistEntryListResponse>> {
    if (isMockMode()) {
      return mockApiClient.listBlacklistEntries(params)
    } else {
      return realApiClient.listBlacklistEntries(params)
    }
  },

  /**
   * Get risk rule by ID
   */
  async getRiskRuleById(id: string): Promise<ApiResponse<RiskRuleDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getRiskRuleById(id)
    } else {
      return realApiClient.getRiskRuleById(id)
    }
  },

  /**
   * Get risk limit by ID
   */
  async getRiskLimitById(id: string): Promise<ApiResponse<RiskLimitDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getRiskLimitById(id)
    } else {
      return realApiClient.getRiskLimitById(id)
    }
  },

  /**
   * Get blacklist entry by ID
   */
  async getBlacklistEntryById(id: string): Promise<ApiResponse<BlacklistEntryDetailResponse>> {
    if (isMockMode()) {
      return mockApiClient.getBlacklistEntryById(id)
    } else {
      return realApiClient.getBlacklistEntryById(id)
    }
  },

  /**
   * Create risk rule
   */
  async createRiskRule(payload: CreateRiskRulePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.createRiskRule(payload)
    } else {
      return realApiClient.createRiskRule(payload)
    }
  },

  /**
   * Update risk rule
   */
  async updateRiskRule(id: string, payload: UpdateRiskRulePayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateRiskRule(id, payload)
    } else {
      return realApiClient.updateRiskRule(id, payload)
    }
  },

  /**
   * Delete risk rule
   */
  async deleteRiskRule(id: string): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.deleteRiskRule(id)
    } else {
      return realApiClient.deleteRiskRule(id)
    }
  },

  /**
   * Create risk limit
   */
  async createRiskLimit(payload: CreateRiskLimitPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.createRiskLimit(payload)
    } else {
      return realApiClient.createRiskLimit(payload)
    }
  },

  /**
   * Update risk limit
   */
  async updateRiskLimit(id: string, payload: UpdateRiskLimitPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateRiskLimit(id, payload)
    } else {
      return realApiClient.updateRiskLimit(id, payload)
    }
  },

  /**
   * Delete risk limit
   */
  async deleteRiskLimit(id: string): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.deleteRiskLimit(id)
    } else {
      return realApiClient.deleteRiskLimit(id)
    }
  },

  /**
   * Create blacklist entry
   */
  async createBlacklistEntry(payload: CreateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.createBlacklistEntry(payload)
    } else {
      return realApiClient.createBlacklistEntry(payload)
    }
  },

  /**
   * Update blacklist entry
   */
  async updateBlacklistEntry(id: string, payload: UpdateBlacklistEntryPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.updateBlacklistEntry(id, payload)
    } else {
      return realApiClient.updateBlacklistEntry(id, payload)
    }
  },

  /**
   * Delete blacklist entry
   */
  async deleteBlacklistEntry(id: string): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.deleteBlacklistEntry(id)
    } else {
      return realApiClient.deleteBlacklistEntry(id)
    }
  },

  /**
   * Simulate risk
   */
  async simulateRisk(payload: RiskSimulationPayload): Promise<ApiResponse<any>> {
    if (isMockMode()) {
      return mockApiClient.simulateRisk(payload)
    } else {
      return realApiClient.simulateRisk(payload)
    }
  }
}

// Export individual functions for specific use cases
export {
  listRiskRules,
  listRiskLimits,
  listBlacklistEntries,
  getRiskRuleById,
  getRiskLimitById,
  getBlacklistEntryById,
  createRiskRule,
  updateRiskRule,
  deleteRiskRule,
  createRiskLimit,
  updateRiskLimit,
  deleteRiskLimit,
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
  simulateRisk
} from './facade/risk'

// Default export for backward compatibility
export default riskApi