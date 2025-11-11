import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listWalletAddresses,
  getWalletAddressById,
  createWalletAddress,
  getChainHealthStatus,
  getRetryQueue,
  retryTask as retryTaskFacade,
  cancelTask as cancelTaskFacade,
  syncBalance as syncBalanceFacade,
  type WalletAddressQueryParams,
} from '@/services/api/facade'
import type { WalletAddress, ChainHealth, RetryTask } from '@/contracts/assets'
import { message } from 'ant-design-vue'

export const useWalletsStore = defineStore('wallets', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const addresses = ref<WalletAddress[]>([])
  const chainHealth = ref<ChainHealth[]>([])
  const retryQueue = ref<RetryTask[]>([])

  // Actions
  async function fetchAddresses(params: WalletAddressQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listWalletAddresses(params)

      if (err) {
        throw new Error(err.message)
      }

      if (!data) {
        addresses.value = []
        return
      }

      addresses.value = data.data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch wallet addresses'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchChainHealth() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getChainHealthStatus()

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        chainHealth.value = []
        return { data: [], success: true }
      }

      chainHealth.value = data
      return { data, success: true }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch chain health'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRetryQueue() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getRetryQueue()

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        retryQueue.value = []
        return { data: [], success: true }
      }

      retryQueue.value = data
      return { data, success: true }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retry queue'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function retryTask(taskId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await retryTaskFacade(taskId)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to retry task')
      }

      message.success('Task retry initiated successfully')
      return { success: true, data }
    } catch (e: any) {
      error.value = e.message || 'Failed to retry task'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function cancelTask(taskId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await cancelTask(taskId)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to cancel task')
      }

      // Update local state to remove cancelled task
      retryQueue.value = retryQueue.value.filter((t) => t.id !== taskId)
      message.success('Task cancelled successfully')
      return { success: true, data }
    } catch (e: any) {
      error.value = e.message || 'Failed to cancel task'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function syncBalance(addressId: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await syncBalance(addressId)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to sync balance')
      }

      // Update the address in the local list if it exists
      const index = addresses.value.findIndex((a) => a.id === addressId)
      if (index !== -1) {
        addresses.value[index] = data
      }

      message.success('Balance synced successfully')
      return { success: true, data }
    } catch (e: any) {
      error.value = e.message || 'Failed to sync balance'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    addresses.value = []
    chainHealth.value = []
    retryQueue.value = []
  }

  return {
    // State
    loading,
    error,
    addresses,
    chainHealth,
    retryQueue,
    // Actions
    fetchAddresses,
    fetchChainHealth,
    fetchRetryQueue,
    retryTask,
    cancelTask,
    syncBalance,
    reset,
  }
})
