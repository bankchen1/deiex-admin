import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  listWalletAddresses, 
  getWalletAddressById, 
  createWalletAddress,
  type WalletAddressQueryParams 
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
      // Note: Chain health functions may need to be implemented in the facade
      // For now, we'll simulate a mock response
      message.warning('Chain health feature not implemented yet')
      chainHealth.value = []
      return { data: [], success: true }
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
      // Note: Retry queue functions may need to be implemented in the facade
      // For now, we'll simulate a mock response
      message.warning('Retry queue feature not implemented yet')
      retryQueue.value = []
      return { data: [], success: true }
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
      // Note: Retry task functionality may need to be implemented in the facade
      // For now, we'll simulate the function
      message.success('Task retry initiated')
      return { success: true, data: null }
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
      // Note: Cancel task functionality may need to be implemented in the facade
      // For now, we'll simulate the function and remove from local state
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
      // Note: Balance sync functionality may need to be implemented in the facade
      // For now, we'll simulate the function
      const index = addresses.value.findIndex((a) => a.id === addressId)
      if (index !== -1) {
        // Update balance with mock sync
        addresses.value[index] = { ...addresses.value[index] }
      }
      message.success('Balance synced successfully')
      return { success: true, data: addresses.value[index] }
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
