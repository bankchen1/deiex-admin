/**
 * Calendar Module Contracts
 * 
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Funding Rule Entity
export interface FundingRule {
  id: string
  symbol: string
  period: number
  nextFundingTime: string
  calculationRule: string
  enabled: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Maintenance Window Entity
export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  affectedScope: string[]
  announcementPush: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Announcement Entity
export interface Announcement {
  id: string
  title: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  content: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  type: 'event' | 'maintenance' | 'update' | 'promotion' | 'alert'
  pinned: boolean
  pushChannels: string[]
  publishTime: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Version Entity
export interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}

// Query Parameter Contracts
export interface FundingRuleQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  symbol?: string
  status?: 'draft' | 'published'
  enabled?: boolean
  search?: string
}

export interface MaintenanceWindowQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published'
  startDate?: string
  endDate?: string
  search?: string
}

export interface AnnouncementQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'event' | 'maintenance' | 'update' | 'promotion' | 'alert'
  status?: 'draft' | 'published'
  pinned?: boolean
  search?: string
}

export interface VersionQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  tags?: string[]
  search?: string
}

// List Response Contracts
export interface FundingRuleListResponse {
  data: FundingRule[]
  total: number
  page: number
  pageSize: number
}

export interface MaintenanceWindowListResponse {
  data: MaintenanceWindow[]
  total: number
  page: number
  pageSize: number
}

export interface AnnouncementListResponse {
  data: Announcement[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface FundingRuleDetailResponse {
  rule: FundingRule
  historicalData?: any[]
  stats?: any
}

export interface MaintenanceWindowDetailResponse {
  window: MaintenanceWindow
  affectedUsers?: any[]
  notificationLogs?: any[]
}

export interface AnnouncementDetailResponse {
  announcement: Announcement
  deliveryStats?: any
  recipientList?: any[]
}

// Action Payload Contracts
export interface CreateFundingRulePayload {
  symbol: string
  period: number
  calculationRule: string
  enabled: boolean
  notes?: string
}

export interface UpdateFundingRulePayload extends Partial<CreateFundingRulePayload> {
  status?: 'draft' | 'published'
}

export interface CreateMaintenanceWindowPayload {
  title: string
  description: string
  startTime: string
  endTime: string
  affectedScope: string[]
  announcementPush: boolean
  notes?: string
}

export interface UpdateMaintenanceWindowPayload extends Partial<CreateMaintenanceWindowPayload> {
  status?: 'draft' | 'published'
}

export interface CreateAnnouncementPayload {
  title: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  content: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  type: 'event' | 'maintenance' | 'update' | 'promotion' | 'alert'
  pinned: boolean
  pushChannels: string[]
  publishTime?: string
  notes?: string
}

export interface UpdateAnnouncementPayload extends Partial<CreateAnnouncementPayload> {
  status?: 'draft' | 'published'
}

export interface PublishPayload {
  versionId?: string
  notes?: string
  scheduleTime?: string
}

export interface ImportPayload {
  file: File
  mode: 'merge' | 'replace' | 'update'
}

export interface ExportParams {
  format: 'json' | 'csv' | 'excel'
  params?: any
}

// Response Wrapper Contract
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      total: number
    }
  }
}

// Export Response Contract
export type ExportResponse = Blob

// Constants for validation
export const ANNOUNCEMENT_TYPE_OPTIONS = [
  { label: 'Event', value: 'event' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Update', value: 'update' },
  { label: 'Promotion', value: 'promotion' },
  { label: 'Alert', value: 'alert' },
] as const

export const FUNDING_RULE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const MAINTENANCE_WINDOW_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const PUSH_CHANNEL_OPTIONS = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push Notification', value: 'push' },
  { label: 'In-App', value: 'in_app' },
] as const

export const VERSION_TAGS = [
  { label: 'Hotfix', value: 'hotfix' },
  { label: 'Feature', value: 'feature' },
  { label: 'Bugfix', value: 'bugfix' },
  { label: 'Security', value: 'security' },
] as const