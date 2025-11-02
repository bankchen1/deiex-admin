<template>
  <a-table
    :columns="columns"
    :data-source="balances"
    :loading="loading"
    :pagination="false"
    row-key="chain"
    size="small"
    :summary="() => summaryData"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'chain'">
        <div class="flex items-center">
          <a-badge :status="getChainStatusBadge(record.status)" />
          <span class="font-medium ml-2">{{ record.chain }}</span>
        </div>
      </template>

      <template v-else-if="column.key === 'hotBalance'">
        <div>
          <div class="font-mono">{{ record.hotBalance }}</div>
          <div class="text-xs text-gray-500">${{ record.hotBalanceUsd.toLocaleString() }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'coldBalance'">
        <div>
          <div class="font-mono">{{ record.coldBalance }}</div>
          <div class="text-xs text-gray-500">${{ record.coldBalanceUsd.toLocaleString() }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'totalBalance'">
        <div>
          <div class="font-mono font-semibold">{{ record.totalBalance }}</div>
          <div class="text-xs text-gray-500 font-semibold">
            ${{ record.totalBalanceUsd.toLocaleString() }}
          </div>
        </div>
      </template>

      <template v-else-if="column.key === 'ratio'">
        <a-progress
          :percent="record.hotRatio"
          :stroke-color="getRatioColor(record.hotRatio)"
          size="small"
        />
        <div class="text-xs text-gray-500 mt-1">
          Hot: {{ record.hotRatio }}% / Cold: {{ 100 - record.hotRatio }}%
        </div>
      </template>

      <template v-else-if="column.key === 'lastSyncAt'">
        <div>
          <div class="text-sm">{{ formatDateTime(record.lastSyncAt) }}</div>
          <div class="text-xs text-gray-500">{{ getTimeAgo(record.lastSyncAt) }}</div>
        </div>
      </template>
    </template>

    <template #summary>
      <a-table-summary>
        <a-table-summary-row>
          <a-table-summary-cell :index="0" :col-span="1">
            <span class="font-semibold">Total</span>
          </a-table-summary-cell>
          <a-table-summary-cell :index="1" align="right">
            <div>
              <div class="font-semibold">${{ totalHotUsd.toLocaleString() }}</div>
            </div>
          </a-table-summary-cell>
          <a-table-summary-cell :index="2" align="right">
            <div>
              <div class="font-semibold">${{ totalColdUsd.toLocaleString() }}</div>
            </div>
          </a-table-summary-cell>
          <a-table-summary-cell :index="3" align="right">
            <div>
              <div class="font-semibold">${{ totalBalanceUsd.toLocaleString() }}</div>
            </div>
          </a-table-summary-cell>
          <a-table-summary-cell :index="4" :col-span="2" />
        </a-table-summary-row>
      </a-table-summary>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDateTime } from '@/utils/date'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface ChainBalance {
  chain: string
  hotBalance: string
  hotBalanceUsd: number
  coldBalance: string
  coldBalanceUsd: number
  totalBalance: string
  totalBalanceUsd: number
  hotRatio: number
  status: 'healthy' | 'degraded' | 'down'
  lastSyncAt: string
}

interface Props {
  balances: ChainBalance[]
  loading?: boolean
}

const props = defineProps<Props>()

const columns = [
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 120,
  },
  {
    title: 'Hot Wallet Balance',
    dataIndex: 'hotBalance',
    key: 'hotBalance',
    width: 180,
    align: 'right' as const,
  },
  {
    title: 'Cold Wallet Balance',
    dataIndex: 'coldBalance',
    key: 'coldBalance',
    width: 180,
    align: 'right' as const,
  },
  {
    title: 'Total Balance',
    dataIndex: 'totalBalance',
    key: 'totalBalance',
    width: 180,
    align: 'right' as const,
  },
  {
    title: 'Hot/Cold Ratio',
    dataIndex: 'ratio',
    key: 'ratio',
    width: 200,
  },
  {
    title: 'Last Sync',
    dataIndex: 'lastSyncAt',
    key: 'lastSyncAt',
    width: 180,
  },
]

const summaryData = computed(() => ({
  totalHotUsd: totalHotUsd.value,
  totalColdUsd: totalColdUsd.value,
  totalBalanceUsd: totalBalanceUsd.value,
}))

const totalHotUsd = computed(() => {
  return props.balances.reduce((sum, balance) => sum + balance.hotBalanceUsd, 0)
})

const totalColdUsd = computed(() => {
  return props.balances.reduce((sum, balance) => sum + balance.coldBalanceUsd, 0)
})

const totalBalanceUsd = computed(() => {
  return props.balances.reduce((sum, balance) => sum + balance.totalBalanceUsd, 0)
})

function getChainStatusBadge(status: string) {
  const statusMap: Record<string, 'success' | 'processing' | 'error' | 'default' | 'warning'> = {
    healthy: 'success',
    degraded: 'warning',
    down: 'error',
  }
  return statusMap[status] || 'default'
}

function getRatioColor(hotRatio: number) {
  // Ideal hot wallet ratio is 10-30%
  if (hotRatio < 10) return '#faad14' // Too low - warning
  if (hotRatio <= 30) return '#52c41a' // Good - success
  if (hotRatio <= 50) return '#1890ff' // Acceptable - info
  return '#ff4d4f' // Too high - danger
}

function getTimeAgo(timestamp: string) {
  return dayjs(timestamp).fromNow()
}
</script>

<style scoped>
:deep(.ant-table-summary) {
  background-color: #fafafa;
}
</style>
