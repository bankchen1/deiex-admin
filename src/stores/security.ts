import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { securityApi } from '@/services/api/config.security'
import type {
  Role,
  AdminUser,
  IpWhitelistEntry,
  ApiKey,
  AuditLog,
  PermissionNode,
  RoleQueryParams,
  AdminUserQueryParams,
  IpWhitelistQueryParams,
  ApiKeyQueryParams,
  AuditLogQueryParams,
  CreateRolePayload,
  UpdateRolePayload,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
  CreateIpWhitelistPayload,
  CreateApiKeyPayload,
} from '@/services/api/config.security'

export const useSecurityStore = defineStore('security', () => {
  // State - Roles
  const rolesLoading = ref(false)
  const rolesError = ref<string | null>(null)
  const roles = ref<Role[]>([])
  const rolesTotal = ref(0)
  const currentRole = ref<Role | null>(null)

  // State - Permissions
  const permissionsLoading = ref(false)
  const permissionTree = ref<PermissionNode[]>([])
  const allPermissions = ref<string[]>([])

  // State - Admin Users
  const adminUsersLoading = ref(false)
  const adminUsersError = ref<string | null>(null)
  const adminUsers = ref<AdminUser[]>([])
  const adminUsersTotal = ref(0)
  const currentAdminUser = ref<AdminUser | null>(null)

  // State - IP Whitelist
  const ipWhitelistLoading = ref(false)
  const ipWhitelistError = ref<string | null>(null)
  const ipWhitelist = ref<IpWhitelistEntry[]>([])
  const ipWhitelistTotal = ref(0)

  // State - API Keys
  const apiKeysLoading = ref(false)
  const apiKeysError = ref<string | null>(null)
  const apiKeys = ref<ApiKey[]>([])
  const apiKeysTotal = ref(0)

  // State - Audit Logs
  const auditLogsLoading = ref(false)
  const auditLogsError = ref<string | null>(null)
  const auditLogs = ref<AuditLog[]>([])
  const auditLogsTotal = ref(0)
  const currentAuditLog = ref<AuditLog | null>(null)

  // Getters
  const hasRoles = computed(() => roles.value.length > 0)
  const hasAdminUsers = computed(() => adminUsers.value.length > 0)
  const hasIpWhitelist = computed(() => ipWhitelist.value.length > 0)
  const hasApiKeys = computed(() => apiKeys.value.length > 0)
  const hasAuditLogs = computed(() => auditLogs.value.length > 0)

  // Actions - Roles
  async function fetchRoles(params: RoleQueryParams = {}) {
    rolesLoading.value = true
    rolesError.value = null
    try {
      const response = await securityApi.getRoles(params)
      roles.value = response.data.items
      rolesTotal.value = response.data.total
      return response
    } catch (error: any) {
      rolesError.value = error.message || 'Failed to fetch roles'
      throw error
    } finally {
      rolesLoading.value = false
    }
  }

  async function fetchRoleById(id: string) {
    rolesLoading.value = true
    rolesError.value = null
    try {
      const response = await securityApi.getRoleById(id)
      currentRole.value = response.data
      return response
    } catch (error: any) {
      rolesError.value = error.message || 'Failed to fetch role'
      throw error
    } finally {
      rolesLoading.value = false
    }
  }

  async function createRole(payload: CreateRolePayload) {
    rolesLoading.value = true
    rolesError.value = null
    try {
      const response = await securityApi.createRole(payload)
      roles.value.unshift(response.data)
      rolesTotal.value++
      return response
    } catch (error: any) {
      rolesError.value = error.message || 'Failed to create role'
      throw error
    } finally {
      rolesLoading.value = false
    }
  }

  async function updateRole(id: string, payload: UpdateRolePayload) {
    rolesLoading.value = true
    rolesError.value = null
    try {
      const response = await securityApi.updateRole(id, payload)
      const index = roles.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        roles.value[index] = response.data
      }
      if (currentRole.value?.id === id) {
        currentRole.value = response.data
      }
      return response
    } catch (error: any) {
      rolesError.value = error.message || 'Failed to update role'
      throw error
    } finally {
      rolesLoading.value = false
    }
  }

  async function deleteRole(id: string) {
    rolesLoading.value = true
    rolesError.value = null
    try {
      const response = await securityApi.deleteRole(id)
      const index = roles.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        roles.value.splice(index, 1)
        rolesTotal.value--
      }
      return response
    } catch (error: any) {
      rolesError.value = error.message || 'Failed to delete role'
      throw error
    } finally {
      rolesLoading.value = false
    }
  }

  // Actions - Permissions
  async function fetchPermissionTree() {
    permissionsLoading.value = true
    try {
      const response = await securityApi.getPermissionTree()
      permissionTree.value = response.data
      return response
    } catch (error: any) {
      throw error
    } finally {
      permissionsLoading.value = false
    }
  }

  async function fetchAllPermissions() {
    permissionsLoading.value = true
    try {
      const response = await securityApi.getAllPermissions()
      allPermissions.value = response.data
      return response
    } catch (error: any) {
      throw error
    } finally {
      permissionsLoading.value = false
    }
  }

  // Actions - Admin Users
  async function fetchAdminUsers(params: AdminUserQueryParams = {}) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.getAdminUsers(params)
      adminUsers.value = response.data.items
      adminUsersTotal.value = response.data.total
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to fetch admin users'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function fetchAdminUserById(id: string) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.getAdminUserById(id)
      currentAdminUser.value = response.data
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to fetch admin user'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function createAdminUser(payload: CreateAdminUserPayload) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.createAdminUser(payload)
      adminUsers.value.unshift(response.data)
      adminUsersTotal.value++
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to create admin user'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function updateAdminUser(id: string, payload: UpdateAdminUserPayload) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.updateAdminUser(id, payload)
      const index = adminUsers.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        adminUsers.value[index] = response.data
      }
      if (currentAdminUser.value?.id === id) {
        currentAdminUser.value = response.data
      }
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to update admin user'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function disableAdminUser(id: string, reason: string) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.disableAdminUser(id, reason)
      const index = adminUsers.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        adminUsers.value[index].status = 'disabled'
      }
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to disable admin user'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function enableAdminUser(id: string) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.enableAdminUser(id)
      const index = adminUsers.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        adminUsers.value[index].status = 'active'
      }
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to enable admin user'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  async function resetAdminPassword(id: string, newPassword: string) {
    adminUsersLoading.value = true
    adminUsersError.value = null
    try {
      const response = await securityApi.resetAdminPassword(id, newPassword)
      return response
    } catch (error: any) {
      adminUsersError.value = error.message || 'Failed to reset password'
      throw error
    } finally {
      adminUsersLoading.value = false
    }
  }

  // Actions - IP Whitelist
  async function fetchIpWhitelist(params: IpWhitelistQueryParams = {}) {
    ipWhitelistLoading.value = true
    ipWhitelistError.value = null
    try {
      const response = await securityApi.getIpWhitelist(params)
      ipWhitelist.value = response.data.items
      ipWhitelistTotal.value = response.data.total
      return response
    } catch (error: any) {
      ipWhitelistError.value = error.message || 'Failed to fetch IP whitelist'
      throw error
    } finally {
      ipWhitelistLoading.value = false
    }
  }

  async function addIpWhitelist(payload: CreateIpWhitelistPayload) {
    ipWhitelistLoading.value = true
    ipWhitelistError.value = null
    try {
      const response = await securityApi.addIpWhitelist(payload)
      ipWhitelist.value.unshift(response.data)
      ipWhitelistTotal.value++
      return response
    } catch (error: any) {
      ipWhitelistError.value = error.message || 'Failed to add IP to whitelist'
      throw error
    } finally {
      ipWhitelistLoading.value = false
    }
  }

  async function removeIpWhitelist(id: string) {
    ipWhitelistLoading.value = true
    ipWhitelistError.value = null
    try {
      const response = await securityApi.removeIpWhitelist(id)
      const index = ipWhitelist.value.findIndex((ip) => ip.id === id)
      if (index !== -1) {
        ipWhitelist.value.splice(index, 1)
        ipWhitelistTotal.value--
      }
      return response
    } catch (error: any) {
      ipWhitelistError.value = error.message || 'Failed to remove IP from whitelist'
      throw error
    } finally {
      ipWhitelistLoading.value = false
    }
  }

  // Actions - API Keys
  async function fetchApiKeys(params: ApiKeyQueryParams = {}) {
    apiKeysLoading.value = true
    apiKeysError.value = null
    try {
      const response = await securityApi.getApiKeys(params)
      apiKeys.value = response.data.items
      apiKeysTotal.value = response.data.total
      return response
    } catch (error: any) {
      apiKeysError.value = error.message || 'Failed to fetch API keys'
      throw error
    } finally {
      apiKeysLoading.value = false
    }
  }

  async function createApiKey(payload: CreateApiKeyPayload) {
    apiKeysLoading.value = true
    apiKeysError.value = null
    try {
      const response = await securityApi.createApiKey(payload)
      apiKeys.value.unshift(response.data)
      apiKeysTotal.value++
      return response
    } catch (error: any) {
      apiKeysError.value = error.message || 'Failed to create API key'
      throw error
    } finally {
      apiKeysLoading.value = false
    }
  }

  async function revokeApiKey(id: string) {
    apiKeysLoading.value = true
    apiKeysError.value = null
    try {
      const response = await securityApi.revokeApiKey(id)
      const index = apiKeys.value.findIndex((k) => k.id === id)
      if (index !== -1) {
        apiKeys.value[index].status = 'disabled'
      }
      return response
    } catch (error: any) {
      apiKeysError.value = error.message || 'Failed to revoke API key'
      throw error
    } finally {
      apiKeysLoading.value = false
    }
  }

  async function regenerateApiKey(id: string) {
    apiKeysLoading.value = true
    apiKeysError.value = null
    try {
      const response = await securityApi.regenerateApiKey(id)
      const index = apiKeys.value.findIndex((k) => k.id === id)
      if (index !== -1) {
        apiKeys.value[index] = response.data
      }
      return response
    } catch (error: any) {
      apiKeysError.value = error.message || 'Failed to regenerate API key'
      throw error
    } finally {
      apiKeysLoading.value = false
    }
  }

  // Actions - Audit Logs
  async function fetchAuditLogs(params: AuditLogQueryParams = {}) {
    auditLogsLoading.value = true
    auditLogsError.value = null
    try {
      const response = await securityApi.getAuditLogs(params)
      auditLogs.value = response.data.items
      auditLogsTotal.value = response.data.total
      return response
    } catch (error: any) {
      auditLogsError.value = error.message || 'Failed to fetch audit logs'
      throw error
    } finally {
      auditLogsLoading.value = false
    }
  }

  async function fetchAuditLogById(id: string) {
    auditLogsLoading.value = true
    auditLogsError.value = null
    try {
      const response = await securityApi.getAuditLogById(id)
      currentAuditLog.value = response.data
      return response
    } catch (error: any) {
      auditLogsError.value = error.message || 'Failed to fetch audit log'
      throw error
    } finally {
      auditLogsLoading.value = false
    }
  }

  async function exportAuditLogs(params: AuditLogQueryParams = {}) {
    auditLogsLoading.value = true
    auditLogsError.value = null
    try {
      const blob = await securityApi.exportAuditLogs(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit-logs-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      auditLogsError.value = error.message || 'Failed to export audit logs'
      throw error
    } finally {
      auditLogsLoading.value = false
    }
  }

  // Reset functions
  function resetRoles() {
    rolesLoading.value = false
    rolesError.value = null
    roles.value = []
    rolesTotal.value = 0
    currentRole.value = null
  }

  function resetAdminUsers() {
    adminUsersLoading.value = false
    adminUsersError.value = null
    adminUsers.value = []
    adminUsersTotal.value = 0
    currentAdminUser.value = null
  }

  function resetIpWhitelist() {
    ipWhitelistLoading.value = false
    ipWhitelistError.value = null
    ipWhitelist.value = []
    ipWhitelistTotal.value = 0
  }

  function resetApiKeys() {
    apiKeysLoading.value = false
    apiKeysError.value = null
    apiKeys.value = []
    apiKeysTotal.value = 0
  }

  function resetAuditLogs() {
    auditLogsLoading.value = false
    auditLogsError.value = null
    auditLogs.value = []
    auditLogsTotal.value = 0
    currentAuditLog.value = null
  }

  return {
    // State - Roles
    rolesLoading,
    rolesError,
    roles,
    rolesTotal,
    currentRole,
    // State - Permissions
    permissionsLoading,
    permissionTree,
    allPermissions,
    // State - Admin Users
    adminUsersLoading,
    adminUsersError,
    adminUsers,
    adminUsersTotal,
    currentAdminUser,
    // State - IP Whitelist
    ipWhitelistLoading,
    ipWhitelistError,
    ipWhitelist,
    ipWhitelistTotal,
    // State - API Keys
    apiKeysLoading,
    apiKeysError,
    apiKeys,
    apiKeysTotal,
    // State - Audit Logs
    auditLogsLoading,
    auditLogsError,
    auditLogs,
    auditLogsTotal,
    currentAuditLog,
    // Getters
    hasRoles,
    hasAdminUsers,
    hasIpWhitelist,
    hasApiKeys,
    hasAuditLogs,
    // Actions - Roles
    fetchRoles,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    // Actions - Permissions
    fetchPermissionTree,
    fetchAllPermissions,
    // Actions - Admin Users
    fetchAdminUsers,
    fetchAdminUserById,
    createAdminUser,
    updateAdminUser,
    disableAdminUser,
    enableAdminUser,
    resetAdminPassword,
    // Actions - IP Whitelist
    fetchIpWhitelist,
    addIpWhitelist,
    removeIpWhitelist,
    // Actions - API Keys
    fetchApiKeys,
    createApiKey,
    revokeApiKey,
    regenerateApiKey,
    // Actions - Audit Logs
    fetchAuditLogs,
    fetchAuditLogById,
    exportAuditLogs,
    // Reset functions
    resetRoles,
    resetAdminUsers,
    resetIpWhitelist,
    resetApiKeys,
    resetAuditLogs,
  }
})
