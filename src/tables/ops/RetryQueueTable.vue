<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1300 }"
    row-key="id"
    @change="handleChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'task'">
        <div>
          <div class="task-name">{{ record.taskName }}</div>
          <a-typography-text type="secondary" style="font-size: 12px">
            {{ record.taskType }}
          </a-typography-text>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'attempts'">
        <a-progress
          :percent="(record.attempt / record.maxAttempts) * 100"
          :show-info="false"
          :status="record.status === 'failed' ? 'exception' : 'active'"
        />
        <div style="margin-top: 4px; font-size: 12px">
          {{ record.attempt }} / {{ record.maxAttempts }}
        </div>
      </template>

      <template v-else-if="column.key === 'error'">
        <a-tooltip v-if="record.error" :title="record.error">
          <div class="error-message">{{ truncateError(record.error) }}</div>
        </a-tooltip>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'nextRetry'">
        <div v-if="record.nextRetryAt">
          {{ formatDateTime(record.nextRetryAt) }}
        </div>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'createdAt'">
        {{ formatDateTime(record.createdAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="ops.tasks.manage">
            <a-button
              type="link"
              size="small"
              :disabled="record.status === 'processing'"
              @click="emit('retry', record.id)"
            >
              Retry Now
            </a-button>
            <a-button type="link" size="small" danger @click="emit('delete', record.id)">
              Delete
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { RetryQueueItem } from '@/services/api/ops'
import { formatDateTime } from '@/utils/date'
import RBACGuard from '@/shared/RBACGuard.vue'

interface Props {
  dataSource: RetryQueueItem[]
  loading?: boolean
  total: number
  pagination: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'retry', id: string): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Task',
    dataIndex: 'taskName',
    key: 'task',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Attempts',
    dataIndex: 'attempt',
    key: 'attempts',
    width: 150,
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error',
    ellipsis: true,
  },
  {
    title: 'Next Retry',
    dataIndex: 'nextRetryAt',
    key: 'nextRetry',
    width: 180,
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
    width: 180,
    fixed: 'right' as const,
  },
]

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'default',
    processing: 'blue',
    failed: 'red',
  }
  return colors[status] || 'default'
}

function truncateError(error: string, maxLength = 50): string {
  if (error.length <= maxLength) return error
  return error.substring(0, maxLength) + '...'
}

function handleChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}
</script>

<style scoped>
.task-name {
  font-weight: 500;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
