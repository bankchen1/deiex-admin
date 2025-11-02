<template>
  <a-table
    :columns="columns"
    :data-source="retryQueue"
    :loading="loading"
    :pagination="false"
    row-key="id"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'type'">
        <a-tag :color="record.type === 'deposit' ? 'green' : 'red'">
          {{ record.type.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'transactionId'">
        <a-button type="link" size="small" @click="handleViewTransaction(record)">
          {{ record.transactionId }}
        </a-button>
      </template>

      <template v-else-if="column.key === 'attempts'">
        <a-progress
          :percent="(record.attempts / record.maxAttempts) * 100"
          :status="record.attempts >= record.maxAttempts ? 'exception' : 'active'"
          size="small"
        />
        <span class="text-xs text-gray-500 ml-2">
          {{ record.attempts }}/{{ record.maxAttempts }}
        </span>
      </template>

      <template v-else-if="column.key === 'lastError'">
        <a-tooltip :title="record.lastError">
          <span class="text-xs text-red-500">{{ truncateError(record.lastError) }}</span>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'nextRetryAt'">
        <div>
          <div class="text-sm">{{ formatDateTime(record.nextRetryAt) }}</div>
          <div class="text-xs text-gray-500">{{ getTimeUntil(record.nextRetryAt) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button
            type="link"
            size="small"
            :disabled="record.attempts >= record.maxAttempts"
            @click="handleRetry(record)"
          >
            Retry Now
          </a-button>
          <a-button type="link" danger size="small" @click="handleCancel(record)">
            Cancel
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { RetryTask } from '@/types/models'
import { formatDateTime } from '@/utils/date'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  retryQueue: RetryTask[]
  loading?: boolean
}

interface Emits {
  (e: 'retry', task: RetryTask): void
  (e: 'cancel', task: RetryTask): void
  (e: 'view-transaction', task: RetryTask): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: 'Transaction ID',
    dataIndex: 'transactionId',
    key: 'transactionId',
    width: 150,
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 100,
  },
  {
    title: 'Attempts',
    dataIndex: 'attempts',
    key: 'attempts',
    width: 150,
  },
  {
    title: 'Last Error',
    dataIndex: 'lastError',
    key: 'lastError',
    width: 250,
  },
  {
    title: 'Next Retry',
    dataIndex: 'nextRetryAt',
    key: 'nextRetryAt',
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
  },
]

function truncateError(error: string) {
  if (!error) return '-'
  return error.length > 50 ? `${error.slice(0, 50)}...` : error
}

function getTimeUntil(timestamp: string) {
  return dayjs(timestamp).fromNow()
}

function handleRetry(task: RetryTask) {
  emit('retry', task)
}

function handleCancel(task: RetryTask) {
  emit('cancel', task)
}

function handleViewTransaction(task: RetryTask) {
  emit('view-transaction', task)
}
</script>
