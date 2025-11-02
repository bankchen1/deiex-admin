<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1500 }"
    row-key="id"
    @change="handleChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'timestamp'">
        {{ formatDateTime(record.timestamp) }}
      </template>

      <template v-else-if="column.key === 'source'">
        <a-tag>{{ record.source }}</a-tag>
      </template>

      <template v-else-if="column.key === 'message'">
        <div class="message-cell">
          {{ truncateMessage(record.message) }}
        </div>
      </template>

      <template v-else-if="column.key === 'errorCode'">
        <a-tag v-if="record.errorCode" color="red">
          {{ record.errorCode }}
        </a-tag>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'statusCode'">
        <a-tag v-if="record.statusCode" :color="getStatusColor(record.statusCode)">
          {{ record.statusCode }}
        </a-tag>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'apiEndpoint'">
        <a-typography-text
          v-if="record.apiEndpoint"
          :copyable="{ text: record.apiEndpoint }"
          class="api-endpoint"
        >
          {{ truncateEndpoint(record.apiEndpoint) }}
        </a-typography-text>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'requestId'">
        <a-typography-text
          v-if="record.requestId"
          :copyable="{ text: record.requestId }"
          class="request-id"
        >
          {{ record.requestId.substring(0, 8) }}...
        </a-typography-text>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-button type="link" size="small" @click="emit('viewDetail', record.id)">
          View Detail
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { ErrorLog } from '@/services/api/ops'
import { formatDateTime } from '@/utils/date'

interface Props {
  dataSource: ErrorLog[]
  loading?: boolean
  total: number
  pagination: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'viewDetail', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
    sorter: true,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    width: 120,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    ellipsis: true,
  },
  {
    title: 'Error Code',
    dataIndex: 'errorCode',
    key: 'errorCode',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'statusCode',
    key: 'statusCode',
    width: 100,
  },
  {
    title: 'API Endpoint',
    dataIndex: 'apiEndpoint',
    key: 'apiEndpoint',
    width: 200,
  },
  {
    title: 'Request ID',
    dataIndex: 'requestId',
    key: 'requestId',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right' as const,
  },
]

function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return 'red'
  if (statusCode >= 400) return 'orange'
  return 'default'
}

function truncateMessage(message: string, maxLength = 100): string {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

function truncateEndpoint(endpoint: string, maxLength = 40): string {
  if (endpoint.length <= maxLength) return endpoint
  return '...' + endpoint.substring(endpoint.length - maxLength)
}

function handleChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}
</script>

<style scoped>
.message-cell {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-endpoint,
.request-id {
  font-family: monospace;
  font-size: 12px;
}
</style>
