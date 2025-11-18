<template>
  <div class="wallets-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Wallets</h1>
          <p class="text-gray-500 mt-1">Manage wallet addresses and monitor blockchain health</p>
        </div>
      </div>
    </div>

    <!-- Balance Summary Cards -->
    <BalanceSummaryCards :summary="balanceSummary" :loading="summaryLoading" />

    <!-- Chain Health Status -->
    <ChainHealthSection :chain-health="chainHealthData" :loading="chainHealthLoading" />

    <!-- Balance Monitoring -->
    <BalanceMonitoringSection
      :balances="chainBalances"
      :loading="balancesLoading"
      @refresh="handleRefreshBalances"
    />

    <!-- Wallet Addresses -->
    <WalletAddressesSection
      :addresses="filteredAddresses"
      :available-chains="availableChains"
      :address-filter="addressFilter"
      :loading="addressesLoading"
      @filter-change="handleFilterChange"
      @refresh="handleRefreshAddresses"
      @sync="handleSyncBalance"
    />

    <!-- Failed Retry Queue -->
    <RetryQueueSection
      :retry-queue="retryQueue"
      :loading="retryQueueLoading"
      @refresh="handleRefreshRetryQueue"
      @retry="handleRetryTask"
      @cancel="handleCancelTask"
      @view-transaction="handleViewTransaction"
    />

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
import { message, Modal } from 'ant-design-vue'
import {
  useWalletsQuery,
  useChainHealthQuery,
  useRetryQueueQuery,
  useSyncBalanceMutation,
  useRetryTaskMutation,
  useCancelTaskMutation,
} from '@/composables/useWallets'
import type { WalletAddress, RetryTask } from '@/contracts/assets'
import BalanceSummaryCards from '@/ui/sections/assets/BalanceSummaryCards.vue'
import ChainHealthSection from '@/ui/sections/assets/ChainHealthSection.vue'
import BalanceMonitoringSection from '@/ui/sections/assets/BalanceMonitoringSection.vue'
import WalletAddressesSection from '@/ui/sections/assets/WalletAddressesSection.vue'
import RetryQueueSection from '@/ui/sections/assets/RetryQueueSection.vue'
import TxDetailDrawer from '@/ui/modals/assets/TxDetailDrawer.vue'

// State
const txDetailVisible = ref(false)
const selectedTransactionId = ref<string>('')
const selectedTransactionType = ref<'deposit' | 'withdrawal'>('deposit')

const addressFilter = ref({
  chain: '',
  type: '',
})

// Composables
const {
  data: addresses,
  isLoading: addressesLoading,
  refetch: refetchAddresses,
} = useWalletsQuery()

const {
  data: chainHealthData,
  isLoading: chainHealthLoading,
  refetch: refetchChainHealth,
} = useChainHealthQuery()

const {
  data: retryQueue,
  isLoading: retryQueueLoading,
  refetch: refetchRetryQueue,
} = useRetryQueueQuery()

const { mutate: syncBalanceMutate } = useSyncBalanceMutation()
const { mutate: retryTaskMutate } = useRetryTaskMutation()
const { mutate: cancelTaskMutate } = useCancelTaskMutation()

// Computed
const availableChains = computed(() => {
  const chains = new Set(addresses.value?.map((addr) => addr.chain) || [])
  return Array.from(chains).sort()
})

const filteredAddresses = computed(() => {
  if (!addresses.value) return []

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
  if (!addresses.value) return []

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
      const chainHealth = chainHealthData.value?.find((ch) => ch.chain === addr.chain)
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
  const activeChains = chainHealthData.value?.filter((ch) => ch.status === 'healthy').length || 0

  return {
    total,
    hot,
    cold,
    activeChains,
  }
})

const summaryLoading = computed(() => {
  return addressesLoading.value || chainHealthLoading.value
})

const balancesLoading = ref(false)

// Methods
async function fetchAllData() {
  await Promise.all([refetchAddresses(), refetchChainHealth(), refetchRetryQueue()])
}

async function handleRefreshBalances() {
  balancesLoading.value = true
  await refetchAddresses()
  balancesLoading.value = false
  message.success('Balances refreshed')
}

async function handleRefreshAddresses() {
  await refetchAddresses()
  message.success('Addresses refreshed')
}

async function handleRefreshRetryQueue() {
  await refetchRetryQueue()
  message.success('Retry queue refreshed')
}

function handleFilterChange(filter: { chain: string; type: string }) {
  addressFilter.value = filter
}

async function handleSyncBalance(address: WalletAddress) {
  syncBalanceMutate(address.id, {
    onSuccess: () => {
      message.success('Balance synced successfully')
      refetchAddresses()
    },
    onError: (error) => {
      message.error(error.message || 'Failed to sync balance')
    },
  })
}

async function handleRetryTask(task: RetryTask) {
  Modal.confirm({
    title: 'Retry Task',
    content: `Are you sure you want to retry this ${task.type} transaction?`,
    okText: 'Retry',
    cancelText: 'Cancel',
    onOk: () => {
      retryTaskMutate(task.id, {
        onSuccess: () => {
          message.success('Task retry initiated successfully')
          refetchRetryQueue()
        },
        onError: (error) => {
          message.error(error.message || 'Failed to retry task')
        },
      })
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
    onOk: () => {
      cancelTaskMutate(task.id, {
        onSuccess: () => {
          message.success('Task cancelled successfully')
        },
        onError: (error) => {
          message.error(error.message || 'Failed to cancel task')
        },
      })
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
