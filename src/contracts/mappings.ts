/**
 * Mappings Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Navigation to API Mapping Entity
export interface NavToApiMapping {
  id: string
  navKey: string
  navLabel: string
  apiEndpoint: string
  method: string
  description?: string
  status: 'active' | 'deprecated'
  createdAt: string
  updatedAt: string
}

// Route Redirect Entity
export interface RouteRedirect {
  id: string
  oldPath: string
  newPath: string
  statusCode: 301 | 302
  reason?: string
  effectiveFrom: string
  effectiveTo?: string
  hitCount: number
  createdAt: string
}

// Page API Relation Entity
export interface PageApiRelation {
  pageKey: string
  pageName: string
  apiEndpoints: string[]
  dependencies: string[]
  status: 'active' | 'broken'
}

// Validation Result Entity
export interface MappingValidationResult {
  valid: boolean
  brokenLinks: string[]
  redundantLinks: string[]
  warnings: string[]
}

// Bulk Sync Payload
export interface BulkSyncPayload {
  mappings: Partial<NavToApiMapping>[]
  mode: 'merge' | 'replace'
}

// Query Parameter Contracts
export interface NavMappingQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'deprecated'
  navKey?: string
  search?: string
}

export interface RedirectQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
  search?: string
}

export interface PageApiRelationQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'broken'
  search?: string
}

// Response Contracts
export interface NavMappingListResponse {
  data: NavToApiMapping[]
  total: number
  page: number
  pageSize: number
}

export interface RedirectListResponse {
  data: RouteRedirect[]
  total: number
  page: number
  pageSize: number
}

export interface PageApiRelationListResponse {
  data: PageApiRelation[]
  total: number
  page: number
  pageSize: number
}

// Action Payloads
export interface CreateNavMappingPayload {
  navKey: string
  navLabel: string
  apiEndpoint: string
  method: string
  description?: string
}

export interface UpdateNavMappingPayload extends Partial<CreateNavMappingPayload> {
  status?: 'active' | 'deprecated'
}

export interface CreateRedirectPayload {
  oldPath: string
  newPath: string
  statusCode: 301 | 302
  reason?: string
  effectiveFrom: string
  effectiveTo?: string
}

export interface UpdateRedirectPayload extends Partial<CreateRedirectPayload> {}

export interface UpdatePageApiRelationPayload {
  apiEndpoints?: string[]
  dependencies?: string[]
  status?: 'active' | 'broken'
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
