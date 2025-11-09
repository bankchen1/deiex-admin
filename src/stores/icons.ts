import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  listIconAssets,
  getIconAssetById,
  createIconAsset,
  updateIconAsset,
  deleteIconAsset,
  listIconMappings,
  getIconMappingById,
  createIconMapping,
  updateIconMapping,
  deleteIconMapping,
  bulkUploadIcons,
  validateIcon,
  publishIconAsset,
  exportIcons,
  replaceIconAsset,
  type IconAssetQueryParams,
  type IconMappingQueryParams,
  type CreateIconAssetPayload,
  type UpdateIconAssetPayload,
  type CreateIconMappingPayload,
  type UpdateIconMappingPayload,
  type BulkUploadPayload,
  type ValidateIconPayload,
  type PublishIconPayload,
} from '@/services/api/facade'
import { message } from 'ant-design-vue'
import type {
  IconAsset,
  IconMapping,
  ValidationResult,
  BulkUploadResult,
} from '@/contracts/icons'

export const useIconsStore = defineStore('icons', () => {
  // State - Assets
  const assetsLoading = ref(false)
  const assetsError = ref<string | null>(null)
  const assets = ref<IconAsset[]>([])
  const assetsTotal = ref(0)
  const currentAsset = ref<IconAsset | null>(null)

  // State - Mappings
  const mappingsLoading = ref(false)
  const mappingsError = ref<string | null>(null)
  const mappings = ref<IconMapping[]>([])
  const mappingsTotal = ref(0)
  const currentMapping = ref<IconMapping | null>(null)

  // State - Upload
  const uploadLoading = ref(false)
  const uploadProgress = ref(0)

  // Getters
  const hasAssets = computed(() => assets.value.length > 0)
  const hasMappings = computed(() => mappings.value.length > 0)

  // Actions - Assets
  async function fetchAssets(params: IconAssetQueryParams) {
    assetsLoading.value = true
    assetsError.value = null
    try {
      const response = await iconsApi.getAssets(params)
      assets.value = response.data.items
      assetsTotal.value = response.data.total
      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to fetch icon assets'
      throw e
    } finally {
      assetsLoading.value = false
    }
  }

  async function fetchAssetById(id: string) {
    assetsLoading.value = true
    assetsError.value = null
    try {
      const response = await iconsApi.getAssetById(id)
      currentAsset.value = response.data
      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to fetch icon asset'
      throw e
    } finally {
      assetsLoading.value = false
    }
  }

  async function createAsset(payload: CreateIconAssetPayload) {
    uploadLoading.value = true
    assetsError.value = null
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('name', payload.name)
      formData.append('type', payload.type)
      formData.append('lightFile', payload.lightFile)
      if (payload.darkFile) {
        formData.append('darkFile', payload.darkFile)
      }
      if (payload.tags && payload.tags.length > 0) {
        formData.append('tags', JSON.stringify(payload.tags))
      }

      const response = await iconsApi.createAsset(formData)
      assets.value.unshift(response.data)
      assetsTotal.value++
      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to create icon asset'
      throw e
    } finally {
      uploadLoading.value = false
      uploadProgress.value = 0
    }
  }

  async function updateAsset(id: string, payload: UpdateIconAssetPayload) {
    assetsLoading.value = true
    assetsError.value = null
    try {
      const response = await iconsApi.updateAsset(id, payload)
      const index = assets.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        assets.value[index] = response.data
      }
      if (currentAsset.value?.id === id) {
        currentAsset.value = response.data
      }
      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to update icon asset'
      throw e
    } finally {
      assetsLoading.value = false
    }
  }

  async function deleteAsset(id: string) {
    assetsLoading.value = true
    assetsError.value = null
    try {
      await iconsApi.deleteAsset(id)
      const index = assets.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        assets.value.splice(index, 1)
        assetsTotal.value--
      }
      if (currentAsset.value?.id === id) {
        currentAsset.value = null
      }
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to delete icon asset'
      throw e
    } finally {
      assetsLoading.value = false
    }
  }

  async function replaceAsset(id: string, lightFile: File, darkFile?: File) {
    uploadLoading.value = true
    assetsError.value = null
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('lightFile', lightFile)
      if (darkFile) {
        formData.append('darkFile', darkFile)
      }

      const response = await iconsApi.replaceAsset(id, formData)
      const index = assets.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        assets.value[index] = response.data
      }
      if (currentAsset.value?.id === id) {
        currentAsset.value = response.data
      }
      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to replace icon asset'
      throw e
    } finally {
      uploadLoading.value = false
      uploadProgress.value = 0
    }
  }

  async function validateAsset(file: File): Promise<ValidationResult> {
    try {
      const response = await iconsApi.validateAsset(file)
      return response.data
    } catch (e: any) {
      throw e
    }
  }

  // Actions - Mappings
  async function fetchMappings(params: IconMappingQueryParams) {
    mappingsLoading.value = true
    mappingsError.value = null
    try {
      const response = await iconsApi.getMappings(params)
      mappings.value = response.data.items
      mappingsTotal.value = response.data.total
      return response
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to fetch icon mappings'
      throw e
    } finally {
      mappingsLoading.value = false
    }
  }

  async function fetchMappingById(id: string) {
    mappingsLoading.value = true
    mappingsError.value = null
    try {
      const response = await iconsApi.getMappingById(id)
      currentMapping.value = response.data
      return response
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to fetch icon mapping'
      throw e
    } finally {
      mappingsLoading.value = false
    }
  }

  async function createMapping(payload: CreateIconMappingPayload) {
    mappingsLoading.value = true
    mappingsError.value = null
    try {
      const response = await iconsApi.createMapping(payload)
      mappings.value.unshift(response.data)
      mappingsTotal.value++
      return response
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to create icon mapping'
      throw e
    } finally {
      mappingsLoading.value = false
    }
  }

  async function updateMapping(id: string, payload: Partial<CreateIconMappingPayload>) {
    mappingsLoading.value = true
    mappingsError.value = null
    try {
      const response = await iconsApi.updateMapping(id, payload)
      const index = mappings.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        mappings.value[index] = response.data
      }
      if (currentMapping.value?.id === id) {
        currentMapping.value = response.data
      }
      return response
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to update icon mapping'
      throw e
    } finally {
      mappingsLoading.value = false
    }
  }

  async function deleteMapping(id: string) {
    mappingsLoading.value = true
    mappingsError.value = null
    try {
      await iconsApi.deleteMapping(id)
      const index = mappings.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        mappings.value.splice(index, 1)
        mappingsTotal.value--
      }
      if (currentMapping.value?.id === id) {
        currentMapping.value = null
      }
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to delete icon mapping'
      throw e
    } finally {
      mappingsLoading.value = false
    }
  }

  // Actions - Bulk Operations
  async function bulkUpload(
    files: File[],
    autoNaming: boolean,
    prefix?: string
  ): Promise<BulkUploadResult> {
    uploadLoading.value = true
    assetsError.value = null
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('autoNaming', String(autoNaming))
      if (prefix) {
        formData.append('prefix', prefix)
      }

      const response = await iconsApi.bulkUpload(formData)

      // Add successful uploads to assets list
      if (response.data.assets && response.data.assets.length > 0) {
        assets.value.unshift(...response.data.assets)
        assetsTotal.value += response.data.success
      }

      return response.data
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to bulk upload icons'
      throw e
    } finally {
      uploadLoading.value = false
      uploadProgress.value = 0
    }
  }

  async function bulkDeleteAssets(ids: string[]) {
    assetsLoading.value = true
    assetsError.value = null
    try {
      const response = await iconsApi.bulkDelete(ids)

      // Remove deleted items from local state
      assets.value = assets.value.filter((item) => !ids.includes(item.id))
      assetsTotal.value -= response.data.deleted

      return response
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to bulk delete icons'
      throw e
    } finally {
      assetsLoading.value = false
    }
  }

  // Actions - Export
  async function exportAssets(params: IconAssetQueryParams) {
    try {
      const blob = await iconsApi.exportAssets(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `icon-assets-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      assetsError.value = e.message || 'Failed to export icon assets'
      throw e
    }
  }

  async function exportMappings(params: IconMappingQueryParams) {
    try {
      const blob = await iconsApi.exportMappings(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `icon-mappings-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      mappingsError.value = e.message || 'Failed to export icon mappings'
      throw e
    }
  }

  // Reset
  function resetAssets() {
    assetsLoading.value = false
    assetsError.value = null
    assets.value = []
    assetsTotal.value = 0
    currentAsset.value = null
  }

  function resetMappings() {
    mappingsLoading.value = false
    mappingsError.value = null
    mappings.value = []
    mappingsTotal.value = 0
    currentMapping.value = null
  }

  function reset() {
    resetAssets()
    resetMappings()
    uploadLoading.value = false
    uploadProgress.value = 0
  }

  return {
    // State - Assets
    assetsLoading,
    assetsError,
    assets,
    assetsTotal,
    currentAsset,
    // State - Mappings
    mappingsLoading,
    mappingsError,
    mappings,
    mappingsTotal,
    currentMapping,
    // State - Upload
    uploadLoading,
    uploadProgress,
    // Getters
    hasAssets,
    hasMappings,
    // Actions - Assets
    fetchAssets,
    fetchAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
    replaceAsset,
    validateAsset,
    // Actions - Mappings
    fetchMappings,
    fetchMappingById,
    createMapping,
    updateMapping,
    deleteMapping,
    // Actions - Bulk
    bulkUpload,
    bulkDeleteAssets,
    // Actions - Export
    exportAssets,
    exportMappings,
    // Reset
    resetAssets,
    resetMappings,
    reset,
  }
})
