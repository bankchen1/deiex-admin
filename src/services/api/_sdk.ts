/**
 * SDK Adapter - 统一封装生成的SDK
 *
 * 职责：
 * 1. 实例化SDK并注入配置（BaseURL、Token、超时等）
 * 2. 统一错误拦截与转换
 * 3. 添加Trace Header和请求ID
 * 4. 仅在Real模式下使用
 */

import { Configuration } from '@/generated/configuration'
import {
  AdminAnalyticsApi,
  AdminAssetsApi,
  AdminComplianceApi,
  AdminConfigInstrumentsApi,
  AdminMonitoringApi,
  AuthApi,
  MarketApi,
  MeApi,
  TradingApi,
  UsersApi,
  WalletApi,
} from '@/generated/api'
import type { AxiosInstance, AxiosError } from 'axios'
import axios from 'axios'

/**
 * SDK配置
 */
const sdkConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL || '/api',
  accessToken: () => {
    // 从localStorage或其他存储获取token
    return localStorage.getItem('access_token') || ''
  },
})

/**
 * 创建带拦截器的Axios实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加请求ID
      config.headers['X-Request-ID'] =
        `req_${Date.now()}_${Math.random().toString(36).substring(7)}`

      // 添加时间戳
      config.headers['X-Request-Time'] = Date.now().toString()

      // 添加Trace Header（用于分布式追踪）
      config.headers['X-Trace-ID'] = `trace_${Date.now()}`

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      // 统一错误处理
      const errorResponse = {
        code: error.response?.status || 500,
        message: error.message || 'Unknown error',
        data: error.response?.data,
      }

      // 401 - 未授权
      if (error.response?.status === 401) {
        // 触发登出或刷新token
        console.error('[SDK] Unauthorized - redirecting to login')
        // 可以在这里触发全局事件或路由跳转
      }

      // 403 - 禁止访问
      if (error.response?.status === 403) {
        console.error('[SDK] Forbidden - insufficient permissions')
      }

      // 500 - 服务器错误
      if (error.response?.status === 500) {
        console.error('[SDK] Server error')
      }

      return Promise.reject(errorResponse)
    }
  )

  return instance
}

/**
 * SDK实例（带配置的Axios）
 */
const axiosInstance = createAxiosInstance()

/**
 * 导出所有API实例
 */
export const sdk = {
  // Admin APIs
  analytics: new AdminAnalyticsApi(sdkConfig, undefined, axiosInstance),
  assets: new AdminAssetsApi(sdkConfig, undefined, axiosInstance),
  compliance: new AdminComplianceApi(sdkConfig, undefined, axiosInstance),
  instruments: new AdminConfigInstrumentsApi(sdkConfig, undefined, axiosInstance),
  monitoring: new AdminMonitoringApi(sdkConfig, undefined, axiosInstance),

  // Public APIs
  auth: new AuthApi(sdkConfig, undefined, axiosInstance),
  market: new MarketApi(sdkConfig, undefined, axiosInstance),
  me: new MeApi(sdkConfig, undefined, axiosInstance),
  trading: new TradingApi(sdkConfig, undefined, axiosInstance),
  users: new UsersApi(sdkConfig, undefined, axiosInstance),
  wallet: new WalletApi(sdkConfig, undefined, axiosInstance),
}

/**
 * 更新Token（用于登录后或刷新token后）
 */
export const updateSdkToken = (token: string) => {
  localStorage.setItem('access_token', token)
}

/**
 * 清除Token（用于登出）
 */
export const clearSdkToken = () => {
  localStorage.removeItem('access_token')
}
