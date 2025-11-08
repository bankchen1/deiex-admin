// Mock Service - Intercepts all API calls and returns mock data
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { mockAuthService } from './modules/auth'
import { mockUserService } from './modules/users'
import { mockDashboardService } from './modules/dashboard'
import { mockKycService } from './modules/kyc'
import { mockAssetsService } from './modules/assets'
import { mockOrdersCompleteService } from './modules/orders-complete'
import { mockConfigCompleteService } from './modules/config-complete'
import { mockOpsReportsSettingsRiskService } from './modules/ops-reports-settings-risk'

export interface MockResponse {
  data: unknown
  status: number
  statusText: string
  headers: Record<string, string>
}

class MockService {
  private enabled = false

  enable() {
    this.enabled = true
    console.log('[Mock Service] Enabled - All API calls will return mock data')
  }

  disable() {
    this.enabled = false
    console.log('[Mock Service] Disabled')
  }

  isEnabled() {
    return this.enabled
  }

  // Helper to create paginated response
  private createPaginatedResponse(data: any[], total: number, useItems = false): MockResponse {
    return {
      data: {
        success: true,
        data: useItems
          ? {
              items: data,
              total,
            }
          : {
              data: data,
              total,
            },
        message: 'Data retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  setupInterceptor(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!this.enabled) {
          return config
        }

        // Intercept and return mock data
        const mockResponse = await this.getMockResponse(config)

        if (mockResponse) {
          // Cancel the real request and return mock data
          return Promise.reject({
            config,
            response: {
              data: mockResponse.data,
              status: mockResponse.status,
              statusText: mockResponse.statusText,
              headers: mockResponse.headers,
              config,
            },
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'MockResponse',
            message: 'Mock response',
            __MOCK__: true,
          })
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    // Handle mock responses in response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // If it's a mock response, resolve it as success
        if (error.__MOCK__) {
          return Promise.resolve(error.response.data)
        }
        return Promise.reject(error)
      }
    )
  }

  private async getMockResponse(config: AxiosRequestConfig): Promise<MockResponse | null> {
    const { url = '', method = 'get' } = config
    const delay = Math.random() * 500 + 200 // 200-700ms delay

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay))

    console.log(`[Mock Service] ${method.toUpperCase()} ${url}`)
    console.log('[Mock Service] Config:', config)

    // Route to appropriate mock service
    // Order matters! More specific paths first
    let mockResponse: MockResponse | null = null

    // Auth (highest priority)
    if (url.includes('/auth/')) {
      mockResponse = mockAuthService.handle(url, method, config.data)
    }
    // Dashboard
    else if (url.includes('/dashboard')) {
      mockResponse = mockDashboardService.handle(url, method, config.data)
    }
    // Orders & Positions (before other modules)
    else if (
      url.includes('/orders') ||
      url.includes('/positions') ||
      url.includes('/liquidations') ||
      url.includes('/copy-trading')
    ) {
      mockResponse = mockOrdersCompleteService.handle(url, method, config.data)
    }
    // Config (before generic paths)
    else if (
      url.includes('/config/') ||
      url.includes('/instruments') ||
      url.includes('/margin') ||
      url.includes('/fees') ||
      url.includes('/calendar') ||
      url.includes('/icons') ||
      url.includes('/mappings') ||
      url.includes('/security')
    ) {
      mockResponse = mockConfigCompleteService.handle(url, method, config.data)
    }
    // Ops, Reports, Settings, Risk
    else if (
      url.includes('/ops/') ||
      url.includes('/logs') ||
      url.includes('/tasks') ||
      url.includes('/reports/') ||
      url.includes('/settings') ||
      url.includes('/risk/')
    ) {
      mockResponse = mockOpsReportsSettingsRiskService.handle(url, method, config.data)
    }
    // Assets
    else if (url.includes('/deposits') || url.includes('/withdrawals') || url.includes('/assets')) {
      mockResponse = mockAssetsService.handle(url, method, config.data)
    }
    // KYC
    else if (url.includes('/kyc')) {
      mockResponse = mockKycService.handle(url, method, config.data)
    }
    // Users (last, because it's generic)
    else if (url.includes('/users')) {
      mockResponse = mockUserService.handle(url, method, config.data)
    }

    // Default success response for unhandled routes
    if (!mockResponse) {
      console.warn(`[Mock Service] No handler for ${method.toUpperCase()} ${url}`)
      mockResponse = {
        data: {
          success: true,
          data: {},
          message: 'Mock response (default)',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    console.log('[Mock Service] Response:', mockResponse.data)
    return mockResponse
  }
}

export const mockService = new MockService()
