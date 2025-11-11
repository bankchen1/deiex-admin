<template>
  <div class="email-segments-page">
    <a-page-header title="Email Segments" sub-title="Manage email subscriber segments">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Segment
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
        <a-col :span="12">
          <a-form-item label="&nbsp;">
            <a-space>
              <a-button type="primary" @click="handleSearch">Search</a-button>
              <a-button @click="handleResetFilters">Reset</a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <!-- Segments Table -->
    <a-card class="content-card">
      <EmailSegmentTable
        :data-source="segments"
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
          <span class="table-info">Total: {{ total }} segments</span>
        </template>
      </EmailSegmentTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import EmailSegmentTable from '@/tables/content/EmailSegmentTable.vue'
import type { EmailSegment } from '@/contracts/content'

// Mock data for demonstration
const mockSegments: EmailSegment[] = [
  {
    id: '1',
    name: 'New Users',
    description: 'Users who registered in the last 30 days',
    criteria: {
      registrationDate: 'last_30_days',
      status: 'active',
    },
    subscriberCount: 1250,
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'VIP Users',
    description: 'Users with VIP level 3 or higher',
    criteria: {
      vipLevel: '>=3',
      status: 'active',
    },
    subscriberCount: 890,
    status: 'active',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Active Traders',
    description: 'Users who made trades in the last 7 days',
    criteria: {
      lastTradeDate: 'last_7_days',
      status: 'active',
    },
    subscriberCount: 2450,
    status: 'active',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  },
]

// State
const filters = ref({
  status: undefined as string | undefined,
  search: '',
})

const segments = ref<EmailSegment[]>(mockSegments)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

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
    status: undefined,
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
  // Navigate to create segment page
  console.log('Create segment')
}

function handleView(record: EmailSegment) {
  // Navigate to view segment page
  console.log('View segment:', record)
}

function handleEdit(record: EmailSegment) {
  // Navigate to edit segment page
  console.log('Edit segment:', record)
}

function handleDelete(record: EmailSegment) {
  // In a real implementation, delete from API
  segments.value = segments.value.filter((segment) => segment.id !== record.id)
  total.value -= 1
  message.success('Email segment deleted successfully')
}
</script>

<style scoped>
.email-segments-page {
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
