<template>
  <div class="users-page">
    <!-- Page Header -->
    <a-page-header title="User Management" sub-title="View and manage user accounts">
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['users.export']">
            <a-button :loading="exportLoading" @click="handleExport">
              <template #icon><DownloadOutlined /></template>
              Export
            </a-button>
          </RBACGuard>
          <a-button :loading="loading" @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- KPI Cards -->
    <a-row :gutter="16" class="kpi-section">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Total Users" :value="stats?.total || 0" :loading="statsLoading">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Active Users"
            :value="stats?.active || 0"
            :value-style="{ color: '#52c41a' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Today's Registrations"
            :value="stats?.todayRegistrations || 0"
            :value-style="{ color: '#1890ff' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <UserAddOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="KYC Pending"
            :value="stats?.kycPending || 0"
            :value-style="{ color: '#faad14' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Filters and Content -->
    <a-card class="content-card">
      <!-- Filters -->
      <div class="filter-section">
        <a-form layout="inline" :model="filters">
          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All Status"
              style="width: 150px"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="disabled">Disabled</a-select-option>
              <a-select-option value="suspended">Suspended</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="VIP Level">
            <a-select
              v-model:value="filters.vipLevel"
              placeholder="All Levels"
              style="width: 150px"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Levels</a-select-option>
              <a-select-option :value="0">VIP 0</a-select-option>
              <a-select-option :value="1">VIP 1</a-select-option>
              <a-select-option :value="2">VIP 2</a-select-option>
              <a-select-option :value="3">VIP 3</a-select-option>
              <a-select-option :value="4">VIP 4</a-select-option>
              <a-select-option :value="5">VIP 5</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="KYC Status">
            <a-select
              v-model:value="filters.kycStatus"
              placeholder="All KYC Status"
              style="width: 150px"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All KYC Status</a-select-option>
              <a-select-option value="none">None</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="approved">Approved</a-select-option>
              <a-select-option value="rejected">Rejected</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Risk Tags">
            <TagPicker
              v-model:value="filters.tags"
              :options="tagOptions"
              placeholder="Filter by tags"
              style="width: 200px"
            />
          </a-form-item>

          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="User ID, Email, Phone"
              style="width: 200px"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSearch"> Search </a-button>
          </a-form-item>

          <a-form-item>
            <a-button @click="handleResetFilters">Reset</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- Table -->
      <UserTable
        v-model:selected-row-keys="selectedRowKeys"
        :data-source="list"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @quick-view="handleQuickView"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} users</span>
        </template>
      </UserTable>
    </a-card>

    <!-- Quick View Drawer -->
    <QuickViewDrawer
      v-model:open="quickViewDrawerOpen"
      :user-id="currentUserId"
      @view-detail="handleViewDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import { useUsersStore } from '@/stores/users'
import RBACGuard from '@/shared/RBACGuard.vue'
import TagPicker from '@/shared/TagPicker.vue'
import UserTable from '@/tables/users/UserTable.vue'
import QuickViewDrawer from '@/modals/users/QuickViewDrawer.vue'
import type { User } from '@/types/models'

const router = useRouter()
const usersStore = useUsersStore()

// State
const filters = ref({
  status: undefined as string | undefined,
  vipLevel: undefined as number | undefined,
  kycStatus: undefined as string | undefined,
  tags: [] as string[],
  search: '',
})
const selectedRowKeys = ref<string[]>([])
const quickViewDrawerOpen = ref(false)
const currentUserId = ref<string | undefined>(undefined)

// Common risk tags for filtering
const tagOptions = [
  'high_risk',
  'suspicious_activity',
  'multiple_accounts',
  'chargeback',
  'fraud_attempt',
  'money_laundering',
  'sanctioned',
  'pep',
  'adverse_media',
]

// Computed
const loading = computed(() => usersStore.loading)
const statsLoading = computed(() => usersStore.statsLoading)
const exportLoading = computed(() => usersStore.exportLoading)
const list = computed(() => usersStore.list)
const total = computed(() => usersStore.total)
const currentPage = computed(() => usersStore.currentPage)
const pageSize = computed(() => usersStore.pageSize)
const stats = computed(() => usersStore.stats)

// Lifecycle
onMounted(() => {
  fetchData()
  fetchStats()
})

// Methods
async function fetchData() {
  const params: any = {
    status: filters.value.status,
    vipLevel: filters.value.vipLevel,
    kycStatus: filters.value.kycStatus,
    tags: filters.value.tags.length > 0 ? filters.value.tags : undefined,
    search: filters.value.search || undefined,
  }

  try {
    await usersStore.fetchList(params)
  } catch (e: any) {
    message.error(e.message || 'Failed to fetch users list')
  }
}

async function fetchStats() {
  try {
    await usersStore.fetchStats()
  } catch (e: any) {
    message.error(e.message || 'Failed to fetch statistics')
  }
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  usersStore.setPage(1)
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    status: undefined,
    vipLevel: undefined,
    kycStatus: undefined,
    tags: [],
    search: '',
  }
  usersStore.setPage(1)
  fetchData()
}

function handleRefresh() {
  fetchData()
  fetchStats()
}

async function handleExport() {
  const params: any = {
    status: filters.value.status,
    vipLevel: filters.value.vipLevel,
    kycStatus: filters.value.kycStatus,
    tags: filters.value.tags.length > 0 ? filters.value.tags : undefined,
    search: filters.value.search || undefined,
  }

  try {
    await usersStore.exportData(params)
    message.success('Export completed successfully')
  } catch (e: any) {
    message.error(e.message || 'Failed to export data')
  }
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  usersStore.setPage(pagination.current)
  usersStore.setPageSize(pagination.pageSize)
  fetchData()
}

function handleView(record: User) {
  router.push(`/admin/users/${record.id}`)
}

function handleQuickView(record: User) {
  currentUserId.value = record.id
  quickViewDrawerOpen.value = true
}

function handleViewDetail(userId: string) {
  router.push(`/admin/users/${userId}`)
}
</script>

<style scoped>
.users-page {
  padding: 24px;
}

.kpi-section {
  margin: 24px 0;
}

.content-card {
  margin-top: 16px;
}

.filter-section {
  margin-bottom: 16px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
