<template>
  <div class="wallets-page">
    <div class="page-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Wallets</h1>
          <p class="text-gray-500 mt-1">Manage wallet addresses and monitor blockchain health</p>
        </div>
        <a-space>
          <a-button type="primary" @click="handleRefreshAll">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh All
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- Balance Summary Cards -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Total Balance"
            :value="balanceSummary.total"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <WalletOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Hot Wallets"
            :value="balanceSummary.hot"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <FireOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Cold Wallets"
            :value="balanceSummary.cold"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <SafetyOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Active Chains"
            :value="balanceSummary.activeChains"
            :value-style="{ color: '#13c2c2' }"
          >
            <template #prefix>
              <LinkOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Chain Health Status -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="24">
        <ChainHealth :chain-health="chainHealthData" />
      </a-col>
    </a-row>

    <!-- Balance Monitoring -->
    <a-card title="Balance Monitoring" :bordered="false" class="mb-6">
      <template #extra>
        <a-space>
          <a-button size="small" @click="handleRefreshBalances">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
      <BalanceTable :balances="chainBalances" :loading="balancesLoading" />
    </a-card>

    <!-- Wallet Addresses -->
    <a-card :bordered="false" class="mb-6">
      <template #title>
        <a-space>
          <span>Wallet Addresses</span>
          <a-tag v-if="addresses.length > 0" color="blue"> {{ addresses.length }} addresses </a-tag>
        </a-space>
      </template>
      <template #extra>
        <a-space>
          <a-select
            v-model:value="addressFilter.chain"
            placeholder="All Chains"
            style="width: 150px"
            size="small"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="">All Chains</a-select-option>
            <a-select-option v-for="chain in availableChains" :key="chain" :value="chain">
              {{ chain }}
            </a-select-option>
          </a-select>
          <a-select
            v-model:value="addressFilter.type"
            placeholder="All Types"
            style="width: 120px"
            size="small"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="">All Types</a-select-option>
            <a-select-option value="hot">Hot</a-select-option>
            <a-select-option value="cold">Cold</a-select-option>
          </a-select>
          <a-button size="small" @click="handleRefreshAddresses">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
      <AddressTable
        :addresses="filteredAddresses"
        :loading="addressesLoading"
        @sync="handleSyncBalance"
      />
    </a-card>

    <!-- Failed Retry Queue -->
    <a-card :bordered="false">
      <template #title>
        <a-space>
          <span>Failed Transaction Retry Queue</span>
          <a-tag v-if="retryQueue.length > 0" color="red"> {{ retryQueue.length }} pending </a-tag>
        </a-space>
      </template>
      <template #extra>
        <a-button size="small" @click="handleRefreshRetryQueue">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </template>
      <RetryQueueTable
        :retry-queue="retryQueue"
        :loading="retryQueueLoading"
        @retry="handleRetryTask"
        @cancel="handleCancelTask"
        @view-transaction="handleViewTransaction"
      />
    </a-card>

    <!-- Transaction Detail Drawer -->
    <TxDetailDrawer
      v-model:visible="txDetailVisible"
      :transaction-id="selectedTransactionId"
      :transaction-type="selectedTransactionType"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  WalletOutlined,
  FireOutlined,
  SafetyOutlined,
  LinkOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useWalletsStore } from '@/stores/wallets'
import AddressTable from '@/tables/assets/AddressTable.vue'
import BalanceTable from '@/tables/assets/BalanceTable.vue'
import RetryQueueTable from '@/tables/assets/RetryQueueTable.vue'
import ChainHealth from '@/widgets/status/ChainHealth.vue'
import TxDetailDrawer from '@/modals/assets/TxDetailDrawer.vue'
import type { WalletAddress, RetryTask } from '@/types/models'

const walletsStore = useWalletsStore()

// State
const addressesLoading = ref(false)
const balancesLoading = ref(false)
const retryQueueLoading = ref(false)
const txDetailVisible = ref(false)
const selectedTransactionId = ref<string>('')
const selectedTransactionType = ref<'deposit' | 'withdrawal'>('deposit')

const addressFilter = ref({
  chain: '',
  type: '',
})

// Computed
const addresses = computed(() => walletsStore.addresses)
const chainHealthData = computed(() => walletsStore.chainHealth)
const retryQueue = computed(() => walletsStore.retryQueue)

const availableChains = computed(() => {
  const chains = new Set(addresses.value.map((addr) => addr.chain))
  return Array.from(chains).sort()
})

const filteredAddresses = computed(() => {
  let filtered = addresses.value

  if (addressFilter.value.chain) {
    filtered = filtered.filter((addr) => addr.chain === addressFilter.value.chain)
  }

  if (addressFilter.value.type) {
    filtered = filtered.filter((addr) => addr.type === addressFilter.value.type)
  }

  return filtered
})

