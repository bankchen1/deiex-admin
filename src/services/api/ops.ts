import { apiClient } from './AdminApiClient'

// Types
export interface LogQueryParams {
  page?: number
  pageSize?: number
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
  source?: string
  requestId?: string
  apiEndpoint?: string
  account?: string
  startTime?: string
  endTime?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SystemLog {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  source: string
  message: string
  requestId?: string
  metadata?: Record<string, any>
}

export interface AuditLog {
  id: string
  timestamp: string
  adminId: string
  adminName: string
  action: string
  objectType: string
  objectId: string
  before?: any
  after?: any
  ip: string
  userAgent: string
  requestId?: string
}

export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error'
  source: string
  message: string
  stack?: string
  requestId?: string
  apiEndpoint?: string
  statusCode?: number
  errorCode?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface LogDetail {
  id: string
  timestamp: string
  level: string
  source: string
  message: string
  requestId?: string
  request?: {
    method: string
    url: string
    headers: Record<string, string>
    body?: any
  }
  response?: {
    statusCode: number
    headers: Record<string, string>
    body?: any
  }
  stack?: string
  metadata?: Record<string, any>
}

export interface TaskQueryParams {
  page?: number
  pageSize?: number
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'disabled'
  taskType?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ScheduledTask {
  id: string
  name: string
  type: string
  schedule: string
  status: 'enabled' | 'disabled'
  lastRunAt?: string
  lastRunStatus?: 'success' | 'failed'
  lastRunDuration?: number
  nextRunAt?: string
  retryCount: number
  maxRetries: number
  createdAt: string
  updatedAt: string
}

export interface RetryQueueItem {
  id: string
  taskId: string
  taskName: string
  taskType: string
  payload: any
  attempt: number
  maxAttempts: number
  status: 'pending' | 'processing' | 'failed'
  error?: string
  nextRetryAt?: string
  createdAt: string
  updatedAt: string
}

export interface TaskSchedulePayload {
  name: string
  type: string
  schedule: string
  config?: Record<string, any>
  enabled?: boolean
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// Logs API
export const opsApi = {
  // System Logs
  getSystemLogs(params: LogQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<SystemLog>>>('/admin/ops/logs/system', {
      params,
    })
  },

  // Audit Logs
  getAuditLogs(params: LogQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>('/admin/ops/logs/audit', {
      params,
    })
  },

  // Error Logs
  getErrorLogs(params: LogQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<ErrorLog>>>('/admin/ops/logs/error', {
      params,
    })
  },

  // Log Detail
  getLogDetail(id: string) {
    return apiClient.get<ApiResponse<LogDetail>>(`/admin/ops/logs/${id}`)
  },

  // Export Logs
  exportLogs(type: 'system' | 'audit' | 'error', params: LogQueryParams) {
    return apiClient.get<Blob>(`/admin/ops/logs/${type}/export`, {
      params,
      responseType: 'blob',
    })
  },

  // Tasks
  getTasks(params: TaskQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<ScheduledTask>>>('/admin/ops/tasks', {
      params,
    })
  },

  getTaskById(id: string) {
    return apiClient.get<ApiResponse<ScheduledTask>>(`/admin/ops/tasks/${id}`)
  },

  createTask(payload: TaskSchedulePayload) {
    return apiClient.post<ApiResponse<ScheduledTask>>('/admin/ops/tasks', payload)
  },

  updateTask(id: string, payload: Partial<TaskSchedulePayload>) {
    return apiClient.put<ApiResponse<ScheduledTask>>(`/admin/ops/tasks/${id}`, payload)
  },

  deleteTask(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/ops/tasks/${id}`)
  },

  runTaskNow(id: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/ops/tasks/${id}/run`)
  },

  enableTask(id: string) {
    return apiClient.post<ApiResponse<ScheduledTask>>(`/admin/ops/tasks/${id}/enable`)
  },

  disableTask(id: string) {
    return apiClient.post<ApiResponse<ScheduledTask>>(`/admin/ops/tasks/${id}/disable`)
  },

  // Retry Queue
  getRetryQueue(params: TaskQueryParams) {
    return apiClient.get<ApiResponse<PaginatedResponse<RetryQueueItem>>>('/admin/ops/retry-queue', {
      params,
    })
  },

  retryQueueItem(id: string) {
    return apiClient.post<ApiResponse<void>>(`/admin/ops/retry-queue/${id}/retry`)
  },

  deleteQueueItem(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/ops/retry-queue/${id}`)
  },

  clearFailedQueue() {
    return apiClient.post<ApiResponse<void>>('/admin/ops/retry-queue/clear-failed')
  },
}
