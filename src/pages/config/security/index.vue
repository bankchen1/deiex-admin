<template>
  <div class="security-page">
    <a-page-header
      title="Security Configuration"
      sub-title="Manage RBAC, admin users, IP whitelist, API keys, and audit logs"
    />

    <a-card :bordered="false">
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <!-- RBAC Tab -->
        <a-tab-pane key="rbac" tab="RBAC">
          <RBACGuard permissions="security.rbac.view">
            <a-row :gutter="16">
              <a-col :span="8">
                <PermissionTree :tree-data="permissionTree" :loading="permissionsLoading" />
              </a-col>
              <a-col :span="16">
                <a-card title="Roles" :loading="rolesLoading">
                  <template #extra>
                    <RBACGuard permissions="security.roles.create">
                      <a-button type="primary" @click="handleCreateRole">
                        <template #icon><PlusOutlined /></template>
                        Create Role
                      </a-button>
                    </RBACGuard>
                  </template>

                  <SearchBar
                    v-model:value="roleFilters.keyword"
                    placeholder="Search roles..."
                    style="margin-bottom: 16px"
                    @search="fetchRolesData"
                  />

                  <RolesTable
                    :data-source="roles"
                    :loading="rolesLoading"
                    :pagination="rolesPagination"
                    @change="handleRolesTableChange"
                    @edit="handleEditRole"
                    @delete="handleDeleteRole"
                    @assign-permissions="handleAssignPermissions"
                  />
                </a-card>
              </a-col>
            </a-row>
          </RBACGuard>
        </a-tab-pane>

        <!-- Admin Users Tab -->
        <a-tab-pane key="admin-users" tab="Admin Users">
          <RBACGuard permissions="security.admin-users.view">
            <a-card :loading="adminUsersLoading">
              <template #extra>
                <RBACGuard permissions="security.admin-users.create">
                  <a-button type="primary" @click="handleCreateAdminUser">
                    <template #icon><PlusOutlined /></template>
                    Create Admin User
                  </a-button>
                </RBACGuard>
              </template>

              <a-space style="margin-bottom: 16px; width: 100%" direction="vertical">
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-input
                      v-model:value="adminUserFilters.keyword"
                      placeholder="Search by username or email..."
                      @press-enter="fetchAdminUsersData"
                    >
                      <template #prefix><SearchOutlined /></template>
                    </a-input>
                  </a-col>
                  <a-col :span="6">
                    <a-select
                      v-model:value="adminUserFilters.status"
                      placeholder="Filter by status"
                      style="width: 100%"
                      allow-clear
                      @change="fetchAdminUsersData"
                    >
                      <a-select-option value="active">Active</a-select-option>
                      <a-select-option value="disabled">Disabled</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6">
                    <a-select
                      v-model:value="adminUserFilters.role"
                      placeholder="Filter by role"
                      style="width: 100%"
                      allow-clear
                      @change="fetchAdminUsersData"
                    >
                      <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.name }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="4">
                    <a-button type="primary" block @click="fetchAdminUsersData"> Search </a-button>
                  </a-col>
                </a-row>
              </a-space>

              <AdminUsersTable
                :data-source="adminUsers"
                :loading="adminUsersLoading"
                :pagination="adminUsersPagination"
                @change="handleAdminUsersTableChange"
                @edit="handleEditAdminUser"
                @disable="handleDisableAdminUser"
                @enable="handleEnableAdminUser"
                @reset-password="handleResetPassword"
              />
            </a-card>
          </RBACGuard>
        </a-tab-pane>

        <!-- IP Whitelist Tab -->
        <a-tab-pane key="ip-whitelist" tab="IP Whitelist">
          <RBACGuard permissions="security.ip-whitelist.view">
            <a-card :loading="ipWhitelistLoading">
              <template #extra>
                <RBACGuard permissions="security.ip-whitelist.create">
                  <a-button type="primary" @click="handleAddIpWhitelist">
                    <template #icon><PlusOutlined /></template>
                    Add IP
                  </a-button>
                </RBACGuard>
              </template>

              <SearchBar
                v-model:value="ipWhitelistFilters.keyword"
                placeholder="Search IP addresses..."
                style="margin-bottom: 16px"
                @search="fetchIpWhitelistData"
              />

              <IpWhitelistTable
                :data-source="ipWhitelist"
                :loading="ipWhitelistLoading"
                :pagination="ipWhitelistPagination"
                @change="handleIpWhitelistTableChange"
                @remove="handleRemoveIpWhitelist"
              />
            </a-card>
          </RBACGuard>
        </a-tab-pane>

        <!-- API Keys Tab -->
        <a-tab-pane key="api-keys" tab="API Keys">
          <RBACGuard permissions="security.api-keys.view">
            <a-card :loading="apiKeysLoading">
              <template #extra>
                <RBACGuard permissions="security.api-keys.create">
                  <a-button type="primary" @click="handleCreateApiKey">
                    <template #icon><PlusOutlined /></template>
                    Create API Key
                  </a-button>
                </RBACGuard>
              </template>

              <a-space style="margin-bottom: 16px; width: 100%" direction="vertical">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-input
                      v-model:value="apiKeyFilters.keyword"
                      placeholder="Search API keys..."
                      @press-enter="fetchApiKeysData"
                    >
                      <template #prefix><SearchOutlined /></template>
                    </a-input>
                  </a-col>
                  <a-col :span="8">
                    <a-select
                      v-model:value="apiKeyFilters.status"
                      placeholder="Filter by status"
                      style="width: 100%"
                      allow-clear
                      @change="fetchApiKeysData"
                    >
                      <a-select-option value="active">Active</a-select-option>
                      <a-select-option value="disabled">Disabled</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="4">
                    <a-button type="primary" block @click="fetchApiKeysData"> Search </a-button>
                  </a-col>
                </a-row>
              </a-space>

              <ApiKeysTable
                :data-source="apiKeys"
                :loading="apiKeysLoading"
                :pagination="apiKeysPagination"
                @change="handleApiKeysTableChange"
                @regenerate="handleRegenerateApiKey"
                @revoke="handleRevokeApiKey"
              />
            </a-card>
          </RBACGuard>
        </a-tab-pane>

        <!-- Audit Logs Tab -->
        <a-tab-pane key="audit-logs" tab="Audit Logs">
          <RBACGuard permissions="security.audit-logs.view">
            <a-card :loading="auditLogsLoading">
              <a-space style="margin-bottom: 16px; width: 100%" direction="vertical">
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-select
                      v-model:value="auditLogFilters.objectType"
                      placeholder="Object Type"
                      style="width: 100%"
                      allow-clear
                      @change="fetchAuditLogsData"
                    >
                      <a-select-option value="role">Role</a-select-option>
                      <a-select-option value="admin-user">Admin User</a-select-option>
                      <a-select-option value="ip-whitelist">IP Whitelist</a-select-option>
                      <a-select-option value="api-key">API Key</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="6">
                    <a-select
                      v-model:value="auditLogFilters.adminId"
                      placeholder="Admin User"
                      style="width: 100%"
                      allow-clear
                      show-search
                      @change="fetchAuditLogsData"
                    >
                      <a-select-option v-for="user in adminUsers" :key="user.id" :value="user.id">
                        {{ user.username }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="8">
                    <a-range-picker
                      v-model:value="auditLogDateRange"
                      style="width: 100%"
                      @change="handleAuditLogDateChange"
                    />
                  </a-col>
                  <a-col :span="4">
                    <a-button type="primary" block @click="fetchAuditLogsData"> Search </a-button>
                  </a-col>
                </a-row>
              </a-space>

              <AuditLogsTable
                :data-source="auditLogs"
                :loading="auditLogsLoading"
                :pagination="auditLogsPagination"
                @change="handleAuditLogsTableChange"
                @view-detail="handleViewAuditLogDetail"
                @export="handleExportAuditLogs"
              />
            </a-card>
          </RBACGuard>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Modals -->
    <EditRoleDrawer
      v-model:open="roleDrawerVisible"
      :role-data="currentRole"
      :mode="roleDrawerMode"
      :available-permissions="allPermissions"
      :loading="rolesLoading"
      @submit="handleRoleSubmit"
    />

    <EditAdminUserDrawer
      v-model:open="adminUserDrawerVisible"
      :user-data="currentAdminUser"
      :mode="adminUserDrawerMode"
      :available-roles="roles.map((r) => ({ id: r.id, name: r.name }))"
      :loading="adminUsersLoading"
      @submit="handleAdminUserSubmit"
    />

    <AssignPermModal
      v-model:open="assignPermModalVisible"
      :role-info="currentRole"
      :permission-tree="permissionTree"
      :initial-permissions="currentRole?.permissions || []"
      :loading="rolesLoading"
      @confirm="handlePermissionsAssigned"
    />

    <DisableAdminModal
      v-model:open="disableAdminModalVisible"
      :admin-user="currentAdminUser"
      :loading="adminUsersLoading"
      @confirm="handleAdminUserDisabled"
    />

    <a-modal
      v-model:open="ipWhitelistModalVisible"
      title="Add IP to Whitelist"
      :confirm-loading="ipWhitelistLoading"
      @ok="handleIpWhitelistSubmit"
    >
      <IpWhitelistForm ref="ipWhitelistFormRef" @submit="handleIpWhitelistSubmit" />
    </a-modal>

    <a-modal
      v-model:open="apiKeyModalVisible"
      title="Create API Key"
      :width="720"
      :confirm-loading="apiKeysLoading"
      @ok="handleApiKeySubmit"
    >
      <ApiKeyForm
        ref="apiKeyFormRef"
        :available-permissions="allPermissions"
        @submit="handleApiKeySubmit"
      />
    </a-modal>

    <a-modal
      v-model:open="auditLogDetailModalVisible"
      title="Audit Log Details"
      :width="800"
      :footer="null"
    >
      <AuditTrail v-if="currentAuditLog" :records="[currentAuditLog]" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useSecurityStore } from '@/stores/security'
