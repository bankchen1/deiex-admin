import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  // UI State - only UI state should be managed in stores
  const loading = ref(false)
  const statsLoading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)
  const exportLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions for UI state management only
  function setLoading(value: boolean) {
    loading.value = value
  }

  function setStatsLoading(value: boolean) {
    statsLoading.value = value
  }

  function setDetailLoading(value: boolean) {
    detailLoading.value = value
  }

  function setActionLoading(value: boolean) {
    actionLoading.value = value
  }

  function setExportLoading(value: boolean) {
    exportLoading.value = value
  }

  function setError(value: string | null) {
    error.value = value
  }

  function reset() {
    loading.value = false
    statsLoading.value = false
    detailLoading.value = false
    actionLoading.value = false
    exportLoading.value = false
    error.value = null
  }

  return {
    // State
    loading,
    statsLoading,
    detailLoading,
    actionLoading,
    exportLoading,
    error,
    // Actions
    setLoading,
    setStatsLoading,
    setDetailLoading,
    setActionLoading,
    setExportLoading,
    setError,
    reset,
  }
})
