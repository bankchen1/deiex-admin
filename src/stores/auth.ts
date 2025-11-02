// Authentication Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api/AdminApiClient'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permission'
import type { AdminUser, ApiResponse } from '@/types'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AdminUser
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(sessionStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const user = ref<AdminUser | null>(null)
  const permissions = ref<Set<string>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRoles = computed(() => user.value?.roles || [])
  const userPermissions = computed(() => Array.from(permissions.value))

  // Actions
  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload)
      const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data

      // Store tokens
      token.value = accessToken
      refreshToken.value = newRefreshToken
      sessionStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', newRefreshToken)

      // Store user data
      user.value = userData
      permissions.value = new Set(userData.permissions)

      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Call logout API
      await apiClient.post('/auth/logout')
    } catch (err) {
      console.error('Logout API call failed:', err)
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear local state
      clearAuthData()
      loading.value = false
    }
  }

  async function refreshAccessToken(): Promise<void> {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >('/auth/refresh', { refreshToken: refreshToken.value })

      const { accessToken, refreshToken: newRefreshToken } = response.data

      // Update tokens
      token.value = accessToken
      refreshToken.value = newRefreshToken
      sessionStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', newRefreshToken)
    } catch (err) {
      // Clear auth data on refresh failure
      clearAuthData()
      throw err
    }
  }

  async function fetchUserInfo(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<ApiResponse<AdminUser>>('/auth/me')
      user.value = response.data
      permissions.value = new Set(response.data.permissions)

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user info'
      throw err
    } finally {
      loading.value = false
    }
  }

  function checkPermission(permission: string): boolean {
    return hasPermission(permissions.value, permission)
  }

  function checkAnyPermission(perms: string[]): boolean {
    return hasAnyPermission(permissions.value, perms)
  }

  function checkAllPermissions(perms: string[]): boolean {
    return hasAllPermissions(permissions.value, perms)
  }

  function clearAuthData(): void {
    token.value = null
    refreshToken.value = null
    user.value = null
    permissions.value = new Set()

    // Clear storage
    sessionStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  function restoreSession(): void {
    // Restore from localStorage on app initialization
    const storedUser = localStorage.getItem('user')
    const storedToken = sessionStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')

    if (storedUser && storedToken && storedRefreshToken) {
      try {
        const userData = JSON.parse(storedUser) as AdminUser
        user.value = userData
        token.value = storedToken
        refreshToken.value = storedRefreshToken
        permissions.value = new Set(userData.permissions)
      } catch (err) {
        console.error('Failed to restore session:', err)
        clearAuthData()
      }
    }
  }

  return {
    // State
    token,
    refreshToken,
    user,
    permissions,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRoles,
    userPermissions,
    // Actions
    login,
    logout,
    refreshAccessToken,
    fetchUserInfo,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    clearAuthData,
    restoreSession,
  }
})