import RBACGuard from '@/shared/RBACGuard.vue'
import SearchBar from '@/shared/SearchBar.vue'
import AuditTrail from '@/shared/AuditTrail.vue'
import PermissionTree from '@/widgets/tree/PermissionTree.vue'
import RolesTable from '@/tables/security/RolesTable.vue'
import AdminUsersTable from '@/tables/security/AdminUsersTable.vue'
import IpWhitelistTable from '@/tables/security/IpWhitelistTable.vue'
import ApiKeysTable from '@/tables/security/ApiKeysTable.vue'
import AuditLogsTable from '@/tables/security/AuditLogsTable.vue'
import EditRoleDrawer from '@/modals/security/EditRoleDrawer.vue'
import EditAdminUserDrawer from '@/modals/security/EditAdminUserDrawer.vue'
import AssignPermModal from '@/modals/security/AssignPermModal.vue'
import DisableAdminModal from '@/modals/security/DisableAdminModal.vue'
import IpWhitelistForm from '@/forms/security/IpWhitelistForm.vue'
import ApiKeyForm from '@/forms/security/ApiKeyForm.vue'
import type {
  Role,
  AdminUser,
  IpWhitelistEntry,
  ApiKey,
  AuditLog,
} from '@/services/api/config.security'

const securityStore = useSecurityStore()

