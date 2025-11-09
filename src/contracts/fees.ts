/**
 * Fees Module Contracts
 * 
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Trading Fee Template Entity
export interface TradingFeeTemplate {
  id: string
  vipLevel: number
  makerRate: number
  takerRate: number
  inheritFromPrevious?: boolean
  description?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Withdrawal Fee Template Entity
export interface WithdrawalFeeTemplate {
  id: string
  currency: string
  chain: string
  fixedFee: string
  percentageFee: number
  minFee: string
  dailyLimit: string
  description?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Fee Query Parameters
export interface FeeQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published'
  search?: string
}

// Trading Fee Query Parameters
export interface TradingFeeQueryParams extends FeeQueryParams {
  vipLevel?: number
}

// Withdrawal Fee Query Parameters
export interface WithdrawalFeeQueryParams extends FeeQueryParams {
  currency?: string
  chain?: string
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

// Version Query Parameters
export interface VersionQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  tags?: string[]
  search?: string
}

// List Response Contracts
export interface TradingFeeTemplateListResponse {
  data: TradingFeeTemplate[]
  total: number
  page: number
  pageSize: number
}

export interface WithdrawalFeeTemplateListResponse {
  data: WithdrawalFeeTemplate[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface TradingFeeTemplateDetailResponse {
  template: TradingFeeTemplate
  historicalData?: any[]
  stats?: any
}

export interface WithdrawalFeeTemplateDetailResponse {
  template: WithdrawalFeeTemplate
  historicalData?: any[]
  stats?: any
}

// Action Payload Contracts
export interface CreateTradingFeeTemplatePayload {
  vipLevel: number
  makerRate: number
  takerRate: number
  inheritFromPrevious?: boolean
  description?: string
}

export interface UpdateTradingFeeTemplatePayload extends Partial<CreateTradingFeeTemplatePayload> {
  status?: 'draft' | 'published'
}

export interface CreateWithdrawalFeeTemplatePayload {
  currency: string
  chain: string
  fixedFee: string
  percentageFee: number
  minFee: string
  dailyLimit: string
  description?: string
}

export interface UpdateWithdrawalFeeTemplatePayload extends Partial<CreateWithdrawalFeeTemplatePayload> {
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
  status?: 'draft' | 'published'
}

export interface ValidateImportPayload {
  file: File
}

export interface CalculateFeeParams {
  type: 'trading' | 'withdrawal'
  symbol?: string
  currency?: string
  chain?: string
  amount: string
  userId?: string
  vipLevel?: number
}

export interface FeeCalculationResult {
  type: 'trading' | 'withdrawal'
  vipLevel?: number
  makerFee?: string
  takerFee?: string
  withdrawalFee?: string
  effectiveRate?: number
  breakdown?: {
    fixedFee?: string
    percentageFee?: string
    totalFee?: string
  }
}

export interface ValidateConsistencyResult {
  isValid: boolean
  issues: {
    templateId: string
    field: string
    currentValue: any
    expectedValue: any
    severity: 'warning' | 'error'
  }[]
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
export const FEE_TEMPLATE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const FEE_CALCULATION_TYPE_OPTIONS = [
  { label: 'Trading', value: 'trading' },
  { label: 'Withdrawal', value: 'withdrawal' },
] as const

export const FEE_IMPORT_MODE_OPTIONS = [
  { label: 'Merge', value: 'merge' },
  { label: 'Replace', value: 'replace' },
  { label: 'Update', value: 'update' },
] as const

export const VERSION_TAGS = [
  { label: 'Hotfix', value: 'hotfix' },
  { label: 'Feature', value: 'feature' },
  { label: 'Bugfix', value: 'bugfix' },
  { label: 'Security', value: 'security' },
] as const

export const FEE_EXPORT_FORMATS = [
  { label: 'JSON', value: 'json' },
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'excel' },
] as const