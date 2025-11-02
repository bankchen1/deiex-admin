<template>
  <div class="assets-overview-page">
    <div class="page-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Asset Overview</h1>
          <p class="text-gray-500 mt-1">Monitor platform-wide asset balances and transactions</p>
        </div>
        <a-space>
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
          <a-range-picker v-model:value="dateRange" @change="handleDateRangeChange" />
        </a-space>
      </div>
    </div>

    <!-- Total Balance Summary -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Total Platform Balance"
            :value="summary.totalBalance"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#1890ff', fontSize: '24px' }"
          >
            <template #prefix>
              <DollarOutlined />
            </template>
          </a-statistic>
          <div class="mt-2 text-sm text-gray-500">
            <ArrowUpOutlined v-if="summary.balanceChange >= 0" class="text-green-500" />
            <ArrowDownOutlined v-else class="text-red-500" />
            {{ Math.abs(summary.balanceChange).toFixed(2) }}% from yesterday
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Hot Wallet Balance"
            :value="summary.hotWalletBalance"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <FireOutlined />
            </template>
          </a-statistic>
          <div class="mt-2 text-sm text-gray-500">
            {{ summary.hotWalletRatio.toFixed(1) }}% of total
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Cold Wallet Balance"
            :value="summary.coldWalletBalance"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <SafetyOutlined />
            </template>
          </a-statistic>
          <div class="mt-2 text-sm text-gray-500">
            {{ summary.coldWalletRatio.toFixed(1) }}% of total
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Total Users"
            :value="summary.totalUsers"
            :value-style="{ color: '#722ed1' }"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
          <div class="mt-2 text-sm text-gray-500">With active balances</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Transaction Statistics -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="8">
        <a-card size="small" title="Deposits (24h)">
          <a-statistic
            :value="summary.deposits24h.volume"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#3f8600' }"
          />
          <div class="mt-2 text-sm text-gray-500">{{ summary.deposits24h.count }} transactions</div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Withdrawals (24h)">
          <a-statistic
            :value="summary.withdrawals24h.volume"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#cf1322' }"
          />
          <div class="mt-2 text-sm text-gray-500">
            {{ summary.withdrawals24h.count }} transactions
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card size="small" title="Net Flow (24h)">
          <a-statistic
            :value="summary.netFlow24h"
            :precision="2"
            prefix="$"
            :value-style="{
              color: summary.netFlow24h >= 0 ? '#3f8600' : '#cf1322',
            }"
          >
            <template #prefix>
              <ArrowUpOutlined v-if="summary.netFlow24h >= 0" />
              <ArrowDownOutlined v-else />
            </template>
          </a-statistic>
          <div class="mt-2 text-sm text-gray-500">Deposits - Withdrawals</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Balance by Currency -->
    <a-card title="Balance by Currency" :bordered="false" class="mb-6">
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="currencySearch"
            placeholder="Search currency"
            style="width: 200px"
            size="small"
          />
          <a-button size="small" @click="handleExportBalances">
            <template #icon>
              <DownloadOutlined />
            </template>
            Export
          </a-button>
        </a-space>
      </template>
      <CurrencyBalanceTable :balances="filteredCurrencyBalances" :loading="loading" />
    </a-card>

    <!-- Hot/Cold Wallet Ratio Chart -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="12">
        <a-card title="Wallet Distribution" :bordered="false">
          <WalletDistributionChart :data="walletDistributionData" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Balance Trend (7 Days)" :bordered="false">
          <BalanceTrendChart :data="balanceTrendData" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Large Transactions -->
    <a-card title="Recent Large Transactions" :bordered="false">
      <template #extra>
        <a-space>
          <a-select
            v-model:value="largeTransactionFilter"
            size="small"
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="all">All Types</a-select-option>
            <a-select-option value="deposit">Deposits</a-select-option>
            <a-select-option value="withdrawal">Withdrawals</a-select-option>
          </a-select>
          <a-input-number
            v-model:value="largeTransactionThreshold"
            :min="1000"
            :step="1000"
            size="small"
            style="width: 150px"
            prefix="$"
            @change="handleThresholdChange"
          >
            <template #addonBefore>Threshold</template>
          </a-input-number>
        </a-space>
      </template>
      <LargeTransactionTable
        :transactions="largeTransactions"
        :loading="largeTransactionsLoading"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DollarOutlined,
  FireOutlined,
  SafetyOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import CurrencyBalanceTable from '@/tables/assets/CurrencyBalanceTable.vue'
import LargeTransactionTable from '@/tables/assets/LargeTransactionTable.vue'
import WalletDistributionChart from '@/widgets/charts/WalletDistributionChart.vue'
import BalanceTrendChart from '@/widgets/charts/BalanceTrendChart.vue'
// import { useAssetsOverviewStore } from '@/stores/assetsOverview'

