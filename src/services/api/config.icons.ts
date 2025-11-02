import { apiClient } from './AdminApiClient'
import type { ApiResponse, PaginationParams, PaginationResponse } from '@/types/api'

// Types
export interface IconAsset {
  id: string
  name: string
  type: 'svg' | 'png'
  lightUrl: string
  darkUrl?: string
  cdnPath: string
  width: number
  height: number
  fileSize: number
  hasTransparency: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface IconMapping {
  id: string
  symbol: string
  iconId: string
  iconName: string
  iconUrl: string
  createdAt: string
  updatedAt: string
}

export interface IconAssetQueryParams extends PaginationParams {
  name?: string
  type?: 'svg' | 'png'
  tags?: string[]
}

export interface IconMappingQueryParams extends PaginationParams {
  symbol?: string
  iconId?: string
}

export interface CreateIconAssetPayload {
  name: string
  type: 'svg' | 'png'
  lightFile: File
  darkFile?: File
  tags?: string[]
}

export interface UpdateIconAssetPayload {
  name?: string
  tags?: string[]
}

export interface CreateIconMappingPayload {
  symbol: string
  iconId: string
}

export interface BulkUploadPayload {
  files: File[]
  autoNaming: boolean
  prefix?: string
}

export interface BulkUploadResult {
  success: number
  failed: number
  errors: Array<{
    filename: string
    error: string
  }>
  assets: IconAsset[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  dimensions?: {
    width: number
    height: number
  }
  fileSize?: number
  hasTransparency?: boolean
}

// API Service
export const iconsApi = {
  // Icon Assets
  getAssets(params: IconAssetQueryParams) {
    return apiClient.get<ApiResponse<PaginationResponse<IconAsset>>>('/admin/config/icons/assets', {
      params,
    })
  },

  getAssetById(id: string) {
    return apiClient.get<ApiResponse<IconAsset>>(`/admin/config/icons/assets/${id}`)
  },

  createAsset(payload: FormData) {
    return apiClient.post<ApiResponse<IconAsset>>('/admin/config/icons/assets', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateAsset(id: string, payload: UpdateIconAssetPayload) {
    return apiClient.put<ApiResponse<IconAsset>>(`/admin/config/icons/assets/${id}`, payload)
  },

  deleteAsset(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/icons/assets/${id}`)
  },

  replaceAsset(id: string, payload: FormData) {
    return apiClient.post<ApiResponse<IconAsset>>(
      `/admin/config/icons/assets/${id}/replace`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  validateAsset(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<ValidationResult>>(
      '/admin/config/icons/assets/validate',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  // Icon Mappings
  getMappings(params: IconMappingQueryParams) {
    return apiClient.get<ApiResponse<PaginationResponse<IconMapping>>>(
      '/admin/config/icons/mappings',
      { params }
    )
  },

  getMappingById(id: string) {
    return apiClient.get<ApiResponse<IconMapping>>(`/admin/config/icons/mappings/${id}`)
  },

  createMapping(payload: CreateIconMappingPayload) {
    return apiClient.post<ApiResponse<IconMapping>>('/admin/config/icons/mappings', payload)
  },

  updateMapping(id: string, payload: Partial<CreateIconMappingPayload>) {
    return apiClient.put<ApiResponse<IconMapping>>(`/admin/config/icons/mappings/${id}`, payload)
  },

  deleteMapping(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/icons/mappings/${id}`)
  },

  // Bulk Operations
  bulkUpload(payload: FormData) {
    return apiClient.post<ApiResponse<BulkUploadResult>>(
      '/admin/config/icons/assets/bulk-upload',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  bulkDelete(ids: string[]) {
    return apiClient.post<ApiResponse<{ deleted: number }>>(
      '/admin/config/icons/assets/bulk-delete',
      { ids }
    )
  },

  // Export
  exportAssets(params: IconAssetQueryParams) {
    return apiClient.get<Blob>('/admin/config/icons/assets/export', {
      params,
      responseType: 'blob',
    })
  },

  exportMappings(params: IconMappingQueryParams) {
    return apiClient.get<Blob>('/admin/config/icons/mappings/export', {
      params,
      responseType: 'blob',
    })
  },
}
