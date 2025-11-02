import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  mappingsApi,
  type NavToApiMapping,
  type RouteRedirect,
  type PageApiRelation,
  type MappingValidationResult,
} from '@/services/api/config.mappings'
import { message } from 'ant-design-vue'

export const useMappingsStore = defineStore('mappings', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Nav to API mappings
  const navMappings = ref<NavToApiMapping[]>([])
  const navMappingsTotal = ref(0)
  const currentNavMapping = ref<NavToApiMapping | null>(null)

  // Route redirects
  const redirects = ref<RouteRedirect[]>([])
  const redirectsTotal = ref(0)
  const currentRedirect = ref<RouteRedirect | null>(null)
  const redirectGraph = ref<{ nodes: any[]; edges: any[] } | null>(null)

  // Page to API relations
  const pageApiRelations = ref<PageApiRelation[]>([])
  const pageApiRelationsTotal = ref(0)
  const currentPageApiRelation = ref<PageApiRelation | null>(null)

  // Validation results
  const validationResult = ref<MappingValidationResult | null>(null)

  // Getters
  const hasNavMappings = computed(() => navMappings.value.length > 0)
  const hasRedirects = computed(() => redirects.value.length > 0)
  const hasPageApiRelations = computed(() => pageApiRelations.value.length > 0)
  const hasBrokenLinks = computed(
    () => validationResult.value && validationResult.value.brokenLinks.length > 0
  )
  const hasRedundantLinks = computed(
    () => validationResult.value && validationResult.value.redundantLinks.length > 0
  )

  // Nav to API Mapping Actions
  async function fetchNavMappings(params?: { status?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getNavMappings(params)
      navMappings.value = response.data
      navMappingsTotal.value = response.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch nav mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchNavMappingById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getNavMappingById(id)
      currentNavMapping.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch nav mapping'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createNavMapping(
    payload: Omit<NavToApiMapping, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.createNavMapping(payload)
      navMappings.value.unshift(response.data)
      navMappingsTotal.value++
      message.success('Nav mapping created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create nav mapping'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateNavMapping(id: string, payload: Partial<NavToApiMapping>) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.updateNavMapping(id, payload)
      const index = navMappings.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        navMappings.value[index] = response.data
      }
      if (currentNavMapping.value?.id === id) {
        currentNavMapping.value = response.data
      }
      message.success('Nav mapping updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update nav mapping'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteNavMapping(id: string) {
    loading.value = true
    error.value = null
    try {
      await mappingsApi.deleteNavMapping(id)
      navMappings.value = navMappings.value.filter((m) => m.id !== id)
      navMappingsTotal.value--
      message.success('Nav mapping deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete nav mapping'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function validateNavMappings() {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.validateNavMappings()
      validationResult.value = response.data
      if (response.data.valid) {
        message.success('All nav mappings are valid')
      } else {
        message.warning('Some nav mappings have issues')
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate nav mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function bulkSyncNavMappings(payload: {
    mappings: Partial<NavToApiMapping>[]
    mode: 'merge' | 'replace'
  }) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.bulkSyncNavMappings(payload)
      message.success(
        `Bulk sync completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      await fetchNavMappings()
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to bulk sync nav mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Route Redirect Actions
  async function fetchRedirects(params?: { search?: string; page?: number; pageSize?: number }) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getRouteRedirects(params)
      redirects.value = response.data
      redirectsTotal.value = response.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch redirects'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRedirectById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getRedirectById(id)
      currentRedirect.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch redirect'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createRedirect(payload: Omit<RouteRedirect, 'id' | 'hitCount' | 'createdAt'>) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.createRedirect(payload)
      redirects.value.unshift(response.data)
      redirectsTotal.value++
      message.success('Redirect created successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create redirect'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateRedirect(id: string, payload: Partial<RouteRedirect>) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.updateRedirect(id, payload)
      const index = redirects.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        redirects.value[index] = response.data
      }
      if (currentRedirect.value?.id === id) {
        currentRedirect.value = response.data
      }
      message.success('Redirect updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update redirect'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteRedirect(id: string) {
    loading.value = true
    error.value = null
    try {
      await mappingsApi.deleteRedirect(id)
      redirects.value = redirects.value.filter((r) => r.id !== id)
      redirectsTotal.value--
      message.success('Redirect deleted successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to delete redirect'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRedirectGraph() {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getRedirectGraph()
      redirectGraph.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch redirect graph'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function validateRedirects() {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.validateRedirects()
      validationResult.value = response.data
      if (response.data.valid) {
        message.success('All redirects are valid')
      } else {
        message.warning('Some redirects have issues')
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate redirects'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Page to API Relation Actions
  async function fetchPageApiRelations(params?: { status?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getPageApiRelations(params)
      pageApiRelations.value = response.data
      pageApiRelationsTotal.value = response.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch page-API relations'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchPageApiRelation(pageKey: string) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.getPageApiRelation(pageKey)
      currentPageApiRelation.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch page-API relation'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updatePageApiRelation(pageKey: string, payload: Partial<PageApiRelation>) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.updatePageApiRelation(pageKey, payload)
      const index = pageApiRelations.value.findIndex((r) => r.pageKey === pageKey)
      if (index !== -1) {
        pageApiRelations.value[index] = response.data
      }
      if (currentPageApiRelation.value?.pageKey === pageKey) {
        currentPageApiRelation.value = response.data
      }
      message.success('Page-API relation updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update page-API relation'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function scanPageApiRelations() {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.scanPageApiRelations()
      message.success(
        `Scan completed: ${response.data.scanned} pages scanned, ${response.data.updated} updated`
      )
      await fetchPageApiRelations()
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to scan page-API relations'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function validatePageApiRelations() {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.validatePageApiRelations()
      validationResult.value = response.data
      if (response.data.valid) {
        message.success('All page-API relations are valid')
      } else {
        message.warning('Some page-API relations have issues')
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to validate page-API relations'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Export/Import Actions
  async function exportMappings(type: 'nav-to-api' | 'redirects' | 'page-to-api') {
    loading.value = true
    error.value = null
    try {
      const blob = await mappingsApi.exportMappings(type)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}-mappings-${Date.now()}.json`
      link.click()
      window.URL.revokeObjectURL(url)
      message.success('Mappings exported successfully')
    } catch (e: any) {
      error.value = e.message || 'Failed to export mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function importMappings(type: 'nav-to-api' | 'redirects' | 'page-to-api', file: File) {
    loading.value = true
    error.value = null
    try {
      const response = await mappingsApi.importMappings(type, file)
      message.success(
        `Import completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      // Refresh data based on type
      if (type === 'nav-to-api') {
        await fetchNavMappings()
      } else if (type === 'redirects') {
        await fetchRedirects()
      } else {
        await fetchPageApiRelations()
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to import mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    navMappings.value = []
    navMappingsTotal.value = 0
    currentNavMapping.value = null
    redirects.value = []
    redirectsTotal.value = 0
    currentRedirect.value = null
    redirectGraph.value = null
    pageApiRelations.value = []
    pageApiRelationsTotal.value = 0
    currentPageApiRelation.value = null
    validationResult.value = null
  }

  return {
    // State
    loading,
    error,
    navMappings,
    navMappingsTotal,
    currentNavMapping,
    redirects,
    redirectsTotal,
    currentRedirect,
    redirectGraph,
    pageApiRelations,
    pageApiRelationsTotal,
    currentPageApiRelation,
    validationResult,

    // Getters
    hasNavMappings,
    hasRedirects,
    hasPageApiRelations,
    hasBrokenLinks,
    hasRedundantLinks,

    // Actions
    fetchNavMappings,
    fetchNavMappingById,
    createNavMapping,
    updateNavMapping,
    deleteNavMapping,
    validateNavMappings,
    bulkSyncNavMappings,
    fetchRedirects,
    fetchRedirectById,
    createRedirect,
    updateRedirect,
    deleteRedirect,
    fetchRedirectGraph,
    validateRedirects,
    fetchPageApiRelations,
    fetchPageApiRelation,
    updatePageApiRelation,
    scanPageApiRelations,
    validatePageApiRelations,
    exportMappings,
    importMappings,
    reset,
  }
})
