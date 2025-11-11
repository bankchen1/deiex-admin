import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTradingAnalyticsSummary,
  getVolumeByInstrument,
  getTradingPairPerformance,
  getUserTradingActivities,
  getTradingVolumeData,
  getUserAnalyticsSummary,
  getRegistrationTrends,
  getRetentionMetrics,
  getKycCompletionRates,
  getVipDistribution,
  getRevenueAnalyticsSummary,
  getFeeRevenueByType,
  getRevenueByInstrument,
  getRevenueTrend,
  exportTradingAnalytics,
  exportUserAnalytics,
  exportRevenueAnalytics,
  type AnalyticsQueryParams,
} from '@/services/api/facade'
import type {
  TradingVolumeSummary,
  VolumeByInstrument,
  TradingPairPerformance,
  UserTradingActivity,
  TradingVolumeData,
  UserAnalyticsSummary,
  RegistrationTrend,
  RetentionMetric,
  KycCompletionRate,
  VipDistribution,
  RevenueSummary,
  FeeRevenueByType,
  RevenueByInstrument,
  RevenueTrend,
} from '@/contracts/analytics'

/**
 * Trading Analytics Types
 */
export interface TradingVolumeSummary {
  totalVolume: number
  volumeChange: number
  totalTrades: number
  tradesChange: number
  activeUsers: number
  activeUsersChange: number
  avgTradeSize: number
  avgTradeSizeChange: number
}

export interface VolumeByInstrument {
  instrument: string
  symbol: string
  volume: number
  trades: number
  percentage: number
}

export interface TradingPairPerformance {
  pair: string
  volume24h: number
  trades24h: number
  priceChange: number
  high24h: number
  low24h: number
}

export interface UserTradingActivity {
  userId: string
  username: string
  totalVolume: number
  totalTrades: number
  avgTradeSize: number
  lastTradeTime: string
}

export interface TradingVolumeData {
  date: string
  volume: number
  trades: number
}

/**
 * User Analytics Types
 */
export interface UserAnalyticsSummary {
  totalUsers: number
  totalUsersChange: number
  newUsers: number
  newUsersChange: number
  activeUsers: number
  activeUsersChange: number
  retentionRate: number
  retentionChange: number
}

export interface RegistrationTrend {
  date: string
  count: number
  cumulative: number
}

export interface RetentionMetric {
  cohort: string
  day1: number
  day7: number
  day14: number
  day30: number
}

export interface KycCompletionRate {
  date: string
  submitted: number
  approved: number
  rejected: number
  pending: number
  completionRate: number
}

export interface VipDistribution {
  level: string
  count: number
  percentage: number
  avgRevenue: number
}

/**
 * Revenue Analytics Types
 */
export interface RevenueSummary {
  totalRevenue: number
  revenueChange: number
  tradingFees: number
  tradingFeesChange: number
  withdrawalFees: number
  withdrawalFeesChange: number
  otherFees: number
  otherFeesChange: number
}

export interface FeeRevenueByType {
  type: string
  amount: number
  count: number
  percentage: number
}

export interface RevenueByInstrument {
  instrument: string
  symbol: string
  revenue: number
  percentage: number
}

export interface RevenueTrend {
  date: string
  trading: number
  withdrawal: number
  other: number
  total: number
}

/**
 * Analytics Store
 */
