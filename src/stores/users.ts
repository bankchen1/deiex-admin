import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listUsers,
  getUserById,
  getUserStats,
  updateUserVip,
  updateUserTags,
  resetUser2FA,
  disableUser,
  enableUser,
  exportUsers,
  type UserQueryParams,
  type UserStats,
  type UserDetailResponse,
} from '@/services/api/facade'
import type { User } from '@/contracts/users'

export const useUsersStore = defineStore('users', () => {
  // State
  const loading = ref(false)
  const statsLoading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)
  const exportLoading = ref(false)

  const error = ref<string | null>(null)

  const list = ref<User[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  const currentUser = ref<User | null>(null)
  const currentUserDetail = ref<UserDetailResponse | null>(null)
  const stats = ref<UserStats | null>(null)

  // Getters
  const hasData = computed(() => list.value.length > 0)
  const activeCount = computed(() => stats.value?.active || 0)
  const disabledCount = computed(() => stats.value?.disabled || 0)
  const suspendedCount = computed(() => stats.value?.suspended || 0)
  const todayRegistrations = computed(() => stats.value?.todayRegistrations || 0)

  // Actions
  async function fetchList(params: UserQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listUsers({
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
      error.value = e.message || 'Failed to fetch users list'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getUserById(id)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('User not found')
      }
      
      currentUser.value = data.user
      currentUserDetail.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch user details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function fetchUserDetail(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getUserById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('User not found')
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch user details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function fetchStats(params?: { startDate?: string; endDate?: string }) {
    statsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getUserStats(params)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      stats.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch user statistics'
      throw e
    } finally {
      statsLoading.value = false
    }
  }

  async function updateVip(id: string, payload: { vipLevel: number; reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateUserVip(id, payload)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Failed to update VIP level')
      }

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = data
        }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update VIP level'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateTags(id: string, payload: { tags: string[]; reason: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateUserTags(id, payload)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Failed to update risk tags')
      }

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = data
        }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update risk tags'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function reset2FA(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await resetUser2FA(id, payload)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Failed to reset 2FA')
      }

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = data
        }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to reset 2FA'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function disableUserAction(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await disableUser(id, payload)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Failed to disable user')
      }

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = data
        }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to disable user'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function enableUserAction(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await enableUser(id, payload)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!data) {
        throw new Error('Failed to enable user')
      }

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = data
        }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to enable user'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function exportData(params: UserQueryParams = {}) {
    exportLoading.value = true
    error.value = null
    try {
      const { data: blob, error: err } = await exportUsers(params)
      
      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }
      
      if (!blob) {
        throw new Error('Failed to export users data')
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return blob
    } catch (e: any) {
      error.value = e.message || 'Failed to export users data'
      throw e
    } finally {
      exportLoading.value = false
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
    actionLoading.value = false
    exportLoading.value = false
    error.value = null
    list.value = []
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
    currentUser.value = null
    currentUserDetail.value = null
    stats.value = null
  }

  return {
    // State
    loading,
    statsLoading,
    detailLoading,
    actionLoading,
    exportLoading,
    error,
    list,
    total,
    currentPage,
    pageSize,
    currentUser,
    currentUserDetail,
    stats,
    // Getters
    hasData,
    activeCount,
    disabledCount,
    suspendedCount,
    todayRegistrations,
    // Actions
    fetchList,
    fetchById,
    fetchUserDetail,
    fetchStats,
    updateVip,
    updateTags,
    reset2FA,
    disableUser: disableUserAction,
    enableUser: enableUserAction,
    exportData,
    setPage,
    setPageSize,
    reset,
  }
})
