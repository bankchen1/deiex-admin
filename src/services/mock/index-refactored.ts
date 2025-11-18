/**
 * Mock Service - Intercepts all API calls and returns mock data
 *
 * This is the central mock service that uses the new router for better route handling.
 */

import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { MockRouter } from './router'
import { mockDataStore } from './data-store'
import { generateMockUsers } from './generators/user'
import type { MockResponse } from './index'

class MockService {
  private enabled = false
  private router: MockRouter

  constructor() {
    this.router = new MockRouter()
    this.setupRoutes()
  }

  /**
   * Enable mock mode
   */
  enable() {
    this.enabled = true
    console.log('[Mock Service] Enabled - All API calls will return mock data')
  }

  /**
   * Disable mock mode
   */
  disable() {
    this.enabled = false
    console.log('[Mock Service] Disabled')
  }

  /**
   * Check if mock mode is enabled
   */
  isEnabled() {
    return this.enabled
  }

  /**
   * Setup route handlers
   */
  private setupRoutes() {
    // User routes
    this.router.addRoute(/^\/admin\/users$/, 'get', this.handleListUsers.bind(this))
    this.router.addRoute(/^\/admin\/users\/([^\/]+)$/, 'get', this.handleGetUser.bind(this))
    this.router.addRoute(/^\/admin\/users\/stats$/, 'get', this.handleGetUserStats.bind(this))

    // Add more routes as needed
  }

  /**
   * Handle list users request
   */
  private handleListUsers(
    url: string,
    method: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): MockResponse {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')

    // Generate mock users if not already in store
    if (!mockDataStore.hasCollection('users') || mockDataStore.getSize('users') === 0) {
      const mockUsers = generateMockUsers(100)
      mockDataStore.setCollection('users', mockUsers)
    }

    const users = mockDataStore.getCollection('users')
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedUsers = users.slice(start, end)

    return {
      data: {
        success: true,
        data: {
          data: paginatedUsers,
          total: users.length,
          page,
          pageSize,
        },
        message: 'Users retrieved successfully',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  /**
   * Handle get user by ID request
   */
  private handleGetUser(
    url: string,
    method: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): MockResponse {
    const matches = url.match(/^\/admin\/users\/([^\/]+)$/)
    if (!matches) {
      return this.createErrorResponse('Invalid user ID')
    }

    const userId = matches[1]

    // Generate mock users if not already in store
    if (!mockDataStore.hasCollection('users') || mockDataStore.getSize('users') === 0) {
      const mockUsers = generateMockUsers(100)
      mockDataStore.setCollection('users', mockUsers)
    }

    const user = mockDataStore.getItem('users', userId)

    if (!user) {
      return this.createErrorResponse('User not found', 404)
    }

    return {
      data: {
        success: true,
        data: user,
        message: 'User retrieved successfully',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  /**
   * Handle get user stats request
   */
  private handleGetUserStats(
    url: string,
    method: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): MockResponse {
    // In a real implementation, this would generate stats based on mock data
    const stats = {
      totalUsers: 12500,
      activeUsers: 9800,
      newUsersToday: 45,
      kycApproved: 8700,
      vipUsers: 1200,
    }

    return {
      data: {
        success: true,
        data: stats,
        message: 'User stats retrieved successfully',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  /**
   * Create error response
   */
  private createErrorResponse(message: string, status: number = 400): MockResponse {
    return {
      data: {
        success: false,
        error: {
          code: status,
          message,
        },
        message,
      },
      status,
      statusText: 'Error',
      headers: { 'content-type': 'application/json' },
    }
  }

  /**
   * Setup interceptor on axios instance
   */
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

  /**
   * Get mock response for a request
   */
  private async getMockResponse(config: AxiosRequestConfig): Promise<MockResponse | null> {
    const { url = '', method = 'get' } = config
    const delay = Math.random() * 500 + 200 // 200-700ms delay

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay))

    console.log(`[Mock Service] ${method.toUpperCase()} ${url}`)
    console.log('[Mock Service] Config:', config)

    // Route to appropriate handler
    const mockResponse = this.router.handle(url, method, config.data, config)

    // Default success response for unhandled routes
    if (!mockResponse) {
      console.warn(`[Mock Service] No handler for ${method.toUpperCase()} ${url}`)
      return {
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
