import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  withdrawalsApi,
  type WithdrawalQueryParams,
  type ApproveWithdrawalPayload,
  type RejectWithdrawalPayload,
  type BatchApprovePayload,
  type BatchRejectPayload,
} from '@/services/api/assets'
import type { Withdrawal } from '@/types/models'
import { message } from 'ant-design-vue'

export const useWithdrawalsStore = defineStore('withdrawals', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const withdrawals = ref<Withdrawal[]>([])
  const currentWithdrawal = ref<Withdrawal | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  // Actions
  async function fetchList(params: WithdrawalQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await withdrawalsApi.getList({
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params,
      })
      withdrawals.value = response.data.data
      total.value = response.data.total
      currentPage.value = response.data.page
      pageSize.value = response.data.pageSize
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch withdrawals'
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
      const response = await withdrawalsApi.getById(id)
      currentWithdrawal.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch withdrawal details'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function approve(id: string, payload: ApproveWithdrawalPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await withdrawalsApi.approve(id, payload)
      // Update in list if present
      const index = withdrawals.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        withdrawals.value[index] = response.data
      }
      // Update current withdrawal if it's the same
      if (currentWithdrawal.value?.id === id) {
        currentWithdrawal.value = response.data
      }
      message.success('Withdrawal approved successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to approve withdrawal'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function reject(id: string, payload: RejectWithdrawalPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await withdrawalsApi.reject(id, payload)
      // Update in list if present
      const index = withdrawals.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        withdrawals.value[index] = response.data
      }
      // Update current withdrawal if it's the same
      if (currentWithdrawal.value?.id === id) {
        currentWithdrawal.value = response.data
      }
      message.success('Withdrawal rejected successfully')
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to reject withdrawal'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchApprove(payload: BatchApprovePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await withdrawalsApi.batchApprove(payload)
      message.success(
        `Batch approval completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch approve withdrawals'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function batchReject(payload: BatchRejectPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await withdrawalsApi.batchReject(payload)
      message.success(
        `Batch rejection completed: ${response.data.success} succeeded, ${response.data.failed} failed`
      )
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to batch reject withdrawals'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportData(params: WithdrawalQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const blob = await withdrawalsApi.export(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `withdrawals_${new Date().getTime()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Export completed')
    } catch (e: any) {
      error.value = e.message || 'Failed to export withdrawals'
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
      const response = await withdrawalsApi.updateNotes(id, notes)
      // Update in list if present
      const index = withdrawals.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        withdrawals.value[index] = response.data
      }
      // Update current withdrawal if it's the same
      if (currentWithdrawal.value?.id === id) {
        currentWithdrawal.value = response.data
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
    withdrawals.value = []
    currentWithdrawal.value = null
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
  }

  return {
    // State
    loading,
    error,
    withdrawals,
    currentWithdrawal,
    total,
    currentPage,
    pageSize,
    // Actions
    fetchList,
    fetchById,
    approve,
    reject,
    batchApprove,
    batchReject,
    exportData,
    updateNotes,
    setPage,
    setPageSize,
    reset,
  }
})
