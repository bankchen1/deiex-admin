import { defineStore } from 'pinia'
import { ref } from 'vue'
import { message } from 'ant-design-vue'

export interface AssetsSummary {
  totalBalance: number
  balanceChange: number
  hotWalletBalance: number
  hotWalletRatio: number
  coldWalletBalance: number
  coldWalletRatio: number
  totalUsers: number
  deposits24h: {
    volume: number
    count: number
  }
  withdrawals24h: {
    volume: number
    count: number
  }
  netFlow24h: number
}

export interface CurrencyBalance {
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

export interface LargeTransaction {
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

export const useAssetsOverviewStore = defineStore('assetsOverview', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const summary = ref<AssetsSummary>({
    totalBalance: 0,
    balanceChange: 0,
    hotWalletBalance: 0,
    hotWalletRatio: 0,
    coldWalletBalance: 0,
    coldWalletRatio: 0,
    totalUsers: 0,
    deposits24h: {
      volume: 0,
      count: 0,
    },
    withdrawals24h: {
      volume: 0,
      count: 0,
    },
    netFlow24h: 0,
  })
  const currencyBalances = ref<CurrencyBalance[]>([])
  const largeTransactions = ref<LargeTransaction[]>([])

  // Actions
  async function fetchOverview() {
    loading.value = true
    error.value = null
    try {
      // Mock API call - in production, call actual API
      // const response = await assetsApi.getOverview()
      // summary.value = response.data

      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 500))
      summary.value = {
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
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch overview'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrencyBalances() {
    loading.value = true
    error.value = null
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      currencyBalances.value = [
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
      ]
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch currency balances'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchLargeTransactions() {
    loading.value = true
    error.value = null
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      largeTransactions.value = [
        {
          id: 'TX001',
          type: 'deposit',
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
          type: 'withdrawal',
          userId: 'U67890',
          userNickname: 'whale_investor',
          currency: 'ETH',
          amount: '120',
          amountUsd: 220000,
          status: 'approved',
          timestamp: '2025-10-31 11:15:22',
          riskScore: 45,
        },
      ]
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch large transactions'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    summary.value = {
      totalBalance: 0,
      balanceChange: 0,
      hotWalletBalance: 0,
      hotWalletRatio: 0,
      coldWalletBalance: 0,
      coldWalletRatio: 0,
      totalUsers: 0,
      deposits24h: {
        volume: 0,
        count: 0,
      },
      withdrawals24h: {
        volume: 0,
        count: 0,
      },
      netFlow24h: 0,
    }
    currencyBalances.value = []
    largeTransactions.value = []
  }

  return {
    // State
    loading,
    error,
    summary,
    currencyBalances,
    largeTransactions,
    // Actions
    fetchOverview,
    fetchCurrencyBalances,
    fetchLargeTransactions,
    reset,
  }
})
