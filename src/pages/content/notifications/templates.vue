<template>
  <div class="notification-templates-page">
    <a-page-header title="Notification Templates" sub-title="Manage notification templates">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Template
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
          <a-form-item label="Type">
            <a-select
              v-model:value="filters.type"
              placeholder="All Types"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Types</a-select-option>
              <a-select-option value="system">System</a-select-option>
              <a-select-option value="marketing">Marketing</a-select-option>
              <a-select-option value="alert">Alert</a-select-option>
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
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="inactive">Inactive</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
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
        <a-col :span="6">
          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="Search by name or description"
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

    <!-- Templates Table -->
    <a-card class="content-card">
      <NotificationTemplateTable
        :data-source="templates"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} templates</span>
        </template>
      </NotificationTemplateTable>
    </a-card>

    <!-- Create/Edit Drawer -->
    <NotificationTemplateDrawer
      v-model:open="drawerVisible"
      :template="currentTemplate"
      :mode="drawerMode"
      @submit="handleTemplateSubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import NotificationTemplateTable from '@/tables/content/NotificationTemplateTable.vue'
import NotificationTemplateDrawer from '@/modals/content/NotificationTemplateDrawer.vue'
import type { NotificationTemplate } from '@/contracts/content'

// Mock data for demonstration
const mockTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Welcome email for new users',
    type: 'system',
    title: { en: 'Welcome to DEIEX!' },
    content: { en: 'Thank you for joining our platform...' },
    channels: ['email'],
    status: 'active',
    variables: ['username'],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Security Alert',
    description: 'Security alert for suspicious activities',
    type: 'alert',
    title: { en: 'Security Alert: New Login' },
    content: { en: 'We detected a new login to your account...' },
    channels: ['email', 'sms'],
    status: 'active',
    variables: ['username', 'ip', 'location'],
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Market Update',
    description: 'Market update notifications',
    type: 'marketing',
    title: { en: 'Market Update: {{symbol}} Price Surge' },
    content: { en: '{{symbol}} price has surged {{percentage}}% in the last hour...' },
    channels: ['push'],
    status: 'active',
    variables: ['symbol', 'percentage'],
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  },
]

// State
const filters = ref({
  type: undefined as string | undefined,
  status: undefined as string | undefined,
  channel: undefined as string | undefined,
  search: '',
})

const templates = ref<NotificationTemplate[]>(mockTemplates)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentTemplate = ref<NotificationTemplate | null>(null)

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
    type: undefined,
    status: undefined,
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
  currentTemplate.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleView(record: NotificationTemplate) {
  currentTemplate.value = record
  drawerMode.value = 'view'
  drawerVisible.value = true
}

function handleEdit(record: NotificationTemplate) {
  currentTemplate.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleDelete(record: NotificationTemplate) {
  // In a real implementation, delete from API
  templates.value = templates.value.filter((template) => template.id !== record.id)
  total.value -= 1
  message.success('Notification template deleted successfully')
}

async function handleTemplateSubmit(payload: any) {
  // In a real implementation, save to API
  if (drawerMode.value === 'create') {
    const newTemplate: NotificationTemplate = {
      id: (templates.value.length + 1).toString(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    templates.value.unshift(newTemplate)
    total.value += 1
    message.success('Notification template created successfully')
  } else if (drawerMode.value === 'edit' && currentTemplate.value) {
    const index = templates.value.findIndex((template) => template.id === currentTemplate.value!.id)
    if (index !== -1) {
      templates.value[index] = {
        ...currentTemplate.value,
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      message.success('Notification template updated successfully')
    }
  }

  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentTemplate.value = null
}
</script>

<style scoped>
.notification-templates-page {
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
