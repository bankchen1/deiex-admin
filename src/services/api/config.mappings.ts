import { apiClient } from './AdminApiClient'

// Types
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

export interface PageApiRelation {
  pageKey: string
  pageName: string
  apiEndpoints: string[]
  dependencies: string[]
  status: 'active' | 'broken'
}

export interface MappingValidationResult {
  valid: boolean
  brokenLinks: string[]
  redundantLinks: string[]
  warnings: string[]
}

export interface BulkSyncPayload {
  mappings: Partial<NavToApiMapping>[]
  mode: 'merge' | 'replace'
}

// API Service
export const mappingsApi = {
  // Nav to API mappings
  getNavMappings(params?: { status?: string; search?: string }) {
    return apiClient.get<{ data: NavToApiMapping[]; total: number }>(
      '/admin/config/mappings/nav-to-api',
      { params }
    )
  },

  getNavMappingById(id: string) {
    return apiClient.get<{ data: NavToApiMapping }>(`/admin/config/mappings/nav-to-api/${id}`)
  },

  createNavMapping(payload: Omit<NavToApiMapping, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<{ data: NavToApiMapping }>('/admin/config/mappings/nav-to-api', payload)
  },

  updateNavMapping(id: string, payload: Partial<NavToApiMapping>) {
    return apiClient.put<{ data: NavToApiMapping }>(
      `/admin/config/mappings/nav-to-api/${id}`,
      payload
    )
  },

  deleteNavMapping(id: string) {
    return apiClient.delete(`/admin/config/mappings/nav-to-api/${id}`)
  },

  validateNavMappings() {
    return apiClient.post<{ data: MappingValidationResult }>(
      '/admin/config/mappings/nav-to-api/validate'
    )
  },

  bulkSyncNavMappings(payload: BulkSyncPayload) {
    return apiClient.post<{ data: { success: number; failed: number } }>(
      '/admin/config/mappings/nav-to-api/bulk-sync',
      payload
    )
  },

  // Route redirects
  getRouteRedirects(params?: { search?: string; page?: number; pageSize?: number }) {
    return apiClient.get<{ data: RouteRedirect[]; total: number }>(
      '/admin/config/mappings/redirects',
      { params }
    )
  },

  getRedirectById(id: string) {
    return apiClient.get<{ data: RouteRedirect }>(`/admin/config/mappings/redirects/${id}`)
  },

  createRedirect(payload: Omit<RouteRedirect, 'id' | 'hitCount' | 'createdAt'>) {
    return apiClient.post<{ data: RouteRedirect }>('/admin/config/mappings/redirects', payload)
  },

  updateRedirect(id: string, payload: Partial<RouteRedirect>) {
    return apiClient.put<{ data: RouteRedirect }>(`/admin/config/mappings/redirects/${id}`, payload)
  },

  deleteRedirect(id: string) {
    return apiClient.delete(`/admin/config/mappings/redirects/${id}`)
  },

  getRedirectGraph() {
    return apiClient.get<{ data: { nodes: any[]; edges: any[] } }>(
      '/admin/config/mappings/redirects/graph'
    )
  },

  validateRedirects() {
    return apiClient.post<{ data: MappingValidationResult }>(
      '/admin/config/mappings/redirects/validate'
    )
  },

  // Page to API relations
  getPageApiRelations(params?: { status?: string; search?: string }) {
    return apiClient.get<{ data: PageApiRelation[]; total: number }>(
      '/admin/config/mappings/page-to-api',
      { params }
    )
  },

  getPageApiRelation(pageKey: string) {
    return apiClient.get<{ data: PageApiRelation }>(`/admin/config/mappings/page-to-api/${pageKey}`)
  },

  updatePageApiRelation(pageKey: string, payload: Partial<PageApiRelation>) {
    return apiClient.put<{ data: PageApiRelation }>(
      `/admin/config/mappings/page-to-api/${pageKey}`,
      payload
    )
  },

  scanPageApiRelations() {
    return apiClient.post<{ data: { scanned: number; updated: number } }>(
      '/admin/config/mappings/page-to-api/scan'
    )
  },

  validatePageApiRelations() {
    return apiClient.post<{ data: MappingValidationResult }>(
      '/admin/config/mappings/page-to-api/validate'
    )
  },

  exportMappings(type: 'nav-to-api' | 'redirects' | 'page-to-api') {
    return apiClient.get<Blob>(`/admin/config/mappings/${type}/export`, {
      responseType: 'blob',
    })
  },

  importMappings(type: 'nav-to-api' | 'redirects' | 'page-to-api', file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<{ data: { success: number; failed: number } }>(
      `/admin/config/mappings/${type}/import`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
  },
}
