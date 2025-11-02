<template>
  <a-table
    :columns="columns"
    :data-source="balances"
    :loading="loading"
    :pagination="pagination"
    row-key="currency"
    size="small"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'currency'">
        <a-space>
          <span class="font-semibold">{{ record.currency }}</span>
        </a-space>
      </template>

      <template v-else-if="column.key === 'totalBalance'">
        <div>
          <div class="font-medium">{{ record.totalBalance }}</div>
          <div class="text-xs text-gray-500">${{ formatNumber(record.totalBalanceUsd) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'hotBalance'">
        <div>
          <div>{{ record.hotBalance }}</div>
          <div class="text-xs text-gray-500">${{ formatNumber(record.hotBalanceUsd) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'coldBalance'">
        <div>
          <div>{{ record.coldBalance }}</div>
          <div class="text-xs text-gray-500">${{ formatNumber(record.coldBalanceUsd) }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'users'">
        <span>{{ formatNumber(record.users) }}</span>
      </template>

      <template v-else-if="column.key === 'change24h'">
        <a-tag :color="record.change24h >= 0 ? 'green' : 'red'">
          <ArrowUpOutlined v-if="record.change24h >= 0" />
          <ArrowDownOutlined v-else />
          {{ Math.abs(record.change24h).toFixed(2) }}%
        </a-tag>
      </template>

      <template v-else-if="column.key === 'ratio'">
        <a-progress
          :percent="((record.hotBalanceUsd / record.totalBalanceUsd) * 100).toFixed(1)"
          :format="(percent: number) => `${percent}% Hot / ${(100 - percent).toFixed(1)}% Cold`"
          size="small"
        />
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { formatNumber } from '@/utils/format'

interface CurrencyBalance {
  currency: string
  totalBalance: string
  totalBalanceUsd: number
  hotBalance: string
  hotBalanceUsd: number
  coldBalance: string
  coldBalanceUsd: number
  users: number
  change24h: number
}

interface Props {
  balances: CurrencyBalance[]
  loading?: boolean
}

defineProps<Props>()

const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 100,
  },
  {
    title: 'Total Balance',
    dataIndex: 'totalBalance',
    key: 'totalBalance',
    width: 180,
    sorter: (a: CurrencyBalance, b: CurrencyBalance) => a.totalBalanceUsd - b.totalBalanceUsd,
  },
  {
    title: 'Hot Wallet',
    dataIndex: 'hotBalance',
    key: 'hotBalance',
    width: 160,
  },
  {
    title: 'Cold Wallet',
    dataIndex: 'coldBalance',
    key: 'coldBalance',
    width: 160,
  },
  {
    title: 'Distribution',
    key: 'ratio',
    width: 200,
  },
  {
    title: 'Users',
    dataIndex: 'users',
    key: 'users',
    width: 100,
    sorter: (a: CurrencyBalance, b: CurrencyBalance) => a.users - b.users,
  },
  {
    title: '24h Change',
    dataIndex: 'change24h',
    key: 'change24h',
    width: 120,
    sorter: (a: CurrencyBalance, b: CurrencyBalance) => a.change24h - b.change24h,
  },
]

const pagination = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} currencies`,
}
</script>
