import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listTradingFeeTemplates,
  getTradingFeeTemplateById,
  createTradingFeeTemplateDraft,
  updateTradingFeeTemplateDraft,
  deleteTradingFeeTemplateDraft,
  listWithdrawalFeeTemplates,
  getWithdrawalFeeTemplateById,
  createWithdrawalFeeTemplateDraft,
  updateWithdrawalFeeTemplateDraft,
  deleteWithdrawalFeeTemplateDraft,
  publishFees,
  getFeeVersions,
  getFeeVersionById,
  rollbackFeeVersion,
  getFeeVersionDiff,
  exportFees,
  importFees,
  validateFeeImport,
  calculateFee,
  validateFeeConsistency,
  type TradingFeeQueryParams,
  type WithdrawalFeeQueryParams,
  type VersionQueryParams,
  type PublishPayload,
  type ImportPayload,
  type ExportParams,
} from '@/services/api/facade'
import { message } from 'ant-design-vue'
import type {
  TradingFeeTemplate,
  WithdrawalFeeTemplate,
  Version,
  FeeCalculationParams,
  FeeCalculationResult,
  ValidateConsistencyResult,
} from '@/contracts/fees'
import type { WithdrawalFeeUpdatePayload } from '@/types'
import type { WithdrawalFeeCreatePayload } from '@/types'
import type { FeeQueryParams } from '@/types'
import type { TradingFeeUpdatePayload } from '@/types'
import type { TradingFeeCreatePayload } from '@/types'

