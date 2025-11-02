import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { instrumentsApi } from '@/services/api/config.instruments'
import type {
  InstrumentQueryParams,
  InstrumentCreatePayload,
  InstrumentUpdatePayload,
  PublishPayload,
  ImportPayload,
  ExportParams,
} from '@/types/api'
import type { Instrument, Version } from '@/types/models'
import { message } from 'ant-design-vue'

export const useInstrumentsStore = defineStore('instruments', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const published = ref<Instrument[]>([])
  const drafts = ref<Instrument[]>([])
  const currentItem = ref<Instrument | null>(null)
  const currentVersion = ref<string>('')
  const versions = ref<Version[]>([])
  const publishedTotal = ref(0)
  const draftsTotal = ref(0)
  const diffData = ref<any>(null)
  const impactEstimation = ref<any>(null)

  // Getters
  const hasPublished = computed(() => published.value.length > 0)
  const hasDrafts = computed(() => drafts.value.length > 0)
  const draftExists = computed(() => drafts.value.length > 0)

  // Actions
  async function fetchPublished(params?: InstrumentQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getPublished(params)
      published.value = response.data.data
      publishedTotal.value = response.data.total
      if (response.data.data.length > 0 && response.data.data[0]) {
        currentVersion.value = response.data.data[0].version
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDrafts(params?: InstrumentQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getDrafts(params)
      drafts.value = response.data.data
      draftsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(symbol: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getById(symbol, isDraft)
      currentItem.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch instrument'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraft(payload: InstrumentCreatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.createDraft(payload)
      drafts.value.unshift(response.data)
      draftsTotal.value += 1
      message.success('Draft instrument created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create draft instrument'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraft(symbol: string, payload: InstrumentUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.updateDraft(symbol, payload)
      const index = drafts.value.findIndex((item) => item.symbol === symbol)
      if (index !== -1) {
        drafts.value[index] = response.data
      }
      if (currentItem.value?.symbol === symbol) {
        currentItem.value = response.data
      }
      message.success('Draft instrument updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update draft instrument'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraft(symbol: string) {
    loading.value = true
    error.value = null
    try {
      await instrumentsApi.deleteDraft(symbol)
      drafts.value = drafts.value.filter((item) => item.symbol !== symbol)
      draftsTotal.value -= 1
      if (currentItem.value?.symbol === symbol) {
        currentItem.value = null
      }
      message.success('Draft instrument deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete draft instrument'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchUpdate(updates: Array<{ symbol: string; updates: Partial<Instrument> }>) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.batchUpdate(updates)
      // Refresh drafts after batch update
      await fetchDrafts()
      message.success(
        `Batch update completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch update instruments'
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
      const response = await instrumentsApi.publish(payload)
      currentVersion.value = response.data.version
      // Clear drafts and refresh published
      drafts.value = []
      draftsTotal.value = 0
      await fetchPublished()
      await fetchVersions()
      message.success('Instruments published successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to publish instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchVersions() {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getVersions()
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

  async function fetchVersion(versionId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getVersion(versionId)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch version'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function rollback(versionId: string, notes?: string) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.rollback(versionId, notes)
      currentVersion.value = response.data.version
      await fetchPublished()
      await fetchVersions()
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

  async function fetchDiff() {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getDiff()
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

  async function exportData(params?: ExportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await instrumentsApi.export(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `instruments-${Date.now()}.${params?.format || 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Export completed successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to export instruments'
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
      const response = await instrumentsApi.import(payload)
      await fetchDrafts()
      message.success(
        `Import completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to import instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function validateImport(payload: ImportPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.validateImport(payload)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate import'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchImpactEstimation() {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.getImpactEstimation()
      impactEstimation.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch impact estimation'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchShow(symbols: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.batchShow(symbols)
      await fetchDrafts()
      message.success(`${response.data.success} instruments shown successfully`)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to show instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchHide(symbols: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await instrumentsApi.batchHide(symbols)
      await fetchDrafts()
      message.success(`${response.data.success} instruments hidden successfully`)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to hide instruments'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    published.value = []
    drafts.value = []
    currentItem.value = null
    currentVersion.value = ''
    versions.value = []
    publishedTotal.value = 0
    draftsTotal.value = 0
    diffData.value = null
    impactEstimation.value = null
  }

  return {
    // State
    loading,
    error,
    published,
    drafts,
    currentItem,
    currentVersion,
    versions,
    publishedTotal,
    draftsTotal,
    diffData,
    impactEstimation,
    // Getters
    hasPublished,
    hasDrafts,
    draftExists,
    // Actions
    fetchPublished,
    fetchDrafts,
    fetchById,
    createDraft,
    updateDraft,
    deleteDraft,
    batchUpdate,
    publish,
    fetchVersions,
    fetchVersion,
    rollback,
    fetchDiff,
    exportData,
    importData,
    validateImport,
    fetchImpactEstimation,
    batchShow,
    batchHide,
    reset,
  }
})
