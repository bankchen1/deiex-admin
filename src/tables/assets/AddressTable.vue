<template>
  <a-table
    :columns="columns"
    :data-source="addresses"
    :loading="loading"
    :pagination="false"
    row-key="id"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'address'">
        <div class="flex items-center justify-between">
          <a-tooltip :title="record.address">
            <span class="font-mono text-xs">{{ truncateAddress(record.address) }}</span>
          </a-tooltip>
          <a-button type="link" size="small" @click="copyToClipboard(record.address)">
            Copy
          </a-button>
        </div>
      </template>

      <template v-else-if="column.key === 'type'">
        <a-tag :color="record.type === 'hot' ? 'orange' : 'blue'">
          {{ record.type.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'balance'">
        <div>
          <div class="font-mono">{{ record.balance }}</div>
          <div class="text-xs text-gray-500">${{ record.balanceUsd.toLocaleString() }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'lastSyncAt'">
        <div>
          <div class="text-sm">{{ formatDateTime(record.lastSyncAt) }}</div>
          <div class="text-xs text-gray-500">{{ getTimeAgo(record.lastSyncAt) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleSync(record)"> Sync Balance </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { WalletAddress } from '@/contracts/assets'
import { formatDateTime } from '@/utils/date'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  addresses: WalletAddress[]
  loading?: boolean
}

interface Emits {
  (e: 'sync', address: WalletAddress): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 100,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: 'Label',
    dataIndex: 'label',
    key: 'label',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 250,
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    width: 150,
    align: 'right' as const,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Last Sync',
    dataIndex: 'lastSyncAt',
    key: 'lastSyncAt',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
  },
]

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    maintenance: 'warning',
  }
  return colorMap[status] || 'default'
}

function truncateAddress(address: string) {
  if (!address) return '-'
  return `${address.slice(0, 10)}...${address.slice(-10)}`
}

function getTimeAgo(timestamp: string) {
  return dayjs(timestamp).fromNow()
}

function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard')
    })
  }
}

function handleSync(address: WalletAddress) {
  emit('sync', address)
}
</script>
