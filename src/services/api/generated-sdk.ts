import { apiClient } from './AdminApiClient'
import type {
  ApiResponse,
  PaginatedResponse,
  BatchResult,
  ExportParams,
  ImportPayload,
  PublishPayload,
} from '@/types/api'

export const feesApi = {
  feesTradingPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/trading/published`, { params })
  },
  feesTradingDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/trading/drafts`, { params })
  },
  feesTradingGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/trading/${id}`, { params })
  },
  feesTradingCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/trading/drafts`, payload)
  },
  feesTradingUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/fees/trading/drafts/${id}`, payload)
  },
  feesTradingDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/fees/trading/drafts/${id}`)
  },
  feesWithdrawalPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/withdrawal/published`, { params })
  },
  feesWithdrawalDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/withdrawal/drafts`, { params })
  },
  feesWithdrawalGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/withdrawal/${id}`, { params })
  },
  feesWithdrawalCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/withdrawal/drafts`, payload)
  },
  feesWithdrawalUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/fees/withdrawal/drafts/${id}`, payload)
  },
  feesWithdrawalDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/fees/withdrawal/drafts/${id}`)
  },
  feesVersionPublish(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/publish`, payload)
  },
  feesVersionGetVersions(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/versions`, { params })
  },
  feesVersionGetVersion(versionId: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/versions/${versionId}`, { params })
  },
  feesVersionRollback(versionId: string, payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/rollback/${versionId}`, payload)
  },
  feesVersionGetDiff(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/diff`, { params })
  },
  feesImportExportExport(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/export`, { params })
  },
  feesImportExportImport(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/import`, payload)
  },
  feesImportExportValidateImport(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/validate-import`, payload)
  },
  feesCalculatorCalculate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/fees/calculate`, payload)
  },
  feesCalculatorValidateConsistency(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/fees/validate-consistency`, { params })
  },
}

