import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  listFundingRules,
  getFundingRuleById,
  createFundingRule,
  updateFundingRule,
  deleteFundingRule,
  listMaintenanceWindows,
  getMaintenanceWindowById,
  createMaintenanceWindow,
  updateMaintenanceWindow,
  deleteMaintenanceWindow,
  listAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
  getVersionHistory,
  exportCalendarConfig,
  importCalendarConfig,
  type FundingRuleQueryParams,
  type MaintenanceWindowQueryParams,
  type AnnouncementQueryParams,
  type VersionQueryParams,
  type CreateFundingRulePayload,
  type UpdateFundingRulePayload,
  type CreateMaintenanceWindowPayload,
  type UpdateMaintenanceWindowPayload,
  type CreateAnnouncementPayload,
  type UpdateAnnouncementPayload,
  type PublishPayload,
  type ImportPayload,
  type ExportParams,
} from '@/services/api/facade'
import { message } from 'ant-design-vue'
import type { 
  FundingRule, 
  MaintenanceWindow, 
  Announcement, 
  Version 
} from '@/contracts/calendar'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funding Rules
  const publishedFunding = ref<FundingRule[]>([])
  const draftFunding = ref<FundingRule[]>([])
  const currentFunding = ref<FundingRule | null>(null)
  const publishedFundingTotal = ref(0)
  const draftFundingTotal = ref(0)

  // Maintenance Windows
  const publishedMaintenance = ref<MaintenanceWindow[]>([])
  const draftMaintenance = ref<MaintenanceWindow[]>([])
  const currentMaintenance = ref<MaintenanceWindow | null>(null)
  const publishedMaintenanceTotal = ref(0)
  const draftMaintenanceTotal = ref(0)

  // Announcements
  const publishedAnnouncements = ref<Announcement[]>([])
  const draftAnnouncements = ref<Announcement[]>([])
  const currentAnnouncement = ref<Announcement | null>(null)
  const publishedAnnouncementsTotal = ref(0)
  const draftAnnouncementsTotal = ref(0)

  // Version Control
  const currentVersion = ref<string>('')
  const versions = ref<Version[]>([])
  const diffData = ref<any>(null)

  // Getters
  const hasPublishedFunding = computed(() => publishedFunding.value.length > 0)
  const hasDraftFunding = computed(() => draftFunding.value.length > 0)
  const hasPublishedMaintenance = computed(() => publishedMaintenance.value.length > 0)
  const hasDraftMaintenance = computed(() => draftMaintenance.value.length > 0)
  const hasPublishedAnnouncements = computed(() => publishedAnnouncements.value.length > 0)
  const hasDraftAnnouncements = computed(() => draftAnnouncements.value.length > 0)
  const draftExists = computed(
    () =>
      draftFunding.value.length > 0 ||
      draftMaintenance.value.length > 0 ||
      draftAnnouncements.value.length > 0
  )

  // Funding Rule Actions
  async function fetchPublishedFunding(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getPublishedFunding(params)
      publishedFunding.value = response.data.data
      publishedFundingTotal.value = response.data.total
      if (response.data.data.length > 0 && response.data.data[0]) {
        currentVersion.value = response.data.data[0].version
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published funding rules'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftFunding(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getDraftFunding(params)
      draftFunding.value = response.data.data
      draftFundingTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft funding rules'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFundingById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getFundingById(id, isDraft)
      currentFunding.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch funding rule'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftFunding(payload: Partial<FundingRule>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.createDraftFunding(payload)
      draftFunding.value.unshift(response.data)
      message.success('Funding rule created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create funding rule'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftFunding(id: string, payload: Partial<FundingRule>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.updateDraftFunding(id, payload)
      const index = draftFunding.value.findIndex((item: FundingRule) => item.id === id)
      if (index !== -1) {
        draftFunding.value[index] = response.data
      }
      if (currentFunding.value?.id === id) {
        currentFunding.value = response.data
      }
      message.success('Funding rule updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update funding rule'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftFunding(id: string) {
    loading.value = true
    error.value = null
    try {
      await calendarApi.deleteDraftFunding(id)
      draftFunding.value = draftFunding.value.filter((item: FundingRule) => item.id !== id)
      message.success('Funding rule deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete funding rule'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Maintenance Window Actions
  async function fetchPublishedMaintenance(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getPublishedMaintenance(params)
      publishedMaintenance.value = response.data.data
      publishedMaintenanceTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published maintenance windows'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftMaintenance(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getDraftMaintenance(params)
      draftMaintenance.value = response.data.data
      draftMaintenanceTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft maintenance windows'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMaintenanceById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getMaintenanceById(id, isDraft)
      currentMaintenance.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch maintenance window'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftMaintenance(payload: Partial<MaintenanceWindow>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.createDraftMaintenance(payload)
      draftMaintenance.value.unshift(response.data)
      message.success('Maintenance window created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create maintenance window'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftMaintenance(id: string, payload: Partial<MaintenanceWindow>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.updateDraftMaintenance(id, payload)
      const index = draftMaintenance.value.findIndex((item: MaintenanceWindow) => item.id === id)
      if (index !== -1) {
        draftMaintenance.value[index] = response.data
      }
      if (currentMaintenance.value?.id === id) {
        currentMaintenance.value = response.data
      }
      message.success('Maintenance window updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update maintenance window'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftMaintenance(id: string) {
    loading.value = true
    error.value = null
    try {
      await calendarApi.deleteDraftMaintenance(id)
      draftMaintenance.value = draftMaintenance.value.filter(
        (item: MaintenanceWindow) => item.id !== id
      )
      message.success('Maintenance window deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete maintenance window'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Announcement Actions
  async function fetchPublishedAnnouncements(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getPublishedAnnouncements(params)
      publishedAnnouncements.value = response.data.data
      publishedAnnouncementsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published announcements'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftAnnouncements(params?: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getDraftAnnouncements(params)
      draftAnnouncements.value = response.data.data
      draftAnnouncementsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft announcements'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAnnouncementById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getAnnouncementById(id, isDraft)
      currentAnnouncement.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch announcement'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftAnnouncement(payload: Partial<Announcement>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.createDraftAnnouncement(payload)
      draftAnnouncements.value.unshift(response.data)
      message.success('Announcement created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create announcement'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftAnnouncement(id: string, payload: Partial<Announcement>) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.updateDraftAnnouncement(id, payload)
      const index = draftAnnouncements.value.findIndex((item: Announcement) => item.id === id)
      if (index !== -1) {
        draftAnnouncements.value[index] = response.data
      }
      if (currentAnnouncement.value?.id === id) {
        currentAnnouncement.value = response.data
      }
      message.success('Announcement updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update announcement'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftAnnouncement(id: string) {
    loading.value = true
    error.value = null
    try {
      await calendarApi.deleteDraftAnnouncement(id)
      draftAnnouncements.value = draftAnnouncements.value.filter(
        (item: Announcement) => item.id !== id
      )
      message.success('Announcement deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete announcement'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Version Control Actions
  async function fetchVersions() {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getVersions()
      versions.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch versions'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDiff() {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.getDiff()
      diffData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch diff'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function publish(payload: PublishPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.publish(payload)
      currentVersion.value = response.data.version

      // Refresh published data
      await Promise.all([
        fetchPublishedFunding(),
        fetchPublishedMaintenance(),
        fetchPublishedAnnouncements(),
      ])

      // Clear drafts
      draftFunding.value = []
      draftMaintenance.value = []
      draftAnnouncements.value = []

      message.success('Calendar changes published successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to publish changes'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function rollback(versionId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.rollback(versionId)
      currentVersion.value = response.data.version

      // Refresh all data
      await Promise.all([
        fetchPublishedFunding(),
        fetchPublishedMaintenance(),
        fetchPublishedAnnouncements(),
        fetchDraftFunding(),
        fetchDraftMaintenance(),
        fetchDraftAnnouncements(),
      ])

      message.success('Rolled back to previous version successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to rollback'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Time Conflict Validation
  async function validateTimeConflicts(payload: any) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.validateTimeConflicts(payload)
      if (response.data.conflicts && response.data.conflicts.length > 0) {
        message.warning(`Found ${response.data.conflicts.length} time conflict(s)`)
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate time conflicts'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Import/Export Actions
  async function exportData(params: ExportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.exportData(params)
      message.success('Data exported successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to export data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function importData(payload: ImportPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await calendarApi.importData(payload)
      await Promise.all([fetchDraftFunding(), fetchDraftMaintenance(), fetchDraftAnnouncements()])
      message.success('Data imported successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to import data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    publishedFunding.value = []
    draftFunding.value = []
    currentFunding.value = null
    publishedMaintenance.value = []
    draftMaintenance.value = []
    currentMaintenance.value = null
    publishedAnnouncements.value = []
    draftAnnouncements.value = []
    currentAnnouncement.value = null
    currentVersion.value = ''
    versions.value = []
    diffData.value = null
  }

  return {
    // State
    loading,
    error,
    publishedFunding,
    draftFunding,
    currentFunding,
    publishedFundingTotal,
    draftFundingTotal,
    publishedMaintenance,
    draftMaintenance,
    currentMaintenance,
    publishedMaintenanceTotal,
    draftMaintenanceTotal,
    publishedAnnouncements,
    draftAnnouncements,
    currentAnnouncement,
    publishedAnnouncementsTotal,
    draftAnnouncementsTotal,
    currentVersion,
    versions,
    diffData,
    // Getters
    hasPublishedFunding,
    hasDraftFunding,
    hasPublishedMaintenance,
    hasDraftMaintenance,
    hasPublishedAnnouncements,
    hasDraftAnnouncements,
    draftExists,
    // Funding Actions
    fetchPublishedFunding,
    fetchDraftFunding,
    fetchFundingById,
    createDraftFunding,
    updateDraftFunding,
    deleteDraftFunding,
    // Maintenance Actions
    fetchPublishedMaintenance,
    fetchDraftMaintenance,
    fetchMaintenanceById,
    createDraftMaintenance,
    updateDraftMaintenance,
    deleteDraftMaintenance,
    // Announcement Actions
    fetchPublishedAnnouncements,
    fetchDraftAnnouncements,
    fetchAnnouncementById,
    createDraftAnnouncement,
    updateDraftAnnouncement,
    deleteDraftAnnouncement,
    // Version Control Actions
    fetchVersions,
    fetchDiff,
    publish,
    rollback,
    // Validation
    validateTimeConflicts,
    // Import/Export
    exportData,
    importData,
    reset,
  }
})
