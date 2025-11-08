// Admin API Client with Interceptors
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'
import { ERROR_CODE_MAP, REQUEST_TIMEOUT } from '@/utils/constants'
import { notificationService } from '@/services/notification'
import type { ApiResponse } from '@/types'
import { mockService } from '@/services/mock'

class AdminApiClient {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()

    // Enable mock mode if configured
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      mockService.enable()
      mockService.setupInterceptor(this.axiosInstance)
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId()

        // Add timestamp
        config.headers['X-Request-Time'] = Date.now().toString()

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Return the data directly for successful responses
        return response.data
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while token is being refreshed
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then(() => {
                return this.axiosInstance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            await this.refreshToken()
            this.processQueue(null)
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError)
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // Handle other errors
        const errorMessage = this.handleError(error)
        notificationService.apiError(errorMessage)

        return Promise.reject(error)
      }
    )
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve()
      }
    })
    this.failedQueue = []
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      const { status, data } = error.response
      const responseData = data as { code?: string; error_code?: string; message?: string }

      // Map error codes to user-friendly messages
      const errorCode = responseData?.code || responseData?.error_code
      if (errorCode && ERROR_CODE_MAP[errorCode]) {
        return ERROR_CODE_MAP[errorCode]
      }

      // Default messages by status
      switch (status) {
        case 400:
          return responseData?.message || 'Invalid request'
        case 403:
          return 'Permission denied'
        case 404:
          return 'Resource not found'
        case 422:
          return responseData?.message || 'Validation failed'
        case 429:
          return 'Too many requests, please try again later'
        case 500:
          return 'Server error, please try again later'
        case 502:
          return 'Bad gateway, please try again later'
        case 503:
          return 'Service unavailable, please try again later'
        default:
          return responseData?.message || 'Unknown error occurred'
      }
    } else if (error.request) {
      return 'Network error, please check your connection'
    } else {
      return error.message || 'Request failed'
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  private getToken(): string | null {
    // Token will be managed by auth store
    // For now, return from sessionStorage
    return sessionStorage.getItem('access_token')
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        { refreshToken }
      )

      const { accessToken, refreshToken: newRefreshToken } = response.data.data
      sessionStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', newRefreshToken)
    } catch (error) {
      // Clear tokens on refresh failure
      sessionStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      throw error
    }
  }

  private handleAuthFailure(): void {
    // Clear auth data
    sessionStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Redirect to login
    // This will be handled by the auth store in the actual implementation
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // HTTP methods
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config)
  }

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config)
  }

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch(url, data, config)
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config)
  }

  // Get the axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// Export singleton instance
export const apiClient = new AdminApiClient()
export default apiClient
