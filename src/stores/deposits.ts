import { defineStore } from 'pinia'
import { ref } from 'vue'
import { depositsApi, type DepositQueryParams } from '@/services/api/assets'
import type { Deposit } from '@/types/models'
import { message } from 'ant-design-vue'

export const useDepositsStore = defineStore('deposits', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const deposits = ref<Deposit[]>([])
  const currentDeposit = ref<Deposit | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  // Actions
  async function fetchList(params: DepositQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await depositsApi.getList({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params,
      })
      deposits.value = response.data.data
      total.value = response.data.total
      currentPage.value = response.data.page
      pageSize.value = response.data.pageSize
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deposits'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await depositsApi.getById(id)
      currentDeposit.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deposit details'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportData(params: DepositQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const blob = await depositsApi.export(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `deposits_${new Date().getTime()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Export completed')
    } catch (e: any) {
      error.value = e.message || 'Failed to export deposits'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateNotes(id: string, notes: string) {
    loading.value = true
    error.value = null
    try {
      const response = await depositsApi.updateNotes(id, notes)
      // Update in list if present
      const index = deposits.value.findIndex((d) => d.id === id)
      if (index !== -1) {
        deposits.value[index] = response.data
      }
      // Update current deposit if it's the same
      if (currentDeposit.value?.id === id) {
        currentDeposit.value = response.data
      }
      message.success('Notes updated successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update notes'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }

  function reset() {
    loading.value = false
    error.value = null
    deposits.value = []
    currentDeposit.value = null
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
  }

  return {
    // State
    loading,
    error,
    deposits,
    currentDeposit,
    total,
    currentPage,
    pageSize,
    // Actions
    fetchList,
    fetchById,
    exportData,
    updateNotes,
    setPage,
    setPageSize,
    reset,
  }
})
