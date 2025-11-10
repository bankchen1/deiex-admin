/**
 * Risk Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Risk Condition Entity Contracts
export interface RiskCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}

// Risk Action Entity Contracts
export interface RiskAction {
  type: 'block' | 'review' | 'alert' | 'tag'
  params: Record<string, any>
}

// Risk Rule Entity Contracts
export interface RiskRule {
  id: string
  name: string
  description?: string
  conditions: RiskCondition[]
  actions: RiskAction[]
  priority: number
  enabled: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  matchCount?: number
  lastMatchedAt?: string
}

// Risk Limit Entity Contracts
export interface RiskLimit {
  id: string
  name: string
  description?: string
  scope: 'user' | 'country' | 'device' | 'currency'
  scopeValue?: string
  type: 'deposit' | 'withdrawal' | 'trading' | 'position'
  period: 'daily' | 'weekly' | 'monthly' | 'lifetime'
  threshold: string
  currency?: string
  enabled: boolean
  effectiveFrom?: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  currentUsage?: string
  usagePercentage?: number
}

// Blacklist Entry Entity Contracts
export interface BlacklistEntry {
  id: string
  type: 'address' | 'device' | 'ip' | 'country' | 'email' | 'phone'
  value: string
  reason: string
  source: 'manual' | 'auto' | 'import'
  status: 'active' | 'expired' | 'removed'
  addedBy?: string
  addedAt: string
  expiresAt?: string
  removedAt?: string
  removedBy?: string
  notes?: string
  matchCount?: number
  lastMatchedAt?: string
}

// Risk Simulation Result Contracts
export interface RiskSimulationResult {
  matched: boolean
  matchedRules: Array<{
    ruleId: string
    ruleName: string
    actions: RiskAction[]
  }>
  actions: RiskAction[]
  timestamp: string
}

// List Response Contracts
export interface RiskRuleListResponse {
  data: RiskRule[]
  total: number
  page: number
  pageSize: number
}

export interface RiskLimitListResponse {
  data: RiskLimit[]
  total: number
  page: number
  pageSize: number
}

export interface BlacklistEntryListResponse {
  data: BlacklistEntry[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface RiskRuleDetailResponse {
  rule: RiskRule
  auditTrail?: any[]
}

export interface RiskLimitDetailResponse {
  limit: RiskLimit
  auditTrail?: any[]
}

export interface BlacklistEntryDetailResponse {
  entry: BlacklistEntry
  auditTrail?: any[]
}

// Query Contracts
export interface RiskRuleQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published'
  enabled?: boolean
  search?: string
  startDate?: string
  endDate?: string
}

export interface RiskLimitQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'deposit' | 'withdrawal' | 'trading' | 'position'
  scope?: 'user' | 'country' | 'device' | 'currency'
  enabled?: boolean
  search?: string
  startDate?: string
  endDate?: string
}

export interface BlacklistEntryQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'address' | 'device' | 'ip' | 'country' | 'email' | 'phone'
  status?: 'active' | 'expired' | 'removed'
  source?: 'manual' | 'auto' | 'import'
  search?: string
  startDate?: string
  endDate?: string
}

// Action Payload Contracts
export interface CreateRiskRulePayload {
  name: string
  description?: string
  conditions: RiskCondition[]
  actions: RiskAction[]
  priority?: number
  enabled?: boolean
}

export interface UpdateRiskRulePayload {
  name?: string
  description?: string
  conditions?: RiskCondition[]
  actions?: RiskAction[]
  priority?: number
  enabled?: boolean
}

export interface CreateRiskLimitPayload {
  name: string
  description?: string
  scope: 'user' | 'country' | 'device' | 'currency'
  scopeValue?: string
  type: 'deposit' | 'withdrawal' | 'trading' | 'position'
  period: 'daily' | 'weekly' | 'monthly' | 'lifetime'
  threshold: string
  currency?: string
  enabled?: boolean
  effectiveFrom?: string
  effectiveTo?: string
}

export interface UpdateRiskLimitPayload {
  name?: string
  description?: string
  scope?: 'user' | 'country' | 'device' | 'currency'
  scopeValue?: string
  type?: 'deposit' | 'withdrawal' | 'trading' | 'position'
  period?: 'daily' | 'weekly' | 'monthly' | 'lifetime'
  threshold?: string
  currency?: string
  enabled?: boolean
  effectiveFrom?: string
  effectiveTo?: string
}

export interface CreateBlacklistEntryPayload {
  type: 'address' | 'device' | 'ip' | 'country' | 'email' | 'phone'
  value: string
  reason: string
  source?: 'manual' | 'auto' | 'import'
  expiresAt?: string
  notes?: string
}

export interface UpdateBlacklistEntryPayload {
  reason?: string
  expiresAt?: string
  notes?: string
}

export interface RiskSimulationPayload {
  type: 'user' | 'transaction'
  data: Record<string, any>
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

// Constants for field validation
export const RISK_CONDITION_OPERATORS = [
  { label: 'Equals', value: 'eq' },
  { label: 'Not Equals', value: 'ne' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Greater Than or Equal', value: 'gte' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Less Than or Equal', value: 'lte' },
  { label: 'In', value: 'in' },
  { label: 'Contains', value: 'contains' },
] as const

export const RISK_ACTION_TYPES = [
  { label: 'Block', value: 'block' },
  { label: 'Review', value: 'review' },
  { label: 'Alert', value: 'alert' },
  { label: 'Tag', value: 'tag' },
] as const

export const RISK_RULE_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const RISK_LIMIT_TYPES = [
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdrawal', value: 'withdrawal' },
  { label: 'Trading', value: 'trading' },
  { label: 'Position', value: 'position' },
] as const

export const RISK_LIMIT_SCOPES = [
  { label: 'User', value: 'user' },
  { label: 'Country', value: 'country' },
  { label: 'Device', value: 'device' },
  { label: 'Currency', value: 'currency' },
] as const

export const RISK_LIMIT_PERIODS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Lifetime', value: 'lifetime' },
] as const

export const BLACKLIST_ENTRY_TYPES = [
  { label: 'Address', value: 'address' },
  { label: 'Device', value: 'device' },
  { label: 'IP', value: 'ip' },
  { label: 'Country', value: 'country' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
] as const

export const BLACKLIST_ENTRY_SOURCES = [
  { label: 'Manual', value: 'manual' },
  { label: 'Auto', value: 'auto' },
  { label: 'Import', value: 'import' },
] as const

export const BLACKLIST_ENTRY_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Removed', value: 'removed' },
] as const