export const useAnalyticsStore = defineStore('analytics', () => {
  // Loading States
  const tradingLoading = ref(false)
  const usersLoading = ref(false)
  const revenueLoading = ref(false)

  // Error State
  const error = ref<string | null>(null)

  // Trading Analytics State
  const tradingSummary = ref<TradingVolumeSummary>({
    totalVolume: 0,
    volumeChange: 0,
    totalTrades: 0,
    tradesChange: 0,
    activeUsers: 0,
    activeUsersChange: 0,
    avgTradeSize: 0,
    avgTradeSizeChange: 0,
  })
  const volumeByInstrument = ref<VolumeByInstrument[]>([])
  const tradingPairPerformance = ref<TradingPairPerformance[]>([])
  const userTradingActivity = ref<UserTradingActivity[]>([])
  const tradingVolumeData = ref<TradingVolumeData[]>([])

  // User Analytics State
  const usersSummary = ref<UserAnalyticsSummary>({
    totalUsers: 0,
    totalUsersChange: 0,
    newUsers: 0,
    newUsersChange: 0,
    activeUsers: 0,
    activeUsersChange: 0,
    retentionRate: 0,
    retentionChange: 0,
  })
  const registrationTrend = ref<RegistrationTrend[]>([])
  const retentionMetrics = ref<RetentionMetric[]>([])
  const kycCompletionRate = ref<KycCompletionRate[]>([])
  const vipDistribution = ref<VipDistribution[]>([])

  // Revenue Analytics State
  const revenueSummary = ref<RevenueSummary>({
    totalRevenue: 0,
    revenueChange: 0,
    tradingFees: 0,
    tradingFeesChange: 0,
    withdrawalFees: 0,
    withdrawalFeesChange: 0,
    otherFees: 0,
    otherFeesChange: 0,
  })
  const feeRevenueByType = ref<FeeRevenueByType[]>([])
  const revenueByInstrument = ref<RevenueByInstrument[]>([])
  const revenueTrend = ref<RevenueTrend[]>([])

  /**
   * Trading Analytics Actions
   */
  async function fetchTradingAnalytics(params?: {
    startDate?: string
    endDate?: string
    instrument?: string
  }) {
    tradingLoading.value = true
    error.value = null
    try {
      // Get trading reports data using the facade
      const { data: tradeReportData, error: tradeReportError } = await listTradeReports({
        page: 1,
        pageSize: 100,
        ...(params || {}),
      })

      if (tradeReportError) {
        error.value = tradeReportError.message
        throw new Error(tradeReportError.message)
      }

      if (!tradeReportData) {
        throw new Error('No trade report data received')
      }

      // Get daily data
      const { data: dailyData, error: dailyError } = await getTradeDailyData({
        startDate: params?.startDate,
        endDate: params?.endDate,
        instrument: params?.instrument,
      })

      if (dailyError) {
        error.value = dailyError.message
        throw new Error(dailyError.message)
      }

      // Get symbol volume data
      const { data: volumeData, error: volumeError } = await getSymbolVolumeData({
        startDate: params?.startDate,
        endDate: params?.endDate,
        instrument: params?.instrument,
      })

      if (volumeError) {
        error.value = volumeError.message
        throw new Error(volumeError.message)
      }

      // Update trading summary
      // For demo purposes, computing from the data
      if (tradeReportData.data.length > 0) {
        const totalVolume = tradeReportData.data.reduce(
          (sum, report) => sum + parseFloat(report.volume || '0'),
          0
        )
        const totalTrades = tradeReportData.data.length

        tradingSummary.value = {
          totalVolume,
          volumeChange: 12.5, // This would come from comparing periods
          totalTrades,
          tradesChange: 8.3,
          activeUsers: 3245,
          activeUsersChange: 5.7,
          avgTradeSize: totalVolume / totalTrades,
          avgTradeSizeChange: 3.2,
        }
      }

      // Update volume by instrument
      volumeByInstrument.value = volumeData.map((item) => ({
        instrument: item.symbol || 'Unknown',
        symbol: item.symbol || 'UNKNOWN',
        volume: parseFloat(item.volume || '0'),
        trades: item.count || 0,
        percentage: (parseFloat(item.volume || '0') / 1000000) * 100, // Simplified
      }))

      // This would need actual trading pair performance data from the API
      tradingPairPerformance.value = [
        {
          pair: 'BTC/USDT',
          volume24h: 45678900,
          trades24h: 15678,
          priceChange: 2.5,
          high24h: 67890,
          low24h: 65432,
        },
        {
          pair: 'ETH/USDT',
          volume24h: 32456700,
          trades24h: 12456,
          priceChange: 3.2,
          high24h: 3456,
          low24h: 3234,
        },
        {
          pair: 'BNB/USDT',
          volume24h: 18234500,
          trades24h: 8234,
          priceChange: -1.5,
          high24h: 345,
          low24h: 332,
        },
        {
          pair: 'SOL/USDT',
          volume24h: 12345600,
          trades24h: 5345,
          priceChange: 5.8,
          high24h: 156,
          low24h: 145,
        },
        {
          pair: 'ADA/USDT',
          volume24h: 8765400,
          trades24h: 3765,
          priceChange: 1.2,
          high24h: 0.78,
          low24h: 0.72,
        },
      ]

      // Update user trading activity
      userTradingActivity.value = [
        {
          userId: 'U001',
          nickname: 'trader_001',
          totalVolume: 1234567,
          totalTrades: 456,
          avgTradeSize: 2704.32,
          lastTradeTime: '2025-10-31T12:34:56Z',
        },
        {
          userId: 'U002',
          nickname: 'trader_002',
          totalVolume: 987654,
          totalTrades: 321,
          avgTradeSize: 3076.8,
          lastTradeTime: '2025-10-31T11:23:45Z',
        },
        {
          userId: 'U003',
          nickname: 'trader_003',
          totalVolume: 876543,
          totalTrades: 298,
          avgTradeSize: 2941.42,
          lastTradeTime: '2025-10-31T10:12:34Z',
        },
        {
          userId: 'U004',
          nickname: 'trader_004',
          totalVolume: 765432,
          totalTrades: 267,
          avgTradeSize: 2867.29,
          lastTradeTime: '2025-10-31T09:01:23Z',
        },
        {
          userId: 'U005',
          nickname: 'trader_005',
          totalVolume: 654321,
          totalTrades: 234,
          avgTradeSize: 2795.82,
          lastTradeTime: '2025-10-31T08:45:12Z',
        },
      ]

      // Update trading volume data
      tradingVolumeData.value = dailyData.data.map((item) => ({
        date: item.date,
        volume: parseFloat(item.volume || '0'),
        trades: parseInt(item.count || '0'),
      }))
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trading analytics'
      throw e
    } finally {
      tradingLoading.value = false
    }
  }

  /**
   * User Analytics Actions
   */
  async function fetchUserAnalytics(params?: {
    startDate?: string
    endDate?: string
    userType?: string
  }) {
    usersLoading.value = true
    error.value = null
    try {
      // Mock data - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update user summary
      usersSummary.value = {
        totalUsers: 125678,
        totalUsersChange: 5.2,
        newUsers: 1234,
        newUsersChange: 8.7,
        activeUsers: 23456,
        activeUsersChange: 3.5,
        retentionRate: 68.5,
        retentionChange: 2.1,
      }

      // Update registration trend
      const dates = generateDateRange(params?.startDate, params?.endDate)
      let cumulative = 120000
      registrationTrend.value = dates.map((date) => {
        const count = Math.floor(Math.random() * 100) + 50
        cumulative += count
        return { date, count, cumulative }
      })

      // Update retention metrics
      retentionMetrics.value = [
        { cohort: '2025-10-01', day1: 85, day7: 65, day14: 52, day30: 38 },
        { cohort: '2025-10-08', day1: 87, day7: 67, day14: 54, day30: 40 },
        { cohort: '2025-10-15', day1: 83, day7: 63, day14: 50, day30: 35 },
        { cohort: '2025-10-22', day1: 89, day7: 70, day14: 56, day30: 42 },
        { cohort: '2025-10-29', day1: 86, day7: 68, day14: 0, day30: 0 },
      ]

      // Update KYC completion rate
      kycCompletionRate.value = dates.map((date) => ({
        date,
        submitted: Math.floor(Math.random() * 100) + 50,
        approved: Math.floor(Math.random() * 80) + 40,
        rejected: Math.floor(Math.random() * 10) + 2,
        pending: Math.floor(Math.random() * 20) + 5,
        completionRate: 75 + Math.random() * 15,
      }))

      // Update VIP distribution
      vipDistribution.value = [
        { level: 'VIP 0', count: 98765, percentage: 78.6, avgRevenue: 125.5 },
        { level: 'VIP 1', count: 15432, percentage: 12.3, avgRevenue: 560.25 },
        { level: 'VIP 2', count: 6543, percentage: 5.2, avgRevenue: 1250.75 },
        { level: 'VIP 3', count: 3210, percentage: 2.6, avgRevenue: 3450.8 },
        { level: 'VIP 4', count: 987, percentage: 0.8, avgRevenue: 8760.4 },
        { level: 'VIP 5', count: 321, percentage: 0.3, avgRevenue: 25890.6 },
        { level: 'VIP 6+', count: 176, percentage: 0.2, avgRevenue: 67540.3 },
      ]
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch user analytics'
      throw e
    } finally {
      usersLoading.value = false
    }
  }

  /**
   * Revenue Analytics Actions
   */
  async function fetchRevenueAnalytics(params?: {
    startDate?: string
    endDate?: string
    revenueType?: string
  }) {
    revenueLoading.value = true
    error.value = null
    try {
      // Mock data - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update revenue summary
      revenueSummary.value = {
        totalRevenue: 456789.5,
        revenueChange: 15.3,
        tradingFees: 345678.25,
        tradingFeesChange: 18.2,
        withdrawalFees: 87654.75,
        withdrawalFeesChange: 6.5,
        otherFees: 23456.5,
        otherFeesChange: 8.9,
      }

      // Update fee revenue by type
      feeRevenueByType.value = [
        { type: 'Trading Fees (Maker)', amount: 198765.5, count: 25678, percentage: 43.5 },
        { type: 'Trading Fees (Taker)', amount: 146912.75, count: 19876, percentage: 32.2 },
        { type: 'Withdrawal Fees', amount: 87654.75, count: 5432, percentage: 19.2 },
        { type: 'Deposit Fees', amount: 12345.6, count: 1234, percentage: 2.7 },
        { type: 'Other Fees', amount: 11110.9, count: 876, percentage: 2.4 },
      ]

      // Update revenue by instrument
      revenueByInstrument.value = [
        { instrument: 'BTC/USDT', symbol: 'BTCUSDT', revenue: 156789.5, percentage: 34.3 },
        { instrument: 'ETH/USDT', symbol: 'ETHUSDT', revenue: 123456.75, percentage: 27.0 },
        { instrument: 'BNB/USDT', symbol: 'BNBUSDT', revenue: 78901.25, percentage: 17.3 },
        { instrument: 'SOL/USDT', symbol: 'SOLUSDT', revenue: 54321.8, percentage: 11.9 },
        { instrument: 'Others', symbol: 'OTHERS', revenue: 43320.2, percentage: 9.5 },
      ]

      // Update revenue trend
      const dates = generateDateRange(params?.startDate, params?.endDate)
      revenueTrend.value = dates.map((date) => {
        const trading = 10000 + Math.random() * 5000
        const withdrawal = 2000 + Math.random() * 1000
        const other = 500 + Math.random() * 500
        return {
          date,
          trading,
          withdrawal,
          other,
          total: trading + withdrawal + other,
        }
      })
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch revenue analytics'
      throw e
    } finally {
      revenueLoading.value = false
    }
  }

  /**
   * Helper function to generate date range
   */
  function generateDateRange(startDate?: string, endDate?: string): string[] {
    const dates: string[] = []
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const current = new Date(start)
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]
      if (dateStr) {
        dates.push(dateStr)
      }
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  /**
   * Reset store
   */
  function reset() {
    tradingLoading.value = false
    usersLoading.value = false
    revenueLoading.value = false
    error.value = null

    tradingSummary.value = {
      totalVolume: 0,
      volumeChange: 0,
      totalTrades: 0,
      tradesChange: 0,
      activeUsers: 0,
      activeUsersChange: 0,
      avgTradeSize: 0,
      avgTradeSizeChange: 0,
    }
    volumeByInstrument.value = []
    tradingPairPerformance.value = []
    userTradingActivity.value = []
    tradingVolumeData.value = []

    usersSummary.value = {
      totalUsers: 0,
      totalUsersChange: 0,
      newUsers: 0,
      newUsersChange: 0,
      activeUsers: 0,
      activeUsersChange: 0,
      retentionRate: 0,
      retentionChange: 0,
    }
    registrationTrend.value = []
    retentionMetrics.value = []
    kycCompletionRate.value = []
    vipDistribution.value = []

    revenueSummary.value = {
      totalRevenue: 0,
      revenueChange: 0,
      tradingFees: 0,
      tradingFeesChange: 0,
      withdrawalFees: 0,
      withdrawalFeesChange: 0,
      otherFees: 0,
      otherFeesChange: 0,
    }
    feeRevenueByType.value = []
    revenueByInstrument.value = []
    revenueTrend.value = []
  }

  return {
    // Loading States
    tradingLoading,
    usersLoading,
    revenueLoading,
    error,

    // Trading Analytics
    tradingSummary,
    volumeByInstrument,
    tradingPairPerformance,
    userTradingActivity,
    tradingVolumeData,
    fetchTradingAnalytics,

    // User Analytics
    usersSummary,
    registrationTrend,
    retentionMetrics,
    kycCompletionRate,
    vipDistribution,
    fetchUserAnalytics,

    // Revenue Analytics
    revenueSummary,
    feeRevenueByType,
    revenueByInstrument,
    revenueTrend,
    fetchRevenueAnalytics,

    // Common
    reset,
  }
})
