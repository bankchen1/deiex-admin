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
        :data-source="users"
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
import RBACGuard from '@/shared/RBACGuard.vue'
import TagPicker from '@/shared/TagPicker.vue'
import UserTable from '@/ui/widgets/users/UserTable.vue'
import QuickViewDrawer from '@/ui/widgets/users/QuickViewDrawer.vue'
import type { User } from '@/contracts/users'

// Props
const props = defineProps({
  users: {
    type: Array as () => User[],
    default: () => [],
  },
  stats: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  statsLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

// Emits
const emit = defineEmits([
  'refresh',
  'update-vip',
  'update-tags',
  'reset-2fa',
  'disable-user',
  'enable-user',
  'export-data',
])

const router = useRouter()

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
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const exportLoading = ref(false)

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
const users = computed(() => props.users)

// Methods
function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  currentPage.value = 1
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
  currentPage.value = 1
  fetchData()
}

function handleRefresh() {
  emit('refresh')
}

async function handleExport() {
  const params: any = {
    status: filters.value.status,
    vipLevel: filters.value.vipLevel,
    kycStatus: filters.value.kycStatus,
    tags: filters.value.tags.length > 0 ? filters.value.tags : undefined,
    search: filters.value.search || undefined,
  }

  exportLoading.value = true
  try {
    emit('export-data', params)
    message.success('Export completed successfully')
  } catch (e: any) {
    message.error(e.message || 'Failed to export data')
  } finally {
    exportLoading.value = false
  }
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
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

function handleUpdateVip(id: string, vipLevel: number, reason: string, notes?: string) {
  emit('update-vip', { id, vipLevel, reason, notes })
}

function handleUpdateTags(id: string, tags: string[], reason: string) {
  emit('update-tags', { id, tags, reason })
}

function handleReset2FA(id: string) {
  emit('reset-2fa', id)
}

function handleDisableUser(id: string) {
  emit('disable-user', id)
}

function handleEnableUser(id: string) {
  emit('enable-user', id)
}

function fetchData() {
  const params: any = {
    page: currentPage.value,
    pageSize: pageSize.value,
    status: filters.value.status,
    vipLevel: filters.value.vipLevel,
    kycStatus: filters.value.kycStatus,
    tags: filters.value.tags.length > 0 ? filters.value.tags : undefined,
    search: filters.value.search || undefined,
  }

  // In a real implementation, this would be handled by the parent component
  // For now, we'll just emit the event
  emit('refresh')
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
