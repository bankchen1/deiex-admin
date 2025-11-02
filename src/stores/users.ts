import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersApi } from '@/services/api/users'
import type {
  UserQueryParams,
  VipUpdatePayload,
  TagUpdatePayload,
  Reset2FAPayload,
  UserStats,
  UserDetailResponse,
} from '@/services/api/users'
import type { User } from '@/types/models'

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
      const response = await usersApi.getList({
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
      const response = await usersApi.getById(id)
      currentUser.value = response.data.user
      currentUserDetail.value = response.data
      return response
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
      const response = await usersApi.getStats(params)
      stats.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch user statistics'
      throw e
    } finally {
      statsLoading.value = false
    }
  }

  async function updateVip(id: string, payload: VipUpdatePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await usersApi.updateVip(id, payload)

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = response.data
        }
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update VIP level'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateTags(id: string, payload: TagUpdatePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await usersApi.updateTags(id, payload)

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = response.data
        }
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update risk tags'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function reset2FA(id: string, payload: Reset2FAPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await usersApi.reset2FA(id, payload)

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = response.data
        }
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to reset 2FA'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function disableUser(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await usersApi.disableUser(id, payload)

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = response.data
        }
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to disable user'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function enableUser(id: string, payload: { reason: string; notes?: string }) {
    actionLoading.value = true
    error.value = null
    try {
      const response = await usersApi.enableUser(id, payload)

      // Update the user in the list
      const index = list.value.findIndex((user) => user.id === id)
      if (index !== -1) {
        list.value[index] = response.data
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = response.data
        if (currentUserDetail.value) {
          currentUserDetail.value.user = response.data
        }
      }

      return response
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
      const blob = await usersApi.export(params)

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
    fetchStats,
    updateVip,
    updateTags,
    reset2FA,
    disableUser,
    enableUser,
    exportData,
    setPage,
    setPageSize,
    reset,
  }
})
