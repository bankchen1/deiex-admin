import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { kycApi } from '@/services/api/kyc'
import type {
  KycQueryParams,
  ReviewPayload,
  BatchReviewPayload,
  KycStats,
} from '@/services/api/kyc'
import type { KycApplication } from '@/types/models'

export const useKycStore = defineStore('kyc', () => {
  // State
  const loading = ref(false)
  const statsLoading = ref(false)
  const detailLoading = ref(false)
  const reviewLoading = ref(false)
  const exportLoading = ref(false)

  const error = ref<string | null>(null)

  const list = ref<KycApplication[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  const currentItem = ref<KycApplication | null>(null)
  const stats = ref<KycStats | null>(null)

  // Getters
  const hasData = computed(() => list.value.length > 0)
  const pendingCount = computed(() => stats.value?.pending || 0)
  const approvedCount = computed(() => stats.value?.approved || 0)
  const rejectedCount = computed(() => stats.value?.rejected || 0)

  // Actions
  async function fetchList(params: KycQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await kycApi.getList({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params,
      })
      list.value = response.data.data
      total.value = response.data.total
      currentPage.value = response.data.page
      pageSize.value = response.data.pageSize
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC list'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const response = await kycApi.getById(id)
      currentItem.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function review(id: string, payload: ReviewPayload) {
    reviewLoading.value = true
    error.value = null
    try {
      const response = await kycApi.review(id, payload)

      // Update the item in the list
      const index = list.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current item if it's the same
      if (currentItem.value?.id === id) {
        currentItem.value = response.data
      }

      // Refresh stats
      await fetchStats()

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to review KYC application'
      throw e
    } finally {
      reviewLoading.value = false
    }
  }

  async function batchReview(payload: BatchReviewPayload) {
    reviewLoading.value = true
    error.value = null
    try {
      const response = await kycApi.batchReview(payload)

      // Refresh the list after batch operation
      await fetchList()

      // Refresh stats
      await fetchStats()

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch review KYC applications'
      throw e
    } finally {
      reviewLoading.value = false
    }
  }

  async function fetchStats(params?: { startDate?: string; endDate?: string }) {
    statsLoading.value = true
    error.value = null
    try {
      const response = await kycApi.getStats(params)
      stats.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch KYC statistics'
      throw e
    } finally {
      statsLoading.value = false
    }
  }

  async function exportData(params: KycQueryParams = {}) {
    exportLoading.value = true
    error.value = null
    try {
      const blob = await kycApi.export(params)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kyc-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return blob
    } catch (e: any) {
      error.value = e.message || 'Failed to export KYC data'
      throw e
    } finally {
      exportLoading.value = false
    }
  }

  async function getReviewHistory(id: string) {
    error.value = null
    try {
      const response = await kycApi.getReviewHistory(id)
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch review history'
      throw e
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
    statsLoading.value = false
    detailLoading.value = false
    reviewLoading.value = false
    exportLoading.value = false
    error.value = null
    list.value = []
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
    currentItem.value = null
    stats.value = null
  }

  return {
    // State
    loading,
    statsLoading,
    detailLoading,
    reviewLoading,
    exportLoading,
    error,
    list,
    total,
    currentPage,
    pageSize,
    currentItem,
    stats,
    // Getters
    hasData,
    pendingCount,
    approvedCount,
    rejectedCount,
    // Actions
    fetchList,
    fetchById,
    review,
    batchReview,
    fetchStats,
    exportData,
    getReviewHistory,
    setPage,
    setPageSize,
    reset,
  }
})
