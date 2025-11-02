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
      <!-- Title column -->
      <template v-if="column.key === 'title'">
        <div class="notification-title">
          <a-button type="link" size="small" @click="handleView(record)">
            {{ record.title }}
          </a-button>
          <a-tag v-if="record.priority === 'high'" color="red" size="small">High</a-tag>
        </div>
      </template>

      <!-- Template column -->
      <template v-else-if="column.key === 'template'">
        <span>{{ record.templateName }}</span>
      </template>

      <!-- Channels column -->
      <template v-else-if="column.key === 'channels'">
        <a-space size="small">
          <a-tag
            v-for="channel in record.channels"
            :key="channel"
            :color="getChannelColor(channel)"
          >
            {{ channel.toUpperCase() }}
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
          <a-button
            v-if="record.status === 'failed'"
            type="link"
            size="small"
            @click="handleResend(record)"
          >
            Resend
          </a-button>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { Notification } from '@/types/models'

interface Props {
  dataSource: Notification[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: Notification): void
  (e: 'resend', record: Notification): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'Title',
    key: 'title',
    width: 200,
    fixed: 'left',
  },
  {
    title: 'Template',
    key: 'template',
    width: 150,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'System', value: 'system' },
      { label: 'Security', value: 'security' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Account', value: 'account' },
      { label: 'Market', value: 'market' },
    ],
  },
  {
    title: 'Channels',
    key: 'channels',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Pending', value: 'pending' },
      { label: 'Sent', value: 'sent' },
      { label: 'Failed', value: 'failed' },
    ],
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Low', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Sent At',
    dataIndex: 'sentAt',
    key: 'sentAt',
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
function getChannelColor(channel: string): string {
  const colorMap: Record<string, string> = {
    email: 'blue',
    sms: 'green',
    push: 'purple',
  }
  return colorMap[channel] || 'default'
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    sent: 'green',
    failed: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    sent: 'Sent',
    failed: 'Failed',
  }
  return textMap[status] || status
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: Notification) {
  emit('view', record)
}

function handleResend(record: Notification) {
  emit('resend', record)
}
</script>

<style scoped>
.notification-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
