/**
 * API Configuration Management
 *
 * Centralized configuration for the API client with environment-based settings.
 */

export interface ApiConfig {
  /** Base URL for API requests */
  baseURL: string

  /** Request timeout in milliseconds */
  timeout: number

  /** Enable mock mode */
  mockEnabled: boolean

  /** Number of retry attempts for failed requests */
  retryAttempts: number

  /** Delay between retry attempts in milliseconds */
  retryDelay: number

  /** Enable request/response logging */
  loggingEnabled: boolean
}

/**
 * Get API configuration from environment variables
 */
export const getApiConfig = (): ApiConfig => ({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  mockEnabled: import.meta.env.VITE_USE_MOCK === 'true',
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
  loggingEnabled: import.meta.env.VITE_API_LOGGING === 'true',
})

/**
 * Validate API configuration
 */
export const validateApiConfig = (config: ApiConfig): boolean => {
  if (!config.baseURL) {
    console.error('API base URL is required')
    return false
  }

  if (config.timeout <= 0) {
    console.error('API timeout must be greater than 0')
    return false
  }

  if (config.retryAttempts < 0) {
    console.error('API retry attempts cannot be negative')
    return false
  }

  if (config.retryDelay < 0) {
    console.error('API retry delay cannot be negative')
    return false
  }

  return true
}
