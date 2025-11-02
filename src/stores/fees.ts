import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { feesApi } from '@/services/api/config.fees'
import type {
  FeeQueryParams,
  TradingFeeCreatePayload,
  TradingFeeUpdatePayload,
  WithdrawalFeeCreatePayload,
  WithdrawalFeeUpdatePayload,
  FeeCalculationParams,
  TradingFeeTemplate,
  WithdrawalFeeTemplate,
  Version,
} from '@/types/models'
import type { PublishPayload, ImportPayload, ExportParams } from '@/types/api'
import { message } from 'ant-design-vue'

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
  async function fetchPublishedTradingFees(params?: FeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await feesApi.getPublishedTradingFees(params)
      publishedTradingFees.value = response.data.data
      publishedTradingFeesTotal.value = response.data.total
      if (response.data.data.length > 0 && response.data.data[0]) {
        currentVersion.value = response.data.data[0].version
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published trading fees'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftTradingFees(params?: FeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await feesApi.getDraftTradingFees(params)
      draftTradingFees.value = response.data.data
      draftTradingFeesTotal.value = response.data.total
      return response
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
      const response = await feesApi.getTradingFeeById(id, isDraft)
      currentTradingFee.value = response.data
      return response
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
      const response = await feesApi.createDraftTradingFee(payload)
      draftTradingFees.value.unshift(response.data)
      draftTradingFeesTotal.value += 1
      message.success('Draft trading fee created successfully')
      return response
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
      const response = await feesApi.updateDraftTradingFee(id, payload)
      const index = draftTradingFees.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftTradingFees.value[index] = response.data
      }
      if (currentTradingFee.value?.id === id) {
        currentTradingFee.value = response.data
      }
      message.success('Draft trading fee updated successfully')
      return response
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
      await feesApi.deleteDraftTradingFee(id)
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
  async function fetchPublishedWithdrawalFees(params?: FeeQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await feesApi.getPublishedWithdrawalFees(params)
      publishedWithdrawalFees.value = response.data.data
      publishedWithdrawalFeesTotal.value = response.data.total
      return response
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
      const response = await feesApi.getDraftWithdrawalFees(params)
      draftWithdrawalFees.value = response.data.data
      draftWithdrawalFeesTotal.value = response.data.total
      return response
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
      const response = await feesApi.getWithdrawalFeeById(id, isDraft)
      currentWithdrawalFee.value = response.data
      return response
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
      const response = await feesApi.createDraftWithdrawalFee(payload)
      draftWithdrawalFees.value.unshift(response.data)
      draftWithdrawalFeesTotal.value += 1
      message.success('Draft withdrawal fee created successfully')
      return response
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
      const response = await feesApi.updateDraftWithdrawalFee(id, payload)
      const index = draftWithdrawalFees.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftWithdrawalFees.value[index] = response.data
      }
      if (currentWithdrawalFee.value?.id === id) {
        currentWithdrawalFee.value = response.data
      }
      message.success('Draft withdrawal fee updated successfully')
      return response
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
      const response = await feesApi.publish(payload)
      currentVersion.value = response.data.version
      // Clear drafts and refresh published
      draftTradingFees.value = []
      draftTradingFeesTotal.value = 0
      draftWithdrawalFees.value = []
      draftWithdrawalFeesTotal.value = 0
      await fetchPublishedTradingFees()
      await fetchPublishedWithdrawalFees()
      await fetchVersions()
      message.success('Fee configuration published successfully')
      return response
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
      const response = await feesApi.getVersions()
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
      const response = await feesApi.rollback(versionId, notes)
      currentVersion.value = response.data.version
      await fetchPublishedTradingFees()
      await fetchPublishedWithdrawalFees()
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
      const response = await feesApi.getDiff()
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
      const response = await feesApi.import(payload)
      await fetchDraftTradingFees()
      await fetchDraftWithdrawalFees()
      message.success(
        `Import completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
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
      const response = await feesApi.validateConsistency()
      consistencyReport.value = response.data
      if (!response.data.valid) {
        message.warning(
          `Found ${response.data.inconsistencies.length} inconsistencies with frontend fees`
        )
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