// Active tab
const activeTab = ref('rbac')

// Roles
const roles = computed(() => securityStore.roles)
const rolesLoading = computed(() => securityStore.rolesLoading)
const rolesTotal = computed(() => securityStore.rolesTotal)
const roleFilters = reactive({
  keyword: '',
})
const rolesPagination = reactive({
  current: 1,
  pageSize: 10,
  total: rolesTotal,
})

// Permissions
const permissionTree = computed(() => securityStore.permissionTree)
const allPermissions = computed(() => securityStore.allPermissions)
const permissionsLoading = computed(() => securityStore.permissionsLoading)

// Admin Users
const adminUsers = computed(() => securityStore.adminUsers)
const adminUsersLoading = computed(() => securityStore.adminUsersLoading)
const adminUsersTotal = computed(() => securityStore.adminUsersTotal)
const adminUserFilters = reactive({
  keyword: '',
  status: undefined,
  role: undefined,
})
const adminUsersPagination = reactive({
  current: 1,
  pageSize: 10,
  total: adminUsersTotal,
})

// IP Whitelist
const ipWhitelist = computed(() => securityStore.ipWhitelist)
const ipWhitelistLoading = computed(() => securityStore.ipWhitelistLoading)
const ipWhitelistTotal = computed(() => securityStore.ipWhitelistTotal)
const ipWhitelistFilters = reactive({
  keyword: '',
})
const ipWhitelistPagination = reactive({
  current: 1,
  pageSize: 10,
  total: ipWhitelistTotal,
})

