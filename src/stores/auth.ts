// Authentication Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  login as loginFacade,
  logout as logoutFacade,
  refreshToken as refreshTokenFacade,
  getCurrentUser as getCurrentUserFacade,
  type LoginPayload,
  type LoginResponse,
} from '@/services/api/facade'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permission'
import type { AdminUser } from '@/contracts/auth'

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
  async function loginAction(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await loginFacade(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Login failed - no response data')
      }

      const { accessToken, refreshToken: newRefreshToken, user: userData } = data

      // Store tokens
      token.value = accessToken
      refreshToken.value = newRefreshToken
      sessionStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', newRefreshToken)

      // Store user data
      user.value = userData
      permissions.value = new Set(userData.permissions || [])

      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logoutAction(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await logoutFacade()

      if (err) {
        console.error('Logout API call failed:', err.message)
        // Continue with local cleanup even if API call fails
      }
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
      const { data, error: err } = await refreshTokenFacade({ refreshToken: refreshToken.value })

      if (err) {
        // Clear auth data on refresh failure
        clearAuthData()
        throw new Error(err.message)
      }

      if (!data) {
        // Clear auth data on refresh failure
        clearAuthData()
        throw new Error('Failed to refresh access token')
      }

      const { accessToken, refreshToken: newRefreshToken } = data

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
      const { data, error: err } = await getCurrentUserFacade()

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to fetch user info')
      }

      user.value = data
      permissions.value = new Set(data.permissions || [])

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data))
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
    login: loginAction,
    logout: logoutAction,
    refreshAccessToken,
    fetchUserInfo,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    clearAuthData,
    restoreSession,
  }
})
