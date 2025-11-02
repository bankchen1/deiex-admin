<template>
  <a-table
    :columns="columns"
    :data-source="transactions"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'type'">
        <a-tag :color="record.type === 'deposit' ? 'green' : 'orange'">
          <ArrowDownOutlined v-if="record.type === 'deposit'" />
          <ArrowUpOutlined v-else />
          {{ record.type.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'user'">
        <div>
          <div class="font-medium">{{ record.userNickname }}</div>
          <div class="text-xs text-gray-500">{{ record.userId }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'amount'">
        <div>
          <div class="font-semibold">{{ record.amount }} {{ record.currency }}</div>
          <div class="text-xs text-gray-500">${{ formatNumber(record.amountUsd) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'riskScore'">
        <a-tag :color="getRiskColor(record.riskScore)">
          {{ record.riskScore }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'timestamp'">
        <span class="text-sm">{{ record.timestamp }}</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleViewDetail(record)">
            View Details
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { formatNumber } from '@/utils/format'

interface LargeTransaction {
  id: string
  type: 'deposit' | 'withdrawal'
  userId: string
  userNickname: string
  currency: string
  amount: string
  amountUsd: number
  status: string
  timestamp: string
  riskScore: number
}

interface Props {
  transactions: LargeTransaction[]
  loading?: boolean
}

defineProps<Props>()

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: 'User',
    key: 'user',
    width: 180,
  },
  {
    title: 'Amount',
    key: 'amount',
    width: 200,
    sorter: (a: LargeTransaction, b: LargeTransaction) => a.amountUsd - b.amountUsd,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Risk Score',
    dataIndex: 'riskScore',
    key: 'riskScore',
    width: 100,
    sorter: (a: LargeTransaction, b: LargeTransaction) => a.riskScore - b.riskScore,
  },
  {
    title: 'Time',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right' as const,
  },
]

const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} transactions`,
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    completed: 'success',
    approved: 'processing',
    pending: 'warning',
    rejected: 'error',
    failed: 'error',
  }
  return colorMap[status] || 'default'
}

function getRiskColor(score: number): string {
  if (score >= 70) return 'red'
  if (score >= 40) return 'orange'
  return 'green'
}

function handleViewDetail(record: LargeTransaction) {
  // Emit event or navigate to detail page
  console.log('View detail:', record)
}
</script>