// API Keys
const apiKeys = computed(() => securityStore.apiKeys)
const apiKeysLoading = computed(() => securityStore.apiKeysLoading)
const apiKeysTotal = computed(() => securityStore.apiKeysTotal)
const apiKeyFilters = reactive({
  keyword: '',
  status: undefined,
})
const apiKeysPagination = reactive({
  current: 1,
  pageSize: 10,
  total: apiKeysTotal,
})

// Audit Logs
const auditLogs = computed(() => securityStore.auditLogs)
const auditLogsLoading = computed(() => securityStore.auditLogsLoading)
const auditLogsTotal = computed(() => securityStore.auditLogsTotal)
const auditLogFilters = reactive({
  objectType: undefined,
  adminId: undefined,
  startTime: undefined,
  endTime: undefined,
})
const auditLogDateRange = ref()
const auditLogsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: auditLogsTotal,
})

// Modals
const roleDrawerVisible = ref(false)
const roleDrawerMode = ref<'create' | 'edit'>('create')
const currentRole = ref<Role | null>(null)

const adminUserDrawerVisible = ref(false)
const adminUserDrawerMode = ref<'create' | 'edit'>('create')
const currentAdminUser = ref<AdminUser | null>(null)

const assignPermModalVisible = ref(false)
const disableAdminModalVisible = ref(false)
const ipWhitelistModalVisible = ref(false)
const apiKeyModalVisible = ref(false)
const auditLogDetailModalVisible = ref(false)
const currentAuditLog = ref<AuditLog | null>(null)

const ipWhitelistFormRef = ref()
const apiKeyFormRef = ref()

onMounted(() => {
  fetchInitialData()
})

async function fetchInitialData() {
  await Promise.all([fetchPermissionTreeData(), fetchAllPermissionsData(), fetchRolesData()])
}

function handleTabChange(key: string) {
  switch (key) {
    case 'rbac':
      fetchRolesData()
      break
    case 'admin-users':
      fetchAdminUsersData()
      break
    case 'ip-whitelist':
      fetchIpWhitelistData()
      break
    case 'api-keys':
      fetchApiKeysData()
      break
    case 'audit-logs':
      fetchAuditLogsData()
      break
  }
}

// Roles
async function fetchRolesData() {
  try {
    await securityStore.fetchRoles({
      page: rolesPagination.current,
      pageSize: rolesPagination.pageSize,
      keyword: roleFilters.keyword,
    })
    rolesPagination.total = rolesTotal.value
  } catch (error) {
    message.error('Failed to fetch roles')
  }
}

function handleRolesTableChange(pagination: any) {
  rolesPagination.current = pagination.current
  rolesPagination.pageSize = pagination.pageSize
  fetchRolesData()
}

function handleCreateRole() {
  currentRole.value = null
  roleDrawerMode.value = 'create'
  roleDrawerVisible.value = true
}

function handleEditRole(role: Role) {
  currentRole.value = role
  roleDrawerMode.value = 'edit'
  roleDrawerVisible.value = true
}

