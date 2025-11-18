import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletsStore = defineStore('wallets', () => {
  // UI State - only UI state should be managed in stores
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions for UI state management only
  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(value: string | null) {
    error.value = value
  }

  function reset() {
    loading.value = false
    error.value = null
  }

  return {
    // State
    loading,
    error,
    // Actions
    setLoading,
    setError,
    reset,
  }
})