export const useFeesStore = defineStore('fees', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Trading Fees
  const publishedTradingFees = ref<TradingFeeTemplate[]>([])
  const draftTradingFees = ref<TradingFeeTemplate[]>([])
  const currentTradingFee = ref<TradingFeeTemplate | null>(null)
  const publishedTradingFeesTotal = ref(0)
  const draftTradingFeesTotal = ref(0)

  // Withdrawal Fees
  const publishedWithdrawalFees = ref<WithdrawalFeeTemplate[]>([])
  const draftWithdrawalFees = ref<WithdrawalFeeTemplate[]>([])
  const currentWithdrawalFee = ref<WithdrawalFeeTemplate | null>(null)
  const publishedWithdrawalFeesTotal = ref(0)
  const draftWithdrawalFeesTotal = ref(0)

  // Version Control
  const currentVersion = ref<string>('')
  const versions = ref<Version[]>([])
  const diffData = ref<any>(null)

  // Consistency Validation
  const consistencyReport = ref<any>(null)

  // Getters
  const hasPublishedTradingFees = computed(() => publishedTradingFees.value.length > 0)
  const hasDraftTradingFees = computed(() => draftTradingFees.value.length > 0)
  const hasPublishedWithdrawalFees = computed(() => publishedWithdrawalFees.value.length > 0)
  const hasDraftWithdrawalFees = computed(() => draftWithdrawalFees.value.length > 0)
  const draftExists = computed(
    () => draftTradingFees.value.length > 0 || draftWithdrawalFees.value.length > 0
  )

  // Trading Fee Actions
  async function fetchPublishedTradingFees(params?: TradingFeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listTradingFeeTemplates({ ...params, status: 'published' })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        publishedTradingFees.value = []
        publishedTradingFeesTotal.value = 0
        return { data: [], total: 0, page: 1, pageSize: 20 }
      }

      publishedTradingFees.value = data.data
      publishedTradingFeesTotal.value = data.total
      if (data.data.length > 0 && data.data[0]) {
        currentVersion.value = data.data[0].version
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published trading fees'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftTradingFees(params?: TradingFeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      // Assuming the facade should be extended to support draft status filter
      // For now, we'll call the main function and filter the response if needed
      const { data, error: err } = await listTradingFeeTemplates({ ...params, status: 'draft' })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        draftTradingFees.value = []
        draftTradingFeesTotal.value = 0
        return { data: [], total: 0, page: 1, pageSize: 20 }
      }

      draftTradingFees.value = data.data
      draftTradingFeesTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft trading fees'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTradingFeeById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getTradingFeeTemplateById(id) // Note: isDraft not supported in current facade interface

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Trading fee not found')
      }

      currentTradingFee.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trading fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftTradingFee(payload: TradingFeeCreatePayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await createTradingFeeTemplateDraft(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create draft trading fee')
      }

      draftTradingFees.value.unshift(data)
      draftTradingFeesTotal.value += 1
      message.success('Draft trading fee created successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create draft trading fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftTradingFee(id: string, payload: TradingFeeUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateTradingFeeTemplateDraft(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update draft trading fee')
      }

      const index = draftTradingFees.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftTradingFees.value[index] = data
      }
      if (currentTradingFee.value?.id === id) {
        currentTradingFee.value = data
      }
      message.success('Draft trading fee updated successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update draft trading fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftTradingFee(id: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteTradingFeeTemplateDraft(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete draft trading fee')
      }

      draftTradingFees.value = draftTradingFees.value.filter((item) => item.id !== id)
      draftTradingFeesTotal.value -= 1
      if (currentTradingFee.value?.id === id) {
        currentTradingFee.value = null
      }
      message.success('Draft trading fee deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete draft trading fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Withdrawal Fee Actions
  async function fetchPublishedWithdrawalFees(params?: WithdrawalFeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listWithdrawalFeeTemplates({
        ...params,
        status: 'published',
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        publishedWithdrawalFees.value = []
        publishedWithdrawalFeesTotal.value = 0
        return { data: [], total: 0, page: 1, pageSize: 20 }
      }

      publishedWithdrawalFees.value = data.data
      publishedWithdrawalFeesTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published withdrawal fees'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftWithdrawalFees(params?: FeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await feesApi.getDraftWithdrawalFees(params)
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      draftWithdrawalFees.value = data.data
      draftWithdrawalFeesTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft withdrawal fees'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchWithdrawalFeeById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await feesApi.getWithdrawalFeeById(id, isDraft)
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      currentWithdrawalFee.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch withdrawal fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftWithdrawalFee(payload: WithdrawalFeeCreatePayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await feesApi.createDraftWithdrawalFee(payload)
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      draftWithdrawalFees.value.unshift(data)
      draftWithdrawalFeesTotal.value += 1
      message.success('Draft withdrawal fee created successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create draft withdrawal fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftWithdrawalFee(id: string, payload: WithdrawalFeeUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await feesApi.updateDraftWithdrawalFee(id, payload)
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      const index = draftWithdrawalFees.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftWithdrawalFees.value[index] = data
      }
      if (currentWithdrawalFee.value?.id === id) {
        currentWithdrawalFee.value = data
      }
      message.success('Draft withdrawal fee updated successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update draft withdrawal fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftWithdrawalFee(id: string) {
    loading.value = true
    error.value = null
    try {
      await feesApi.deleteDraftWithdrawalFee(id)
      draftWithdrawalFees.value = draftWithdrawalFees.value.filter((item) => item.id !== id)
      draftWithdrawalFeesTotal.value -= 1
      if (currentWithdrawalFee.value?.id === id) {
        currentWithdrawalFee.value = null
      }
      message.success('Draft withdrawal fee deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete draft withdrawal fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Version Control Actions
  async function publish(payload: PublishPayload) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await publishFees(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to publish fee configuration')
      }

      currentVersion.value = data.version
      // Clear drafts and refresh published
      draftTradingFees.value = []
      draftTradingFeesTotal.value = 0
      draftWithdrawalFees.value = []
      draftWithdrawalFeesTotal.value = 0
      await fetchPublishedTradingFees()
      await fetchPublishedWithdrawalFees()
      await fetchVersions()
      message.success('Fee configuration published successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to publish fee configuration'
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
      const { data, error: err } = await getFeeVersions()

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        versions.value = []
        return []
      }

      versions.value = data
      return data
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
      const response = await feesApi.getVersion(versionId)
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
      const { data, error: err } = await feesApi.rollback(versionId, notes)
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      currentVersion.value = data.version
      await fetchPublishedTradingFees()
      await fetchPublishedWithdrawalFees()
      await fetchVersions()
      message.success('Rolled back to previous version successfully')
      return data
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
      const { data, error: err } = await feesApi.getDiff()
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      diffData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch diff'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Import/Export Actions
  async function exportData(params?: ExportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await feesApi.export(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fees-config-${Date.now()}.${params?.format || 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Export completed successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to export fee configuration'
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
      const { data, error: err } = await importFees(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to import fee configuration')
      }

      await fetchDraftTradingFees()
      await fetchDraftWithdrawalFees()
      message.success(`Import completed: ${data.success} succeeded, ${data.failed} failed`)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to import fee configuration'
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
      const response = await feesApi.validateImport(payload)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate import'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Calculator Action
  async function calculateFee(params: FeeCalculationParams) {
    loading.value = true
    error.value = null
    try {
      const response = await feesApi.calculateFee(params)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to calculate fee'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Consistency Validation
  async function validateConsistency() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await feesApi.validateConsistency()
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      consistencyReport.value = data
      if (!data.valid) {
        message.warning(`Found ${data.inconsistencies.length} inconsistencies with frontend fees`)
      } else {
        message.success('All fees are consistent with frontend')
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate consistency'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    publishedTradingFees.value = []
    draftTradingFees.value = []
    publishedWithdrawalFees.value = []
    draftWithdrawalFees.value = []
    currentTradingFee.value = null
    currentWithdrawalFee.value = null
    currentVersion.value = ''
    versions.value = []
    publishedTradingFeesTotal.value = 0
    draftTradingFeesTotal.value = 0
    publishedWithdrawalFeesTotal.value = 0
    draftWithdrawalFeesTotal.value = 0
    diffData.value = null
    consistencyReport.value = null
  }

  return {
    // State
    loading,
    error,
    publishedTradingFees,
    draftTradingFees,
    currentTradingFee,
    publishedTradingFeesTotal,
    draftTradingFeesTotal,
    publishedWithdrawalFees,
    draftWithdrawalFees,
    currentWithdrawalFee,
    publishedWithdrawalFeesTotal,
    draftWithdrawalFeesTotal,
    currentVersion,
    versions,
    diffData,
    consistencyReport,
    // Getters
    hasPublishedTradingFees,
    hasDraftTradingFees,
    hasPublishedWithdrawalFees,
    hasDraftWithdrawalFees,
    draftExists,
    // Actions
    fetchPublishedTradingFees,
    fetchDraftTradingFees,
    fetchTradingFeeById,
    createDraftTradingFee,
    updateDraftTradingFee,
    deleteDraftTradingFee,
    fetchPublishedWithdrawalFees,
    fetchDraftWithdrawalFees,
    fetchWithdrawalFeeById,
    createDraftWithdrawalFee,
    updateDraftWithdrawalFee,
    deleteDraftWithdrawalFee,
    publish,
    fetchVersions,
    fetchVersion,
    rollback,
    fetchDiff,
    exportData,
    importData,
    validateImport,
    calculateFee,
    validateConsistency,
    reset,
  }
})