// Calculate chain balances from addresses
const chainBalances = computed(() => {
  const balanceMap = new Map<
    string,
    {
      chain: string
      hotBalance: number
      hotBalanceUsd: number
      coldBalance: number
      coldBalanceUsd: number
      lastSyncAt: string
      status: 'healthy' | 'degraded' | 'down'
    }
  >()

  addresses.value.forEach((addr) => {
    if (!balanceMap.has(addr.chain)) {
      const chainHealth = chainHealthData.value.find((ch) => ch.chain === addr.chain)
      balanceMap.set(addr.chain, {
        chain: addr.chain,
        hotBalance: 0,
        hotBalanceUsd: 0,
        coldBalance: 0,
        coldBalanceUsd: 0,
        lastSyncAt: addr.lastSyncAt,
        status: chainHealth?.status || 'healthy',
      })
    }

    const balance = balanceMap.get(addr.chain)!
    if (addr.type === 'hot') {
      balance.hotBalance += parseFloat(addr.balance) || 0
      balance.hotBalanceUsd += addr.balanceUsd
    } else {
      balance.coldBalance += parseFloat(addr.balance) || 0
      balance.coldBalanceUsd += addr.balanceUsd
    }

    // Update lastSyncAt to the most recent
    if (addr.lastSyncAt > balance.lastSyncAt) {
      balance.lastSyncAt = addr.lastSyncAt
    }
  })

  return Array.from(balanceMap.values()).map((balance) => {
    const totalBalanceUsd = balance.hotBalanceUsd + balance.coldBalanceUsd
    const hotRatio = totalBalanceUsd > 0 ? (balance.hotBalanceUsd / totalBalanceUsd) * 100 : 0

    return {
      chain: balance.chain,
      hotBalance: balance.hotBalance.toFixed(8),
      hotBalanceUsd: balance.hotBalanceUsd,
      coldBalance: balance.coldBalance.toFixed(8),
      coldBalanceUsd: balance.coldBalanceUsd,
      totalBalance: (balance.hotBalance + balance.coldBalance).toFixed(8),
      totalBalanceUsd,
      hotRatio: Math.round(hotRatio),
      status: balance.status,
      lastSyncAt: balance.lastSyncAt,
    }
  })
})

const balanceSummary = computed(() => {
  const total = chainBalances.value.reduce((sum, b) => sum + b.totalBalanceUsd, 0)
  const hot = chainBalances.value.reduce((sum, b) => sum + b.hotBalanceUsd, 0)
  const cold = chainBalances.value.reduce((sum, b) => sum + b.coldBalanceUsd, 0)
  const activeChains = chainHealthData.value.filter((ch) => ch.status === 'healthy').length

  return {
    total,
    hot,
    cold,
    activeChains,
  }
})

// Methods
async function fetchAllData() {
  await Promise.all([fetchAddresses(), fetchChainHealth(), fetchRetryQueue()])
}

async function fetchAddresses() {
  addressesLoading.value = true
  try {
    await walletsStore.fetchAddresses()
  } finally {
    addressesLoading.value = false
  }
}

async function fetchChainHealth() {
  try {
    await walletsStore.fetchChainHealth()
  } catch {
    // Error handled by store
  }
}

async function fetchRetryQueue() {
  retryQueueLoading.value = true
  try {
    await walletsStore.fetchRetryQueue()
  } finally {
    retryQueueLoading.value = false
  }
}

function handleFilterChange() {
  // Filters are reactive, no need to do anything
}

async function handleRefreshAll() {
  message.loading({ content: 'Refreshing all data...', key: 'refresh' })
  await fetchAllData()
  message.success({ content: 'All data refreshed', key: 'refresh' })
}

async function handleRefreshAddresses() {
  await fetchAddresses()
  message.success('Addresses refreshed')
}

async function handleRefreshBalances() {
  balancesLoading.value = true
  await fetchAddresses()
  balancesLoading.value = false
  message.success('Balances refreshed')
}

async function handleRefreshRetryQueue() {
  await fetchRetryQueue()
  message.success('Retry queue refreshed')
}

async function handleSyncBalance(address: WalletAddress) {
  try {
    await walletsStore.syncBalance(address.id)
    await fetchAddresses()
  } catch {
    // Error handled by store
  }
}

async function handleRetryTask(task: RetryTask) {
  Modal.confirm({
    title: 'Retry Task',
    content: `Are you sure you want to retry this ${task.type} transaction?`,
    okText: 'Retry',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await walletsStore.retryTask(task.id)
        await fetchRetryQueue()
      } catch {
        // Error handled by store
      }
    },
  })
}

async function handleCancelTask(task: RetryTask) {
  Modal.confirm({
    title: 'Cancel Task',
    content: `Are you sure you want to cancel this ${task.type} transaction retry?`,
    okText: 'Cancel Task',
    okType: 'danger',
    cancelText: 'Close',
    onOk: async () => {
      try {
        await walletsStore.cancelTask(task.id)
      } catch {
        // Error handled by store
      }
    },
  })
}

function handleViewTransaction(task: RetryTask) {
  selectedTransactionId.value = task.transactionId
  selectedTransactionType.value = task.type
  txDetailVisible.value = true
}

// Lifecycle
onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
.wallets-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}
</style>
