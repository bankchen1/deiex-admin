import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listNavMappings,
  getNavMappingById,
  createNavMapping,
  updateNavMapping,
  deleteNavMapping,
  validateNavMappings,
  listRouteRedirects,
  getRedirectById,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  validateRedirects,
  getPageApiRelations,
  getPageApiRelation,
  updatePageApiRelation,
  scanPageApiRelations,
  validatePageApiRelations,
  exportMappings,
  importMappings,
  type NavMappingQueryParams,
  type RedirectQueryParams,
  type PageApiRelationQueryParams,
} from '@/services/api/facade'
import { message } from 'ant-design-vue'
import type { 
  NavToApiMapping,
  RouteRedirect,
  PageApiRelation,
  MappingValidationResult,
} from '@/contracts/mappings'

export const useMappingsStore = defineStore('mappings', () => {
  // State
  const loading = ref(false)
  const actionLoading = ref(false)
  const error = ref<string | null>(null)

  // Nav Mappings
  const navMappings = ref<NavToApiMapping[]>([])
  const navMappingsTotal = ref(0)
  const navMappingsCurrentPage = ref(1)
  const navMappingsPageSize = ref(20)
  const currentNavMapping = ref<NavToApiMapping | null>(null)

  // Route Redirects
  const redirects = ref<RouteRedirect[]>([])
  const redirectsTotal = ref(0)
  const redirectsCurrentPage = ref(1)
  const redirectsPageSize = ref(20)
  const currentRedirect = ref<RouteRedirect | null>(null)

  // Page API Relations
  const pageApiRelations = ref<PageApiRelation[]>([])
  const pageApiRelationsTotal = ref(0)
  const currentPageApiRelation = ref<PageApiRelation | null>(null)

  // Actions
  async function fetchNavMappings(params: NavMappingQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listNavMappings({
        page: navMappingsCurrentPage.value,
        pageSize: navMappingsPageSize.value,
        ...params
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        navMappings.value = []
        navMappingsTotal.value = 0
        return
      }

      navMappings.value = data.data
      navMappingsTotal.value = data.total
      navMappingsCurrentPage.value = data.page
      navMappingsPageSize.value = data.pageSize

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch navigation mappings'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRedirects(params: RedirectQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listRouteRedirects({
        page: redirectsCurrentPage.value,
        pageSize: redirectsPageSize.value,
        ...params
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        redirects.value = []
        redirectsTotal.value = 0
        return
      }

      redirects.value = data.data
      redirectsTotal.value = data.total
      redirectsCurrentPage.value = data.page
      redirectsPageSize.value = data.pageSize

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch route redirects'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchPageApiRelations(params?: { status?: string; search?: string }) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getPageApiRelations(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        pageApiRelations.value = []
        pageApiRelationsTotal.value = 0
        return
      }

      pageApiRelations.value = data.data
      pageApiRelationsTotal.value = data.total

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch page API relations'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Page setters
  function setNavMappingsPage(page: number) {
    navMappingsCurrentPage.value = page
  }

  function setNavMappingsPageSize(size: number) {
    navMappingsPageSize.value = size
    navMappingsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setRedirectsPage(page: number) {
    redirectsCurrentPage.value = page
  }

  function setRedirectsPageSize(size: number) {
    redirectsPageSize.value = size
    redirectsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  // Reset function
  function reset() {
    loading.value = false
    actionLoading.value = false
    error.value = null
    
    // Reset nav mappings state
    navMappings.value = []
    navMappingsTotal.value = 0
    navMappingsCurrentPage.value = 1
    navMappingsPageSize.value = 20
    currentNavMapping.value = null

    // Reset redirects state
    redirects.value = []
    redirectsTotal.value = 0
    redirectsCurrentPage.value = 1
    redirectsPageSize.value = 20
    currentRedirect.value = null

    // Reset page API relations state
    pageApiRelations.value = []
    pageApiRelationsTotal.value = 0
    currentPageApiRelation.value = null
  }

  return {
    // State
    loading,
    actionLoading,
    error,
    // Nav Mappings
    navMappings,
    navMappingsTotal,
    navMappingsCurrentPage,
    navMappingsPageSize,
    currentNavMapping,
    // Redirects
    redirects,
    redirectsTotal,
    redirectsCurrentPage,
    redirectsPageSize,
    currentRedirect,
    // Page API Relations
    pageApiRelations,
    pageApiRelationsTotal,
    currentPageApiRelation,
    // Actions
    fetchNavMappings,
    fetchRedirects,
    fetchPageApiRelations,
    // Page setters
    setNavMappingsPage,
    setNavMappingsPageSize,
    setRedirectsPage,
    setRedirectsPageSize,
    // Reset
    reset,
  }
})