export const marginApi = {
  marginTemplatesPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/templates/published`, { params })
  },
  marginTemplatesDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/templates/drafts`, { params })
  },
  marginTemplatesGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/templates/${id}`, { params })
  },
  marginTemplatesCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/templates/drafts`, payload)
  },
  marginTemplatesUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/margin/templates/drafts/${id}`, payload)
  },
  marginTemplatesDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/margin/templates/drafts/${id}`)
  },
  marginBindingsPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/bindings/published`, { params })
  },
  marginBindingsDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/bindings/drafts`, { params })
  },
  marginBindingsUpdateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/bindings/drafts`, payload)
  },
  marginBindingsBatchBind(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/bindings/batch-bind`, payload)
  },
  marginBindingsBatchUnbind(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/bindings/batch-unbind`, payload)
  },
  marginVersionPublish(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/publish`, payload)
  },
  marginVersionGetVersions(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/versions`, { params })
  },
  marginVersionGetVersion(versionId: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/versions/${versionId}`, { params })
  },
  marginVersionRollback(versionId: string, payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/rollback/${versionId}`, payload)
  },
  marginVersionGetDiff(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/diff`, { params })
  },
  marginImpactGetImpactEstimation(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/impact-estimation`, { params })
  },
  marginImportExportExport(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/margin/export`, { params })
  },
  marginImportExportImport(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/import`, payload)
  },
  marginImportExportValidateImport(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/validate-import`, payload)
  },
  marginCalculatorCalculate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/margin/calculate`, payload)
  },
}

export const calendarApi = {
  calendarFundingPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/funding/published`, { params })
  },
  calendarFundingDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/funding/drafts`, { params })
  },
  calendarFundingGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/funding/${id}`, { params })
  },
  calendarFundingCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/funding/drafts`, payload)
  },
  calendarFundingUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/calendar/funding/drafts/${id}`, payload)
  },
  calendarFundingDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/calendar/funding/drafts/${id}`)
  },
  calendarMaintenancePublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/maintenance/published`, {
      params,
    })
  },
  calendarMaintenanceDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/maintenance/drafts`, { params })
  },
  calendarMaintenanceGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/maintenance/${id}`, { params })
  },
  calendarMaintenanceCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/maintenance/drafts`, payload)
  },
  calendarMaintenanceUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(
      `/admin/config/calendar/maintenance/drafts/${id}`,
      payload
    )
  },
  calendarMaintenanceDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/calendar/maintenance/drafts/${id}`)
  },
  calendarAnnouncementsPublished(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/announcements/published`, {
      params,
    })
  },
  calendarAnnouncementsDrafts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/announcements/drafts`, {
      params,
    })
  },
  calendarAnnouncementsGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/announcements/${id}`, { params })
  },
  calendarAnnouncementsCreateDraft(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/announcements/drafts`, payload)
  },
  calendarAnnouncementsUpdateDraft(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(
      `/admin/config/calendar/announcements/drafts/${id}`,
      payload
    )
  },
  calendarAnnouncementsDeleteDraft(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/calendar/announcements/drafts/${id}`)
  },
  calendarVersionPublish(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/publish`, payload)
  },
  calendarVersionGetVersions(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/versions`, { params })
  },
  calendarVersionGetVersion(versionId: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/versions/${versionId}`, {
      params,
    })
  },
  calendarVersionRollback(versionId: string, payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/rollback/${versionId}`, payload)
  },
  calendarVersionGetDiff(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/diff`, { params })
  },
  calendarValidationValidateConflicts(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/validate-conflicts`, { params })
  },
  calendarImportExportExport(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/calendar/export`, { params })
  },
  calendarImportExportImport(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/calendar/import`, payload)
  },
}

export const iconsApi = {
  iconsAssetsGet(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/assets`, { params })
  },
  iconsAssetsGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/assets/${id}`, { params })
  },
  iconsAssetsCreate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/assets`, payload)
  },
  iconsAssetsUpdate(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/icons/assets/${id}`, payload)
  },
  iconsAssetsDelete(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/icons/assets/${id}`)
  },
  iconsAssetsReplace(id: string, payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/assets/${id}/replace`, payload)
  },
  iconsAssetsValidate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/assets/validate`, payload)
  },
  iconsAssetsBulkUpload(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/assets/bulk-upload`, payload)
  },
  iconsAssetsBulkDelete(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/assets/bulk-delete`, payload)
  },
  iconsAssetsExport(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/assets/export`, { params })
  },
  iconsMappingsGet(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/mappings`, { params })
  },
  iconsMappingsGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/mappings/${id}`, { params })
  },
  iconsMappingsCreate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/icons/mappings`, payload)
  },
  iconsMappingsUpdate(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/icons/mappings/${id}`, payload)
  },
  iconsMappingsDelete(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/icons/mappings/${id}`)
  },
  iconsMappingsExport(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/icons/mappings/export`, { params })
  },
}

export const mappingsApi = {
  mappingsNavToApiGet(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/nav-to-api`, { params })
  },
  mappingsNavToApiGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/nav-to-api/${id}`, { params })
  },
  mappingsNavToApiCreate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/nav-to-api`, payload)
  },
  mappingsNavToApiUpdate(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/mappings/nav-to-api/${id}`, payload)
  },
  mappingsNavToApiDelete(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/mappings/nav-to-api/${id}`)
  },
  mappingsNavToApiValidate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/nav-to-api/validate`, payload)
  },
  mappingsNavToApiBulkSync(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/nav-to-api/bulk-sync`, payload)
  },
  mappingsRedirectsGet(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/redirects`, { params })
  },
  mappingsRedirectsGetById(id: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/redirects/${id}`, { params })
  },
  mappingsRedirectsCreate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/redirects`, payload)
  },
  mappingsRedirectsUpdate(id: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/mappings/redirects/${id}`, payload)
  },
  mappingsRedirectsDelete(id: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/mappings/redirects/${id}`)
  },
  mappingsRedirectsGetGraph(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/redirects/graph`, { params })
  },
  mappingsRedirectsValidate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/redirects/validate`, payload)
  },
  mappingsPageToApiGet(params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/page-to-api`, { params })
  },
  mappingsPageToApiGetByPageKey(pageKey: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/page-to-api/${pageKey}`, {
      params,
    })
  },
  mappingsPageToApiUpdate(pageKey: string, payload?: any) {
    return apiClient.put<ApiResponse<any>>(`/admin/config/mappings/page-to-api/${pageKey}`, payload)
  },
  mappingsPageToApiDelete(pageKey: string) {
    return apiClient.delete<ApiResponse<any>>(`/admin/config/mappings/page-to-api/${pageKey}`)
  },
  mappingsPageToApiScan(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/page-to-api/scan`, payload)
  },
  mappingsPageToApiValidate(payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/page-to-api/validate`, payload)
  },
  mappingsImportExportExport(type: string, params?: any) {
    return apiClient.get<ApiResponse<any>>(`/admin/config/mappings/${type}/export`, { params })
  },
  mappingsImportExportImport(type: string, payload?: any) {
    return apiClient.post<ApiResponse<any>>(`/admin/config/mappings/${type}/import`, payload)
  },
}
