// Operations (Ops) Contracts

// Logs
export interface LogBase {
  id: string
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical'
  message: string
  service: string
  userId?: string
  ip?: string
  userAgent?: string
  traceId?: string
  spanId?: string
}

export interface SystemLog extends LogBase {
  type: 'system'
  source: string
  hostname: string
  processId: string
  memoryUsage?: number
  cpuUsage?: number
}

export interface AuditLog extends LogBase {
  type: 'audit'
  action: string
  resource: string
  resourceId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
}

export interface ErrorLog extends LogBase {
  type: 'error'
  errorType: string
  stackTrace: string
  requestUrl?: string
  requestBody?: string
  statusCode?: number
}

export interface LogDetail extends LogBase {
  details: Record<string, any>
}

export interface LogQueryParams {
  startDate?: string
  endDate?: string
  level?: string
  service?: string
  userId?: string
  action?: string
  search?: string
  page?: number
  pageSize?: number
  sort?: 'timestamp' | 'level' | 'service'
  order?: 'asc' | 'desc'
}

// Tasks
export interface ScheduledTask {
  id: string
  name: string
  description?: string
  group: string
  cronExpression: string
  status: 'active' | 'paused' | 'failed' | 'completed'
  lastRunAt?: string
  nextRunAt?: string
  lastRunStatus?: 'success' | 'failed' | 'running'
  lastRunDuration?: number // in milliseconds
  lastRunError?: string
  maxRetries: number
  retryCount: number
  timeout: number // in seconds
  enabled: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface RetryQueueItem {
  id: string
  taskId: string
  taskName: string
  error: string
  attemptCount: number
  maxRetries: number
  createdAt: string
  nextRetryAt?: string
  status: 'pending' | 'retrying' | 'failed'
}

export interface TaskQueryParams {
  status?: 'active' | 'paused' | 'failed' | 'completed'
  group?: string
  search?: string
  page?: number
  pageSize?: number
  sort?: 'name' | 'lastRunAt' | 'nextRunAt'
  order?: 'asc' | 'desc'
}

export interface TaskSchedulePayload {
  name: string
  description?: string
  group: string
  cronExpression: string
  maxRetries: number
  timeout: number
  enabled: boolean
}

// Generic pagination response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
