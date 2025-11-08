/**
 * Facade统一类型定义
 *
 * 所有Facade函数返回统一的数据结构，便于UI层处理三态
 */

/**
 * Facade统一响应结构
 */
export interface FacadeResponse<T = any> {
  /** 数据 */
  data: T | null
  /** 错误信息 */
  error: FacadeError | null
  /** 元数据（分页、统计等） */
  meta?: FacadeMeta
}

/**
 * Facade错误结构
 */
export interface FacadeError {
  /** 错误代码 */
  code: number | string
  /** 错误消息 */
  message: string
  /** 详细信息 */
  details?: any
}

/**
 * Facade元数据
 */
export interface FacadeMeta {
  /** 分页信息 */
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages?: number
  }
  /** 统计信息 */
  stats?: Record<string, any>
  /** 其他元数据 */
  [key: string]: any
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 数据源类型
 */
export type DataSource = 'mock' | 'real'

/**
 * 获取当前数据源
 */
export const getDataSource = (): DataSource => {
  return import.meta.env.VITE_USE_MOCK === 'true' ? 'mock' : 'real'
}

/**
 * 判断是否使用Mock
 */
export const isMockMode = (): boolean => {
  return getDataSource() === 'mock'
}

/**
 * 统一错误处理
 */
export const handleFacadeError = (error: any): FacadeError => {
  // 如果已经是FacadeError格式
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return error as FacadeError
  }

  // 处理Axios错误
  if (error?.response) {
    return {
      code: error.response.status || 500,
      message: error.response.data?.message || error.message || 'Request failed',
      details: error.response.data,
    }
  }

  // 处理SDK错误
  if (error?.code && error?.message) {
    return {
      code: error.code,
      message: error.message,
      details: error.data,
    }
  }

  // 默认错误
  return {
    code: 500,
    message: error?.message || 'Unknown error',
    details: error,
  }
}

/**
 * 创建成功响应
 */
export const createSuccessResponse = <T>(data: T, meta?: FacadeMeta): FacadeResponse<T> => {
  return {
    data,
    error: null,
    meta,
  }
}

/**
 * 创建错误响应
 */
export const createErrorResponse = <T = null>(
  error: any,
  data: T | null = null
): FacadeResponse<T> => {
  return {
    data,
    error: handleFacadeError(error),
  }
}
