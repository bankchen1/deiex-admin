<template>
  <div class="announcements-page">
    <a-page-header title="Announcements" sub-title="Manage system announcements">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Create Announcement
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card :bordered="false" style="margin-top: 16px">
      <!-- Filters -->
      <div class="filter-section">
        <a-form layout="inline">
          <a-form-item label="Status">
            <a-select style="width: 120px" @change="handleStatusChange">
              <a-select-option value="">All</a-select-option>
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="draft">Draft</a-select-option>
              <a-select-option value="archived">Archived</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input-search placeholder="Search announcements..." style="width: 200px" />
          </a-form-item>
        </a-form>
      </div>

      <!-- Announcements Table -->
      <a-table
        :data-source="announcements"
        :columns="columns"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <strong>{{ record.title }}</strong>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>

          <template v-else-if="column.key === 'priority'">
            <a-tag :color="getPriorityColor(record.priority)">{{ record.priority }}</a-tag>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">View</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record)"
                >Delete</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Announcement Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'create' ? 'Create Announcement' : 'Edit Announcement'"
      :width="800"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="Title" required>
          <a-input v-model:value="formState.title" placeholder="Enter announcement title" />
        </a-form-item>
        <a-form-item label="Content" required>
          <a-textarea
            v-model:value="formState.content"
            placeholder="Enter announcement content"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="Status">
          <a-select v-model:value="formState.status">
            <a-select-option value="draft">Draft</a-select-option>
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="archived">Archived</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Priority">
          <a-select v-model:value="formState.priority">
            <a-select-option value="low">Low</a-select-option>
            <a-select-option value="medium">Medium</a-select-option>
            <a-select-option value="high">High</a-select-option>
            <a-select-option value="critical">Critical</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Scheduled Publish Time">
          <a-date-picker
            v-model:value="formState.scheduledPublishTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import type { Announcement } from '@/contracts/content'

// Mock data structure
interface Announcement {
  id: string
  title: string
  content: string
  status: 'draft' | 'active' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduledPublishTime?: string
  createdAt: string
  updatedAt: string
}

// State
const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// Form state
const formState = reactive<Partial<Announcement>>({
  title: '',
  content: '',
  status: 'draft',
  priority: 'medium',
})

// Mock data
const announcements = ref<Announcement[]>([
  {
    id: '1',
    title: 'System Maintenance Notice',
    content: 'We will be performing scheduled maintenance on Sunday from 2 AM to 4 AM UTC.',
    status: 'active',
    priority: 'high',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    title: 'New Feature Release',
    content: 'We are excited to announce the release of our new trading interface.',
    status: 'active',
    priority: 'medium',
    createdAt: '2024-01-10 14:20:00',
    updatedAt: '2024-01-10 14:20:00',
  },
])

// Columns
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
  },
]

// Methods
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: 'green',
    draft: 'orange',
    archived: 'default',
  }
  return colorMap[status] || 'default'
}

function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    low: 'default',
    medium: 'blue',
    high: 'orange',
    critical: 'red',
  }
  return colorMap[priority] || 'default'
}

function handleStatusChange(value: string) {
  console.log('Status changed to:', value)
}

function handleTableChange(pagination: any) {
  console.log('Table changed:', pagination)
}

function handleCreate() {
  Object.assign(formState, {
    title: '',
    content: '',
    status: 'draft',
    priority: 'medium',
    scheduledPublishTime: undefined,
  })
  modalMode.value = 'create'
  modalVisible.value = true
}

function handleRefresh() {
  console.log('Refreshing announcements')
}

function handleView(record: Announcement) {
  console.log('Viewing announcement:', record)
}

function handleEdit(record: Announcement) {
  Object.assign(formState, { ...record })
  modalMode.value = 'edit'
  modalVisible.value = true
}

function handleDelete(record: Announcement) {
  console.log('Deleting announcement:', record)
}

function handleSave() {
  console.log('Saving announcement:', formState)
  modalVisible.value = false
}

function handleCancel() {
  modalVisible.value = false
}

onMounted(() => {
  console.log('Announcements page mounted')
})
</script>

<style scoped>
.announcements-page {
  padding: 24px;
}

.filter-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
