import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listKycApplications,
  getKycApplicationById,
  getKycStats,
  approveKycApplication,
  rejectKycApplication,
  type KycQueryParams,
} from '@/services/api/facade'
import type { 
  KycApplication, 
  KycApplicationDetailResponse,
  KycStats 
} from '@/contracts/kyc'

export const useKycStore = defineStore('kyc', () => {
  // State
  const loading = ref(false)
  const detailLoading = ref(false)
  const statsLoading = ref(false)
  const actionLoading = ref(false)

  const error = ref<string | null>(null)

  const list = ref<KycApplication[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  const currentApplication = ref<KycApplicationDetailResponse | null>(null)
  const stats = ref<KycStats | null>(null)

  // Getters
  const hasData = computed(() => list.value.length > 0)
  const pendingCount = computed(() => stats.value?.pending || 0)
  const approvedCount = computed(() => stats.value?.approved || 0)
  const rejectedCount = computed(() => stats.value?.rejected || 0)
  const todaySubmissions = computed(() => stats.value?.todaySubmissions || 0)

  // Actions
  async function fetchList(params: KycApplicationQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listApplications({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        list.value = []
        total.value = 0
        return
      }

      list.value = data.data
      total.value = data.total
      currentPage.value = data.page
      pageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC applications list'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getApplicationById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('KYC application not found')
      }

      currentApplication.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC application details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function fetchStats(params?: { startDate?: string; endDate?: string }) {
    statsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getStats(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      stats.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC statistics'
      throw e
    } finally {
      statsLoading.value = false
    }
  }

  async function approveApplicationAction(id: string, payload: { reason?: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await approveKycApplication(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to approve KYC application')
      }

      // Update the application in the list if it exists
      const index = list.value.findIndex((app) => app.id === id)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], ...data }
      }

      // Update current application if it's the same
      if (currentApplication.value?.application.id === id) {
        currentApplication.value.application = { ...currentApplication.value.application, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to approve KYC application'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function rejectApplicationAction(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await rejectKycApplication(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to reject KYC application')
      }

      // Update the application in the list if it exists
      const index = list.value.findIndex((app) => app.id === id)
      if (index !== -1) {
        list.value[index] = { ...list.value[index], ...data }
      }

      // Update current application if it's the same
      if (currentApplication.value?.application.id === id) {
        currentApplication.value.application = { ...currentApplication.value.application, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to reject KYC application'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1 // Reset to first page when changing page size
  }

  function reset() {
    loading.value = false
    detailLoading.value = false
    statsLoading.value = false
    actionLoading.value = false
    error.value = null
    list.value = []
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
    currentApplication.value = null
    stats.value = null
  }

  return {
    // State
    loading,
    detailLoading,
    statsLoading,
    actionLoading,
    error,
    list,
    total,
    currentPage,
    pageSize,
    currentApplication,
    stats,
    // Getters
    hasData,
    pendingCount,
    approvedCount,
    rejectedCount,
    todaySubmissions,
    // Actions
    fetchList,
    fetchById,
    fetchStats,
    approveApplication: approveApplicationAction,
    rejectApplication: rejectApplicationAction,
    setPage,
    setPageSize,
    reset,
  }
})