async function handleRoleSubmit(data: any) {
  try {
    if (roleDrawerMode.value === 'create') {
      await securityStore.createRole(data)
      message.success('Role created successfully')
    } else {
      await securityStore.updateRole(currentRole.value!.id, data)
      message.success('Role updated successfully')
    }
    roleDrawerVisible.value = false
    fetchRolesData()
  } catch (error) {
    message.error('Failed to save role')
  }
}

async function handleDeleteRole(role: Role) {
  try {
    await securityStore.deleteRole(role.id)
    message.success('Role deleted successfully')
    fetchRolesData()
  } catch (error) {
    message.error('Failed to delete role')
  }
}

function handleAssignPermissions(role: Role) {
  currentRole.value = role
  assignPermModalVisible.value = true
}

async function handlePermissionsAssigned(permissions: string[]) {
  try {
    await securityStore.updateRole(currentRole.value!.id, { permissions })
    message.success('Permissions assigned successfully')
    assignPermModalVisible.value = false
    fetchRolesData()
  } catch (error) {
    message.error('Failed to assign permissions')
  }
}

// Permissions
async function fetchPermissionTreeData() {
  try {
    await securityStore.fetchPermissionTree()
  } catch (error) {
    message.error('Failed to fetch permission tree')
  }
}

async function fetchAllPermissionsData() {
  try {
    await securityStore.fetchAllPermissions()
  } catch (error) {
    message.error('Failed to fetch permissions')
  }
}

// Admin Users
async function fetchAdminUsersData() {
  try {
    await securityStore.fetchAdminUsers({
      page: adminUsersPagination.current,
      pageSize: adminUsersPagination.pageSize,
      keyword: adminUserFilters.keyword,
      status: adminUserFilters.status,
      role: adminUserFilters.role,
    })
    adminUsersPagination.total = adminUsersTotal.value
  } catch (error) {
    message.error('Failed to fetch admin users')
  }
}

function handleAdminUsersTableChange(pagination: any) {
  adminUsersPagination.current = pagination.current
  adminUsersPagination.pageSize = pagination.pageSize
  fetchAdminUsersData()
}

function handleCreateAdminUser() {
  currentAdminUser.value = null
  adminUserDrawerMode.value = 'create'
  adminUserDrawerVisible.value = true
}

function handleEditAdminUser(user: AdminUser) {
  currentAdminUser.value = user
  adminUserDrawerMode.value = 'edit'
  adminUserDrawerVisible.value = true
}

async function handleAdminUserSubmit(data: any) {
  try {
    if (adminUserDrawerMode.value === 'create') {
      await securityStore.createAdminUser(data)
      message.success('Admin user created successfully')
    } else {
      await securityStore.updateAdminUser(currentAdminUser.value!.id, data)
      message.success('Admin user updated successfully')
    }
    adminUserDrawerVisible.value = false
    fetchAdminUsersData()
  } catch (error) {
    message.error('Failed to save admin user')
  }
}

function handleDisableAdminUser(user: AdminUser) {
  currentAdminUser.value = user
  disableAdminModalVisible.value = true
}

async function handleAdminUserDisabled(reason: string) {
  try {
    await securityStore.disableAdminUser(currentAdminUser.value!.id, reason)
    message.success('Admin user disabled successfully')
    disableAdminModalVisible.value = false
    fetchAdminUsersData()
  } catch (error) {
    message.error('Failed to disable admin user')
  }
}

async function handleEnableAdminUser(user: AdminUser) {
  try {
    await securityStore.enableAdminUser(user.id)
    message.success('Admin user enabled successfully')
    fetchAdminUsersData()
  } catch (error) {
    message.error('Failed to enable admin user')
  }
}

async function handleResetPassword(user: AdminUser) {
  // TODO: Implement password reset modal
  message.info('Password reset functionality to be implemented')
}

// IP Whitelist
async function fetchIpWhitelistData() {
  try {
    await securityStore.fetchIpWhitelist({
      page: ipWhitelistPagination.current,
      pageSize: ipWhitelistPagination.pageSize,
      keyword: ipWhitelistFilters.keyword,
    })
    ipWhitelistPagination.total = ipWhitelistTotal.value
  } catch (error) {
    message.error('Failed to fetch IP whitelist')
  }
}

