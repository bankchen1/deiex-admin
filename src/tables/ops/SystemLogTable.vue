<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1200 }"
    row-key="id"
    @change="handleChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'level'">
        <a-tag :color="getLevelColor(record.level)">
          {{ record.level.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'timestamp'">
        {{ formatDateTime(record.timestamp) }}
      </template>

      <template v-else-if="column.key === 'message'">
        <div class="message-cell">
          {{ truncateMessage(record.message) }}
        </div>
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
import { computed } from 'vue'
import type { SystemLog } from '@/services/api/ops'
import { formatDateTime } from '@/utils/date'

interface Props {
  dataSource: SystemLog[]
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
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    width: 100,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    width: 150,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    ellipsis: true,
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

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    debug: 'default',
    info: 'blue',
    warn: 'orange',
    error: 'red',
  }
  return colors[level] || 'default'
}

function truncateMessage(message: string, maxLength = 100): string {
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
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

.request-id {
  font-family: monospace;
  font-size: 12px;
}
</style>
