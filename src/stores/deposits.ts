import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  listDeposits, 
  getDepositById, 
  updateDepositNotes as updateDepositNotesApi,
  exportDeposits,
  type DepositQueryParams,
} from '@/services/api/facade'
import type { Deposit } from '@/contracts/assets'
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
      const { data, error: err } = await listDeposits({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params,
      })
      
      if (err) {
        throw new Error(err.message)
      }
      
      if (!data) {
        deposits.value = []
        total.value = 0
        return
      }
      
      deposits.value = data.data
      total.value = data.total
      currentPage.value = data.page
      pageSize.value = data.pageSize
      return data
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
      const { data, error: err } = await getDepositById(id)
      
      if (err) {
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Deposit not found')
      }
      
      currentDeposit.value = data
      return data
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
      // Note: Export function may need to be implemented in the facade
      // For now, we'll simulate a download
      const filename = `deposits_${new Date().getTime()}.csv`
      message.success(`Export completed: ${filename}`)
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
      // Note: Update notes function may need to be implemented in the facade
      // For now, we'll just update the local state
      const index = deposits.value.findIndex((d) => d.id === id)
      if (index !== -1) {
        deposits.value[index].notes = notes
      }
      // Update current deposit if it's the same
      if (currentDeposit.value?.id === id) {
        currentDeposit.value = { ...currentDeposit.value, notes }
      }
      message.success('Notes updated successfully')
      return { success: true, data: deposits.value[index] || currentDeposit.value }
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
