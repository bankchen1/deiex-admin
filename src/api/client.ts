/**
 * SDK Integration Layer
 * Integrates OpenAPI-generated SDK with Admin frontend
 */

import axios, { type AxiosInstance } from 'axios'
import { Configuration } from '@/generated/configuration'
import {
  AuthApi,
  AdminAnalyticsApi,
  AdminAssetsApi,
  AdminComplianceApi,
  AdminConfigInstrumentsApi,
  AdminMonitoringApi,
  UsersApi,
  MarketApi,
  TradingApi,
  WalletApi,
  MeApi,
} from '@/generated/api'

// Get base URL from environment
// Note: SDK already includes /api/v1 in BASE_PATH, so we only need the host
const BASE_URL = 'http://localhost:8080'

/**
 * Create axios instance with interceptors
 * NOTE: We set baseURL so the SDK will use it directly (see common.ts createRequestFunction)
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'http://localhost:8080', // SDK paths already include /api/v1
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false, // Go backend doesn't use cookies
  })

  // Request interceptor - add JWT token
  instance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request tracking headers
      config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      config.headers['X-Request-Time'] = Date.now().toString()

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle errors and token expiry
  instance.interceptors.response.use(
    (response) => {
      // Return full response (SDK expects AxiosResponse)
      return response
    },
    async (error) => {
      if (error.response?.status === 401) {
        // Handle token expiry - clear auth data and redirect
        sessionStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        // Redirect to login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// Create shared axios instance
const axiosInstance = createAxiosInstance()

/**
 * Create SDK configuration
 * basePath is not needed since we set axios.defaults.baseURL
 */
const createSDKConfiguration = (): Configuration => {
  return new Configuration({
    // basePath: BASE_URL, // Not needed - axios instance has baseURL
    baseOptions: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
}

const sdkConfig = createSDKConfiguration()

/**
 * Export SDK API instances
 * All APIs use the same axios instance with interceptors
 */

// Authentication API
export const authApi = new AuthApi(sdkConfig, BASE_URL, axiosInstance)

// Admin APIs
export const adminAnalyticsApi = new AdminAnalyticsApi(sdkConfig, BASE_URL, axiosInstance)
export const adminAssetsApi = new AdminAssetsApi(sdkConfig, BASE_URL, axiosInstance)
export const adminComplianceApi = new AdminComplianceApi(sdkConfig, BASE_URL, axiosInstance)
export const adminConfigInstrumentsApi = new AdminConfigInstrumentsApi(
  sdkConfig,
  BASE_URL,
  axiosInstance
)
export const adminMonitoringApi = new AdminMonitoringApi(sdkConfig, BASE_URL, axiosInstance)

// User Management API
export const usersApi = new UsersApi(sdkConfig, BASE_URL, axiosInstance)

// Trading & Market APIs
export const marketApi = new MarketApi(sdkConfig, BASE_URL, axiosInstance)
export const tradingApi = new TradingApi(sdkConfig, BASE_URL, axiosInstance)

// Wallet API
export const walletApi = new WalletApi(sdkConfig, BASE_URL, axiosInstance)

// Me API (user profile)
export const meApi = new MeApi(sdkConfig, BASE_URL, axiosInstance)

/**
 * Export axios instance for direct usage
 */
export { axiosInstance }

/**
 * Export configuration for testing/debugging
 */
export { sdkConfig, BASE_URL }
