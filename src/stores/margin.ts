import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listMarginTemplates,
  getMarginTemplateById,
  createMarginTemplate,
  updateMarginTemplate,
  deleteMarginTemplate,
  listMarginBindings,
  getMarginBindingById,
  createMarginBinding,
  updateMarginBinding,
  deleteMarginBinding,
  publishMarginTemplate,
  importMarginData,
  exportMarginData,
  getMarginVersions,
  getMarginVersion,
  rollbackMarginVersion,
  getMarginTemplateDiff,
  getMarginBindingDiff,
  type MarginTemplateQueryParams,
  type MarginBindingQueryParams,
  type CreateMarginTemplatePayload,
  type UpdateMarginTemplatePayload,
  type CreateMarginBindingPayload,
  type PublishPayload,
  type ImportPayload,
  type ExportParams,
  type VersionQueryParams,
} from '@/services/api/facade'
import type { MarginTemplate, MarginBinding, Version } from '@/contracts/margin'
import { message } from 'ant-design-vue'

export const useMarginStore = defineStore('margin', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const publishedTemplates = ref<MarginTemplate[]>([])
  const draftTemplates = ref<MarginTemplate[]>([])
  const publishedBindings = ref<MarginBinding[]>([])
  const draftBindings = ref<MarginBinding[]>([])
  const currentTemplate = ref<MarginTemplate | null>(null)
  const currentVersion = ref<string>('')
  const versions = ref<Version[]>([])
  const publishedTemplatesTotal = ref(0)
  const draftTemplatesTotal = ref(0)
  const publishedBindingsTotal = ref(0)
  const draftBindingsTotal = ref(0)
  const diffData = ref<any>(null)
  const impactEstimation = ref<any>(null)

  // Getters
  const hasPublishedTemplates = computed(() => publishedTemplates.value.length > 0)
  const hasDraftTemplates = computed(() => draftTemplates.value.length > 0)
  const hasPublishedBindings = computed(() => publishedBindings.value.length > 0)
  const hasDraftBindings = computed(() => draftBindings.value.length > 0)
  const draftExists = computed(
    () => draftTemplates.value.length > 0 || draftBindings.value.length > 0
  )

  // Template Actions
  async function fetchPublishedTemplates(params?: MarginQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getPublishedTemplates(params)
      publishedTemplates.value = response.data.data
      publishedTemplatesTotal.value = response.data.total
      if (response.data.data.length > 0 && response.data.data[0]) {
        currentVersion.value = response.data.data[0].version
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published templates'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftTemplates(params?: MarginQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getDraftTemplates(params)
      draftTemplates.value = response.data.data
      draftTemplatesTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft templates'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTemplateById(id: string, isDraft = false) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getTemplateById(id, isDraft)
      currentTemplate.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch template'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createDraftTemplate(payload: MarginTemplateCreatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.createDraftTemplate(payload)
      draftTemplates.value.unshift(response.data)
      draftTemplatesTotal.value += 1
      message.success('Draft template created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create draft template'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftTemplate(id: string, payload: MarginTemplateUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.updateDraftTemplate(id, payload)
      const index = draftTemplates.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        draftTemplates.value[index] = response.data
      }
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = response.data
      }
      message.success('Draft template updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update draft template'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteDraftTemplate(id: string) {
    loading.value = true
    error.value = null
    try {
      await marginApi.deleteDraftTemplate(id)
      draftTemplates.value = draftTemplates.value.filter((item) => item.id !== id)
      draftTemplatesTotal.value -= 1
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = null
      }
      message.success('Draft template deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete draft template'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Binding Actions
  async function fetchPublishedBindings(params?: MarginQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getPublishedBindings(params)
      publishedBindings.value = response.data.data
      publishedBindingsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch published bindings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftBindings(params?: MarginQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getDraftBindings(params)
      draftBindings.value = response.data.data
      draftBindingsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch draft bindings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateDraftBinding(payload: MarginBindingPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.updateDraftBinding(payload)
      const index = draftBindings.value.findIndex((item) => item.symbol === payload.symbol)
      if (index !== -1) {
        draftBindings.value[index] = response.data
      } else {
        draftBindings.value.unshift(response.data)
        draftBindingsTotal.value += 1
      }
      message.success('Draft binding updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update draft binding'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchBind(templateId: string, symbols: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.batchBind(templateId, symbols)
      await fetchDraftBindings()
      message.success(
        `Batch bind completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch bind symbols'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchUnbind(symbols: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.batchUnbind(symbols)
      await fetchDraftBindings()
      message.success(
        `Batch unbind completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch unbind symbols'
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
      const response = await marginApi.publish(payload)
      currentVersion.value = response.data.version
      // Clear drafts and refresh published
      draftTemplates.value = []
      draftTemplatesTotal.value = 0
      draftBindings.value = []
      draftBindingsTotal.value = 0
      await fetchPublishedTemplates()
      await fetchPublishedBindings()
      await fetchVersions()
      message.success('Margin configuration published successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to publish margin configuration'
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
      const response = await marginApi.getVersions()
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
      const response = await marginApi.getVersion(versionId)
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
      const response = await marginApi.rollback(versionId, notes)
      currentVersion.value = response.data.version
      await fetchPublishedTemplates()
      await fetchPublishedBindings()
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
      const response = await marginApi.getDiff()
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

  async function fetchImpactEstimation() {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.getImpactEstimation()
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

  // Import/Export Actions
  async function exportData(params?: ExportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await marginApi.export(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `margin-config-${Date.now()}.${params?.format || 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Export completed successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to export margin configuration'
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
      const response = await marginApi.import(payload)
      await fetchDraftTemplates()
      await fetchDraftBindings()
      message.success(
        `Import completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to import margin configuration'
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
      const response = await marginApi.validateImport(payload)
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
  async function calculateMargin(params: {
    templateId: string
    notionalValue: string
    leverage: number
  }) {
    loading.value = true
    error.value = null
    try {
      const response = await marginApi.calculateMargin(params)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to calculate margin'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    publishedTemplates.value = []
    draftTemplates.value = []
    publishedBindings.value = []
    draftBindings.value = []
    currentTemplate.value = null
    currentVersion.value = ''
    versions.value = []
    publishedTemplatesTotal.value = 0
    draftTemplatesTotal.value = 0
    publishedBindingsTotal.value = 0
    draftBindingsTotal.value = 0
    diffData.value = null
    impactEstimation.value = null
  }

  return {
    // State
    loading,
    error,
    publishedTemplates,
    draftTemplates,
    publishedBindings,
    draftBindings,
    currentTemplate,
    currentVersion,
    versions,
    publishedTemplatesTotal,
    draftTemplatesTotal,
    publishedBindingsTotal,
    draftBindingsTotal,
    diffData,
    impactEstimation,
    // Getters
    hasPublishedTemplates,
    hasDraftTemplates,
    hasPublishedBindings,
    hasDraftBindings,
    draftExists,
    // Actions
    fetchPublishedTemplates,
    fetchDraftTemplates,
    fetchTemplateById,
    createDraftTemplate,
    updateDraftTemplate,
    deleteDraftTemplate,
    fetchPublishedBindings,
    fetchDraftBindings,
    updateDraftBinding,
    batchBind,
    batchUnbind,
    publish,
    fetchVersions,
    fetchVersion,
    rollback,
    fetchDiff,
    fetchImpactEstimation,
    exportData,
    importData,
    validateImport,
    calculateMargin,
    reset,
  }
})
