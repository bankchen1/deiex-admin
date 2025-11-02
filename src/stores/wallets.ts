import { defineStore } from 'pinia'
import { ref } from 'vue'
import { walletsApi, type WalletQueryParams } from '@/services/api/assets'
import type { WalletAddress, ChainHealth, RetryTask } from '@/types/models'
import { message } from 'ant-design-vue'

export const useWalletsStore = defineStore('wallets', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const addresses = ref<WalletAddress[]>([])
  const chainHealth = ref<ChainHealth[]>([])
  const retryQueue = ref<RetryTask[]>([])

  // Actions
  async function fetchAddresses(params: WalletQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await walletsApi.getAddresses(params)
      addresses.value = response.data
      return response
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
      const response = await walletsApi.getChainHealth()
      chainHealth.value = response.data
      return response
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
      const response = await walletsApi.getRetryQueue()
      retryQueue.value = response.data
      return response
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
      const response = await walletsApi.retryTask(taskId)
      // Update task in queue
      const index = retryQueue.value.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        retryQueue.value[index] = response.data
      }
      message.success('Task retry initiated')
      return response
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
      await walletsApi.cancelTask(taskId)
      // Remove task from queue
      retryQueue.value = retryQueue.value.filter((t) => t.id !== taskId)
      message.success('Task cancelled successfully')
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
      const response = await walletsApi.syncBalance(addressId)
      // Update address in list
      const index = addresses.value.findIndex((a) => a.id === addressId)
      if (index !== -1) {
        addresses.value[index] = response.data
      }
      message.success('Balance synced successfully')
      return response
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
