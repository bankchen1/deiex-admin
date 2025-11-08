/**
 * 类型安全的API客户端包装器
 *
 * 为Facade层提供类型安全的HTTP调用
 */

import { apiClient } from './AdminApiClient'
import type { AxiosRequestConfig } from 'axios'

/**
 * API响应包装类型
 */
interface ApiResponseWrapper<T = any> {
  success: boolean
  data: T
  message?: string
  error?: any
}

/**
 * 类型安全的GET请求
 */
export const safeGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponseWrapper<T>> => {
  const response = await apiClient.get(url, config)
  return response as ApiResponseWrapper<T>
}

/**
 * 类型安全的POST请求
 */
export const safePost = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseWrapper<T>> => {
  const response = await apiClient.post(url, data, config)
  return response as ApiResponseWrapper<T>
}

/**
 * 类型安全的PUT请求
 */
export const safePut = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseWrapper<T>> => {
  const response = await apiClient.put(url, data, config)
  return response as ApiResponseWrapper<T>
}

/**
 * 类型安全的PATCH请求
 */
export const safePatch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseWrapper<T>> => {
  const response = await apiClient.patch(url, data, config)
  return response as ApiResponseWrapper<T>
}

/**
 * 类型安全的DELETE请求
 */
export const safeDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponseWrapper<T>> => {
  const response = await apiClient.delete(url, config)
  return response as ApiResponseWrapper<T>
}
