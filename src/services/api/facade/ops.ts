import { safeGet, safePost, safePut, safeDelete } from '../_client'
import type { FacadeResponse } from '../_types'
import { createSuccessResponse, createErrorResponse, isMockMode } from '../_types'
import type {
  LogQueryParams,
  SystemLog,
  AuditLog,
  ErrorLog,
  LogDetail,
  TaskQueryParams,
  ScheduledTask,
  RetryQueueItem,
  TaskSchedulePayload,
  PaginatedResponse,
} from '@/contracts/ops'

// Logs API
// System Logs
export const getSystemLogs = async (
  params: LogQueryParams
): Promise<FacadeResponse<PaginatedResponse<SystemLog>>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<PaginatedResponse<SystemLog>>('/admin/ops/logs/system', {
      params,
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Audit Logs
export const getAuditLogs = async (
  params: LogQueryParams
): Promise<FacadeResponse<PaginatedResponse<AuditLog>>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<PaginatedResponse<AuditLog>>('/admin/ops/logs/audit', {
      params,
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Error Logs
export const getErrorLogs = async (
  params: LogQueryParams
): Promise<FacadeResponse<PaginatedResponse<ErrorLog>>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<PaginatedResponse<ErrorLog>>('/admin/ops/logs/error', {
      params,
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Log Detail
export const getLogDetail = async (id: string): Promise<FacadeResponse<LogDetail>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<LogDetail>(`/admin/ops/logs/${id}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Export Logs
export const exportLogs = async (
  type: 'system' | 'audit' | 'error',
  params: LogQueryParams
): Promise<FacadeResponse<Blob>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<Blob>(`/admin/ops/logs/${type}/export`, {
      params,
      responseType: 'blob',
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Tasks
export const getTasks = async (
  params: TaskQueryParams
): Promise<FacadeResponse<PaginatedResponse<ScheduledTask>>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<PaginatedResponse<ScheduledTask>>('/admin/ops/tasks', {
      params,
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const getTaskById = async (id: string): Promise<FacadeResponse<ScheduledTask>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<ScheduledTask>(`/admin/ops/tasks/${id}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const createTask = async (
  payload: TaskSchedulePayload
): Promise<FacadeResponse<ScheduledTask>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<ScheduledTask>('/admin/ops/tasks', payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const updateTask = async (
  id: string,
  payload: Partial<TaskSchedulePayload>
): Promise<FacadeResponse<ScheduledTask>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePut<ScheduledTask>(`/admin/ops/tasks/${id}`, payload)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteTask = async (id: string): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeDelete<void>(`/admin/ops/tasks/${id}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const runTaskNow = async (id: string): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>(`/admin/ops/tasks/${id}/run`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const enableTask = async (id: string): Promise<FacadeResponse<ScheduledTask>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<ScheduledTask>(`/admin/ops/tasks/${id}/enable`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const disableTask = async (id: string): Promise<FacadeResponse<ScheduledTask>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<ScheduledTask>(`/admin/ops/tasks/${id}/disable`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

// Retry Queue
export const getRetryQueue = async (
  params: TaskQueryParams
): Promise<FacadeResponse<PaginatedResponse<RetryQueueItem>>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeGet<PaginatedResponse<RetryQueueItem>>('/admin/ops/retry-queue', {
      params,
    })
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const retryQueueItem = async (id: string): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>(`/admin/ops/retry-queue/${id}/retry`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const deleteQueueItem = async (id: string): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safeDelete<void>(`/admin/ops/retry-queue/${id}`)
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}

export const clearFailedQueue = async (): Promise<FacadeResponse<void>> => {
  try {
    if (isMockMode()) {
      throw new Error('Mock mode not implemented yet')
    }
    const response = await safePost<void>('/admin/ops/retry-queue/clear-failed')
    return createSuccessResponse(response.data)
  } catch (error) {
    return createErrorResponse(error)
  }
}
