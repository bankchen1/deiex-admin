/**
 * Icons Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Icon Asset Entity
export interface IconAsset {
  id: string
  name: string
  category: string
  type: 'svg' | 'png' | 'jpg' | 'gif' | 'webp'
  size: string
  width: number
  height: number
  tags: string[]
  version: string
  status: 'draft' | 'published'
  source: string
  uploadDate: string
  uploader: string
  fileUrl: string
  thumbnailUrl: string
  license?: string
  copyright?: string
  usageRights?: string
}

// Icon Mapping Entity
export interface IconMapping {
  id: string
  key: string
  assetId: string
  assetName?: string
  context: string // Where the icon is used (e.g., 'navbar', 'button', 'status')
  variant?: string // 'primary', 'secondary', 'success', etc.
  scale: number // size multiplier
  color?: string // override color
  description?: string
  status: 'active' | 'deprecated'
  createdAt: string
  updatedAt: string
}

// Query Parameter Contracts
export interface IconAssetQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  category?: string
  type?: 'svg' | 'png' | 'jpg' | 'gif' | 'webp'
  status?: 'draft' | 'published'
  tags?: string[]
  search?: string
}

export interface IconMappingQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  context?: string
  assetId?: string
  status?: 'active' | 'deprecated'
  search?: string
}

// List Response Contracts
export interface IconAssetListResponse {
  data: IconAsset[]
  total: number
  page: number
  pageSize: number
}

export interface IconMappingListResponse {
  data: IconMapping[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface IconAssetDetailResponse {
  asset: IconAsset
  usageStats?: {
    usedIn: string[]
    usageCount: number
    lastUsedAt: string
  }
}

export interface IconMappingDetailResponse {
  mapping: IconMapping
  asset?: IconAsset
  usageStats?: {
    renderCount: number
    lastRenderedAt: string
  }
}

// Action Payload Contracts
export interface CreateIconAssetPayload {
  name: string
  category: string
  type: 'svg' | 'png' | 'jpg' | 'gif' | 'webp'
  tags: string[]
  description?: string
  file: File
}

export interface UpdateIconAssetPayload {
  name?: string
  category?: string
  tags?: string[]
  description?: string
  status?: 'draft' | 'published'
}

export interface CreateIconMappingPayload {
  key: string
  assetId: string
  context: string
  variant?: string
  scale?: number
  color?: string
  description?: string
}

export interface UpdateIconMappingPayload {
  assetId?: string
  context?: string
  variant?: string
  scale?: number
  color?: string
  description?: string
  status?: 'active' | 'deprecated'
}

export interface BulkUploadPayload {
  files: File[]
  category: string
  tags: string[]
}

export interface ValidateIconPayload {
  file: File
}

export interface PublishIconPayload {
  id: string
  notes?: string
}

// Validation Result Contract
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  metadata: {
    size: number
    mimeType: string
    dimensions?: { width: number; height: number }
    accessibility?: {
      hasAltText: boolean
      hasTitle: boolean
    }
  }
}

// Bulk Upload Result Contract
export interface BulkUploadResult {
  success: number
  failed: number
  errors: Array<{
    filename: string
    error: string
  }>
  createdAssets: IconAsset[]
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
export type IconExportResponse = Blob

// Constants for validation
export const ICON_CATEGORIES = [
  { label: 'Navigation', value: 'navigation' },
  { label: 'Buttons', value: 'buttons' },
  { label: 'Status', value: 'status' },
  { label: 'Actions', value: 'actions' },
  { label: 'Social', value: 'social' },
  { label: 'Payment', value: 'payment' },
  { label: 'Trading', value: 'trading' },
  { label: 'Finance', value: 'finance' },
  { label: 'Settings', value: 'settings' },
  { label: 'User', value: 'user' },
] as const

export const ICON_TYPES = [
  { label: 'SVG', value: 'svg' },
  { label: 'PNG', value: 'png' },
  { label: 'JPG', value: 'jpg' },
  { label: 'GIF', value: 'gif' },
  { label: 'WEBP', value: 'webp' },
] as const

export const ICON_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
] as const

export const ICON_MAPPING_CONTEXTS = [
  { label: 'Navbar', value: 'navbar' },
  { label: 'Button', value: 'button' },
  { label: 'Status Indicator', value: 'status-indicator' },
  { label: 'Menu Item', value: 'menu-item' },
  { label: 'Tab', value: 'tab' },
  { label: 'Card Header', value: 'card-header' },
] as const

export const ICON_VARIANTS = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
] as const

export const ICON_SCALES = [
  { label: 'Small (0.8x)', value: 0.8 },
  { label: 'Normal (1x)', value: 1 },
  { label: 'Medium (1.2x)', value: 1.2 },
  { label: 'Large (1.5x)', value: 1.5 },
  { label: 'Extra Large (2x)', value: 2 },
] as const
