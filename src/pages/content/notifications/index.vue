<template>
  <div class="notifications-page">
    <a-page-header
      title="Notification Management"
      sub-title="Manage system notifications and templates"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Notification
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card class="filter-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="Template">
            <a-select
              v-model:value="filters.templateId"
              placeholder="All Templates"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Templates</a-select-option>
              <a-select-option value="1">Welcome Email</a-select-option>
              <a-select-option value="2">Security Alert</a-select-option>
              <a-select-option value="3">Market Update</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Category">
            <a-select
              v-model:value="filters.category"
              placeholder="All Categories"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Categories</a-select-option>
              <a-select-option value="system">System</a-select-option>
              <a-select-option value="security">Security</a-select-option>
              <a-select-option value="marketing">Marketing</a-select-option>
              <a-select-option value="account">Account</a-select-option>
              <a-select-option value="market">Market</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All Status"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="sent">Sent</a-select-option>
              <a-select-option value="failed">Failed</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Priority">
            <a-select
              v-model:value="filters.priority"
              placeholder="All Priorities"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Priorities</a-select-option>
              <a-select-option value="low">Low</a-select-option>
              <a-select-option value="normal">Normal</a-select-option>
              <a-select-option value="high">High</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="Channel">
            <a-select
              v-model:value="filters.channel"
              placeholder="All Channels"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Channels</a-select-option>
              <a-select-option value="email">Email</a-select-option>
              <a-select-option value="sms">SMS</a-select-option>
              <a-select-option value="push">Push</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="18">
          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="Search by title or content"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="handleSearch">Search</a-button>
            <a-button @click="handleResetFilters">Reset</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- Notifications Table -->
    <a-card class="content-card">
      <NotificationTable
        :data-source="notifications"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @resend="handleResend"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} notifications</span>
        </template>
      </NotificationTable>
    </a-card>

    <!-- View Drawer -->
    <NotificationDrawer
      v-model:open="drawerVisible"
      :notification="currentNotification"
      :mode="'view'"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import NotificationTable from '@/tables/content/NotificationTable.vue'
import NotificationDrawer from '@/modals/content/NotificationDrawer.vue'
import type { Notification } from '@/types/models'

// Mock data for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Welcome Email',
    title: 'Welcome to DEIEX!',
    content: 'Thank you for joining our platform...',
    channels: ['email'],
    status: 'sent',
    priority: 'normal',
    sentAt: '2023-06-15T10:00:00Z',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Security Alert',
    title: 'Security Alert: New Login',
    content: 'We detected a new login to your account...',
    channels: ['email', 'sms'],
    status: 'sent',
    priority: 'high',
    sentAt: '2023-06-14T15:30:00Z',
    createdAt: '2023-06-14T15:30:00Z',
    updatedAt: '2023-06-14T15:30:00Z',
  },
  {
    id: '3',
    templateId: '3',
    templateName: 'Market Update',
    title: 'Market Update: BTC Price Surge',
    content: 'Bitcoin price has surged 5% in the last hour...',
    channels: ['push'],
    status: 'pending',
    priority: 'normal',
    createdAt: '2023-06-16T09:00:00Z',
    updatedAt: '2023-06-16T09:00:00Z',
  },
]

// State
const filters = ref({
  templateId: undefined as string | undefined,
  category: undefined as string | undefined,
  status: undefined as string | undefined,
  priority: undefined as string | undefined,
  channel: undefined as string | undefined,
  search: '',
})

const notifications = ref<Notification[]>(mockNotifications)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)
const currentNotification = ref<Notification | null>(null)

// Lifecycle
onMounted(() => {
  fetchData()
})

// Methods
async function fetchData() {
  loading.value = true
  // In a real implementation, fetch data from API
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    templateId: undefined,
    category: undefined,
    status: undefined,
    priority: undefined,
    channel: undefined,
    search: '',
  }
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchData()
}

function handleCreate() {
  // Navigate to create notification page
  console.log('Create notification')
}

function handleView(record: Notification) {
  currentNotification.value = record
  drawerVisible.value = true
}

function handleResend(record: Notification) {
  // In a real implementation, resend via API
  message.success('Notification resend request submitted')
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentNotification.value = null
}
</script>

<style scoped>
.notifications-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.content-card {
  margin-top: 16px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