function handleIpWhitelistTableChange(pagination: any) {
  ipWhitelistPagination.current = pagination.current
  ipWhitelistPagination.pageSize = pagination.pageSize
  fetchIpWhitelistData()
}

function handleAddIpWhitelist() {
  ipWhitelistModalVisible.value = true
}

async function handleIpWhitelistSubmit(data: any) {
  try {
    await securityStore.addIpWhitelist(data)
    message.success('IP added to whitelist successfully')
    ipWhitelistModalVisible.value = false
    fetchIpWhitelistData()
  } catch (error) {
    message.error('Failed to add IP to whitelist')
  }
}

async function handleRemoveIpWhitelist(entry: IpWhitelistEntry) {
  try {
    await securityStore.removeIpWhitelist(entry.id)
    message.success('IP removed from whitelist successfully')
    fetchIpWhitelistData()
  } catch (error) {
    message.error('Failed to remove IP from whitelist')
  }
}

// API Keys
async function fetchApiKeysData() {
  try {
    await securityStore.fetchApiKeys({
      page: apiKeysPagination.current,
      pageSize: apiKeysPagination.pageSize,
      keyword: apiKeyFilters.keyword,
      status: apiKeyFilters.status,
    })
    apiKeysPagination.total = apiKeysTotal.value
  } catch (error) {
    message.error('Failed to fetch API keys')
  }
}

function handleApiKeysTableChange(pagination: any) {
  apiKeysPagination.current = pagination.current
  apiKeysPagination.pageSize = pagination.pageSize
  fetchApiKeysData()
}

function handleCreateApiKey() {
  apiKeyModalVisible.value = true
}

async function handleApiKeySubmit(data: any) {
  try {
    await securityStore.createApiKey(data)
    message.success('API key created successfully')
    apiKeyModalVisible.value = false
    fetchApiKeysData()
  } catch (error) {
    message.error('Failed to create API key')
  }
}

async function handleRegenerateApiKey(key: ApiKey) {
  try {
    await securityStore.regenerateApiKey(key.id)
    message.success('API key regenerated successfully')
    fetchApiKeysData()
  } catch (error) {
    message.error('Failed to regenerate API key')
  }
}

async function handleRevokeApiKey(key: ApiKey) {
  try {
    await securityStore.revokeApiKey(key.id)
    message.success('API key revoked successfully')
    fetchApiKeysData()
  } catch (error) {
    message.error('Failed to revoke API key')
  }
}

// Audit Logs
async function fetchAuditLogsData() {
  try {
    await securityStore.fetchAuditLogs({
      page: auditLogsPagination.current,
      pageSize: auditLogsPagination.pageSize,
      objectType: auditLogFilters.objectType,
      adminId: auditLogFilters.adminId,
      startTime: auditLogFilters.startTime,
      endTime: auditLogFilters.endTime,
    })
    auditLogsPagination.total = auditLogsTotal.value
  } catch (error) {
    message.error('Failed to fetch audit logs')
  }
}

function handleAuditLogsTableChange(pagination: any) {
  auditLogsPagination.current = pagination.current
  auditLogsPagination.pageSize = pagination.pageSize
  fetchAuditLogsData()
}

function handleAuditLogDateChange(dates: any) {
  if (dates && dates.length === 2) {
    auditLogFilters.startTime = dates[0].format('YYYY-MM-DD HH:mm:ss')
    auditLogFilters.endTime = dates[1].format('YYYY-MM-DD HH:mm:ss')
  } else {
    auditLogFilters.startTime = undefined
    auditLogFilters.endTime = undefined
  }
}

function handleViewAuditLogDetail(log: AuditLog) {
  currentAuditLog.value = log
  auditLogDetailModalVisible.value = true
}

async function handleExportAuditLogs() {
  try {
    await securityStore.exportAuditLogs(auditLogFilters)
    message.success('Audit logs exported successfully')
  } catch (error) {
    message.error('Failed to export audit logs')
  }
}
</script>

<style scoped>
.security-page {
  padding: 24px;
}
</style>
