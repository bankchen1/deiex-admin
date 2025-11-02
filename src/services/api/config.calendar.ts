import { apiClient } from './AdminApiClient'
import type { ApiResponse } from '@/types/api'
import type { FundingRule, MaintenanceWindow, Announcement, Version } from '@/types/models'

export const calendarApi = {
  // Funding Rules
  getPublishedFunding(params?: any) {
    return apiClient.get<ApiResponse<{ data: FundingRule[]; total: number }>>(
      '/admin/config/calendar/funding/published',
      { params }
    )
  },

  getDraftFunding(params?: any) {
    return apiClient.get<ApiResponse<{ data: FundingRule[]; total: number }>>(
      '/admin/config/calendar/funding/drafts',
      { params }
    )
  },

  getFundingById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/calendar/funding/drafts/${id}`
      : `/admin/config/calendar/funding/published/${id}`
    return apiClient.get<ApiResponse<FundingRule>>(endpoint)
  },

  createDraftFunding(payload: Partial<FundingRule>) {
    return apiClient.post<ApiResponse<FundingRule>>(
      '/admin/config/calendar/funding/drafts',
      payload
    )
  },

  updateDraftFunding(id: string, payload: Partial<FundingRule>) {
    return apiClient.put<ApiResponse<FundingRule>>(
      `/admin/config/calendar/funding/drafts/${id}`,
      payload
    )
  },

  deleteDraftFunding(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/calendar/funding/drafts/${id}`)
  },

  // Maintenance Windows
  getPublishedMaintenance(params?: any) {
    return apiClient.get<ApiResponse<{ data: MaintenanceWindow[]; total: number }>>(
      '/admin/config/calendar/maintenance/published',
      { params }
    )
  },

  getDraftMaintenance(params?: any) {
    return apiClient.get<ApiResponse<{ data: MaintenanceWindow[]; total: number }>>(
      '/admin/config/calendar/maintenance/drafts',
      { params }
    )
  },

  getMaintenanceById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/calendar/maintenance/drafts/${id}`
      : `/admin/config/calendar/maintenance/published/${id}`
    return apiClient.get<ApiResponse<MaintenanceWindow>>(endpoint)
  },

  createDraftMaintenance(payload: Partial<MaintenanceWindow>) {
    return apiClient.post<ApiResponse<MaintenanceWindow>>(
      '/admin/config/calendar/maintenance/drafts',
      payload
    )
  },

  updateDraftMaintenance(id: string, payload: Partial<MaintenanceWindow>) {
    return apiClient.put<ApiResponse<MaintenanceWindow>>(
      `/admin/config/calendar/maintenance/drafts/${id}`,
      payload
    )
  },

  deleteDraftMaintenance(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/calendar/maintenance/drafts/${id}`)
  },

  // Announcements
  getPublishedAnnouncements(params?: any) {
    return apiClient.get<ApiResponse<{ data: Announcement[]; total: number }>>(
      '/admin/config/calendar/announcements/published',
      { params }
    )
  },

  getDraftAnnouncements(params?: any) {
    return apiClient.get<ApiResponse<{ data: Announcement[]; total: number }>>(
      '/admin/config/calendar/announcements/drafts',
      { params }
    )
  },

  getAnnouncementById(id: string, isDraft = false) {
    const endpoint = isDraft
      ? `/admin/config/calendar/announcements/drafts/${id}`
      : `/admin/config/calendar/announcements/published/${id}`
    return apiClient.get<ApiResponse<Announcement>>(endpoint)
  },

  createDraftAnnouncement(payload: Partial<Announcement>) {
    return apiClient.post<ApiResponse<Announcement>>(
      '/admin/config/calendar/announcements/drafts',
      payload
    )
  },

  updateDraftAnnouncement(id: string, payload: Partial<Announcement>) {
    return apiClient.put<ApiResponse<Announcement>>(
      `/admin/config/calendar/announcements/drafts/${id}`,
      payload
    )
  },

  deleteDraftAnnouncement(id: string) {
    return apiClient.delete<ApiResponse<void>>(`/admin/config/calendar/announcements/drafts/${id}`)
  },

  // Version Control
  getVersions() {
    return apiClient.get<ApiResponse<Version[]>>('/admin/config/calendar/versions')
  },

  getDiff() {
    return apiClient.get<ApiResponse<any>>('/admin/config/calendar/diff')
  },

  publish(payload: { notes: string; tags?: string[] }) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      '/admin/config/calendar/publish',
      payload
    )
  },

  rollback(versionId: string) {
    return apiClient.post<ApiResponse<{ version: string }>>(
      `/admin/config/calendar/rollback/${versionId}`
    )
  },

  // Time Conflict Validation
  validateTimeConflicts(payload: any) {
    return apiClient.post<ApiResponse<{ conflicts: any[] }>>(
      '/admin/config/calendar/validate-conflicts',
      payload
    )
  },

  // Import/Export
  exportData(params: { format: string; status: string }) {
    return apiClient.get<Blob>('/admin/config/calendar/export', {
      params,
      responseType: 'blob',
    })
  },

  importData(payload: { file: File; format: string }) {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('format', payload.format)

    return apiClient.post<ApiResponse<{ imported: number; failed: number }>>(
      '/admin/config/calendar/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },
}
