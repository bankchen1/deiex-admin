<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    @change="handleTableChange"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>

    <!-- Custom column renderers -->
    <template #bodyCell="{ column, record }">
      <!-- Name column -->
      <template v-if="column.key === 'name'">
        <a-button type="link" size="small" @click="handleView(record)">
          {{ record.name }}
        </a-button>
      </template>

      <!-- Type column -->
      <template v-else-if="column.key === 'type'">
        <a-tag :color="getTypeColor(record.type)">
          {{ getTypeText(record.type) }}
        </a-tag>
      </template>

      <!-- Channels column -->
      <template v-else-if="column.key === 'channels'">
        <a-space>
          <a-tag
            v-for="channel in record.channels"
            :key="channel"
            :color="getChannelColor(channel)"
          >
            {{ getChannelText(channel) }}
          </a-tag>
        </a-space>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
          <a-popconfirm
            title="Are you sure you want to delete this template?"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" size="small" danger>Delete</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { NotificationTemplate } from '@/contracts/content'

interface Props {
  dataSource: NotificationTemplate[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: NotificationTemplate): void
  (e: 'edit', record: NotificationTemplate): void
  (e: 'delete', record: NotificationTemplate): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'System', value: 'system' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Alert', value: 'alert' },
    ],
  },
  {
    title: 'Channels',
    key: 'channels',
    width: 200,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'Push', value: 'push' },
    ],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    title: 'Variables',
    dataIndex: 'variables',
    key: 'variables',
    width: 150,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
])

// Helper functions
function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    system: 'blue',
    marketing: 'gold',
    alert: 'red',
  }
  return colorMap[type] || 'default'
}

function getTypeText(type: string): string {
  const textMap: Record<string, string> = {
    system: 'System',
    marketing: 'Marketing',
    alert: 'Alert',
  }
  return textMap[type] || type
}

function getChannelColor(channel: string): string {
  const colorMap: Record<string, string> = {
    email: 'blue',
    sms: 'green',
    push: 'purple',
  }
  return colorMap[channel] || 'default'
}

function getChannelText(channel: string): string {
  const textMap: Record<string, string> = {
    email: 'Email',
    sms: 'SMS',
    push: 'Push',
  }
  return textMap[channel] || channel
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'orange',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
  }
  return textMap[status] || status
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: NotificationTemplate) {
  emit('view', record)
}

function handleEdit(record: NotificationTemplate) {
  emit('edit', record)
}

function handleDelete(record: NotificationTemplate) {
  emit('delete', record)
}
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