// const assetsOverviewStore = useAssetsOverviewStore()

// State
const loading = ref(false)
const largeTransactionsLoading = ref(false)
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const currencySearch = ref('')
const largeTransactionFilter = ref('all')
const largeTransactionThreshold = ref(10000)

// Mock data - in production, this would come from the store/API
const summary = ref({
  totalBalance: 12500000,
  balanceChange: 2.5,
  hotWalletBalance: 3125000,
  hotWalletRatio: 25,
  coldWalletBalance: 9375000,
  coldWalletRatio: 75,
  totalUsers: 15234,
  deposits24h: {
    volume: 1250000,
    count: 156,
  },
  withdrawals24h: {
    volume: 850000,
    count: 124,
  },
  netFlow24h: 400000,
})

const currencyBalances = ref([
  {
    currency: 'BTC',
    totalBalance: '125.5',
    totalBalanceUsd: 5250000,
    hotBalance: '31.375',
    hotBalanceUsd: 1312500,
    coldBalance: '94.125',
    coldBalanceUsd: 3937500,
    users: 3456,
    change24h: 3.2,
  },
  {
    currency: 'ETH',
    totalBalance: '2450.8',
    totalBalanceUsd: 4500000,
    hotBalance: '612.7',
    hotBalanceUsd: 1125000,
    coldBalance: '1838.1',
    coldBalanceUsd: 3375000,
    users: 5678,
    change24h: -1.5,
  },
  {
    currency: 'USDT',
    totalBalance: '2500000',
    totalBalanceUsd: 2500000,
    hotBalance: '625000',
    hotBalanceUsd: 625000,
    coldBalance: '1875000',
    coldBalanceUsd: 1875000,
    users: 8901,
    change24h: 0.8,
  },
  {
    currency: 'USDC',
    totalBalance: '250000',
    totalBalanceUsd: 250000,
    hotBalance: '62500',
    hotBalanceUsd: 62500,
    coldBalance: '187500',
    coldBalanceUsd: 187500,
    users: 2345,
    change24h: 1.2,
  },
])

const largeTransactions = ref<
  Array<{
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
  }>
>([
  {
    id: 'TX001',
    type: 'deposit' as const,
    userId: 'U12345',
    userNickname: 'trader_pro',
    currency: 'BTC',
    amount: '5.5',
    amountUsd: 230000,
    status: 'completed',
    timestamp: '2025-10-31 12:30:45',
    riskScore: 15,
  },
  {
    id: 'TX002',
    type: 'withdrawal' as const,
    userId: 'U67890',
    userNickname: 'whale_investor',
    currency: 'ETH',
    amount: '120',
    amountUsd: 220000,
    status: 'approved',
    timestamp: '2025-10-31 11:15:22',
    riskScore: 45,
  },
])

const walletDistributionData = ref([
  { name: 'Hot Wallet', value: 3125000 },
  { name: 'Cold Wallet', value: 9375000 },
])

const balanceTrendData = ref([
  { date: '10-25', balance: 12000000 },
  { date: '10-26', balance: 12100000 },
  { date: '10-27', balance: 12050000 },
  { date: '10-28', balance: 12200000 },
  { date: '10-29', balance: 12300000 },
  { date: '10-30', balance: 12450000 },
  { date: '10-31', balance: 12500000 },
])

// Computed
const filteredCurrencyBalances = computed(() => {
  if (!currencySearch.value) {
    return currencyBalances.value
  }
  return currencyBalances.value.filter((balance) =>
    balance.currency.toLowerCase().includes(currencySearch.value.toLowerCase())
  )
})

// Methods
async function fetchOverviewData() {
  loading.value = true
  try {
    // In production, fetch from API
    // await assetsOverviewStore.fetchOverview()
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch (error) {
    message.error('Failed to fetch overview data')
  } finally {
    loading.value = false
  }
}

async function fetchLargeTransactions() {
  largeTransactionsLoading.value = true
  try {
    // In production, fetch from API with filters
    await new Promise((resolve) => setTimeout(resolve, 500))
  } finally {
    largeTransactionsLoading.value = false
  }
}

function handleRefresh() {
  message.loading({ content: 'Refreshing data...', key: 'refresh' })
  Promise.all([fetchOverviewData(), fetchLargeTransactions()]).then(() => {
    message.success({ content: 'Data refreshed', key: 'refresh' })
  })
}

function handleDateRangeChange() {
  fetchOverviewData()
}

function handleFilterChange() {
  fetchLargeTransactions()
}

function handleThresholdChange() {
  fetchLargeTransactions()
}

function handleExportBalances() {
  message.success('Exporting balance data...')
  // In production, trigger CSV/Excel export
}

// Lifecycle
onMounted(() => {
  fetchOverviewData()
  fetchLargeTransactions()
})
</script>

<style scoped>
.assets-overview-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}
</style>
