import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  settingsApi,
  type GeneralSettings,
  type ThemeSettings,
  type I18nEntry,
  type FeatureFlag,
} from '@/services/api/settings'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // General Settings
  const generalSettings = ref<GeneralSettings | null>(null)

  // Theme Settings
  const themeSettings = ref<ThemeSettings | null>(null)

  // I18n
  const i18nEntries = ref<I18nEntry[]>([])
  const currentI18nEntry = ref<I18nEntry | null>(null)
  const missingKeys = ref<string[]>([])

  // Feature Flags
  const featureFlags = ref<FeatureFlag[]>([])

  // Cache Status
  const cacheStatus = ref<any>(null)

  // Getters
  const hasGeneralSettings = computed(() => generalSettings.value !== null)
  const hasThemeSettings = computed(() => themeSettings.value !== null)
  const hasMissingKeys = computed(() => missingKeys.value.length > 0)

  const i18nEntriesByModule = computed(() => {
    const grouped: Record<string, I18nEntry[]> = {}
    i18nEntries.value.forEach((entry) => {
      if (!grouped[entry.module]) {
        grouped[entry.module] = []
      }
      grouped[entry.module].push(entry)
    })
    return grouped
  })

  const enabledFeatures = computed(() => featureFlags.value.filter((flag) => flag.enabled))

  // Actions - General Settings
  async function fetchGeneralSettings() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getGeneralSettings()
      generalSettings.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch general settings'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateGeneralSettings(payload: Partial<GeneralSettings>) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.updateGeneralSettings(payload)
      generalSettings.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update general settings'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions - Theme Settings
  async function fetchThemeSettings() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getThemeSettings()
      themeSettings.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch theme settings'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateThemeSettings(payload: Partial<ThemeSettings>) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.updateThemeSettings(payload)
      themeSettings.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update theme settings'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions - I18n
  async function fetchI18nEntries(params?: { module?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getI18nEntries(params)
      i18nEntries.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch i18n entries'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchI18nEntry(key: string) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getI18nEntry(key)
      currentI18nEntry.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch i18n entry'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateI18nEntry(key: string, payload: Partial<I18nEntry>) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.updateI18nEntry(key, payload)
      const index = i18nEntries.value.findIndex((entry) => entry.key === key)
      if (index !== -1) {
        i18nEntries.value[index] = response.data
      }
      if (currentI18nEntry.value?.key === key) {
        currentI18nEntry.value = response.data
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update i18n entry'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createI18nEntry(payload: Omit<I18nEntry, 'lastUpdated'>) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.createI18nEntry(payload)
      i18nEntries.value.unshift(response.data)
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create i18n entry'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteI18nEntry(key: string) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.deleteI18nEntry(key)
      i18nEntries.value = i18nEntries.value.filter((entry) => entry.key !== key)
      if (currentI18nEntry.value?.key === key) {
        currentI18nEntry.value = null
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to delete i18n entry'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function bulkImportI18n(payload: {
    entries: Array<{ key: string; en: string; zh: string }>
    overwrite: boolean
  }) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.bulkImportI18n(payload)
      // Refresh the list after import
      await fetchI18nEntries()
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to import i18n entries'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportI18n(params?: { module?: string }) {
    loading.value = true
    error.value = null
    try {
      const blob = await settingsApi.exportI18n(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `i18n-export-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export i18n entries'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function scanMissingKeys() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.scanMissingKeys()
      missingKeys.value = response.data.missingKeys
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to scan missing keys'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions - Feature Flags
  async function fetchFeatureFlags() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getFeatureFlags()
      featureFlags.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch feature flags'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateFeatureFlag(key: string, enabled: boolean) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.updateFeatureFlag(key, enabled)
      const index = featureFlags.value.findIndex((flag) => flag.key === key)
      if (index !== -1) {
        featureFlags.value[index] = response.data
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update feature flag'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions - Cache Management
  async function fetchCacheStatus() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getCacheStatus()
      cacheStatus.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch cache status'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function refreshCache(targets: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.refreshCache({ targets })
      // Refresh cache status after refresh
      await fetchCacheStatus()
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to refresh cache'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function clearCache(targets: string[]) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.clearCache(targets)
      // Refresh cache status after clear
      await fetchCacheStatus()
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to clear cache'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    generalSettings.value = null
    themeSettings.value = null
    i18nEntries.value = []
    currentI18nEntry.value = null
    missingKeys.value = []
    featureFlags.value = []
    cacheStatus.value = null
  }

  return {
    // State
    loading,
    error,
    generalSettings,
    themeSettings,
    i18nEntries,
    currentI18nEntry,
    missingKeys,
    featureFlags,
    cacheStatus,

    // Getters
    hasGeneralSettings,
    hasThemeSettings,
    hasMissingKeys,
    i18nEntriesByModule,
    enabledFeatures,

    // Actions
    fetchGeneralSettings,
    updateGeneralSettings,
    fetchThemeSettings,
    updateThemeSettings,
    fetchI18nEntries,
    fetchI18nEntry,
    updateI18nEntry,
    createI18nEntry,
    deleteI18nEntry,
    bulkImportI18n,
    exportI18n,
    scanMissingKeys,
    fetchFeatureFlags,
    updateFeatureFlag,
    fetchCacheStatus,
    refreshCache,
    clearCache,
    reset,
  }
})
