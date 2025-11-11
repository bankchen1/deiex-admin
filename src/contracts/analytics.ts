/**
 * Analytics Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Base Query Contracts
export interface AnalyticsQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
  instrument?: string
  status?: string
  search?: string
}

// Trading Analytics Contracts
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
  nickname: string
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

// User Analytics Contracts
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

// Revenue Analytics Contracts
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

// Analytics Export Payloads
export interface AnalyticsExportPayload {
  startDate?: string
  endDate?: string
  format: 'csv' | 'excel' | 'json'
  includeCharts: boolean
  includeAnnotations: boolean
}

// Analytics Response Wrappers
export interface AnalyticsListResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface AnalyticsDetailResponse<T> {
  data: T
  metadata: {
    lastUpdated: string
    generatedAt: string
    source: string
  }
}

// Analytics Aggregation Contracts
export interface TimeSeriesData {
  timestamp: string
  value: number
}

export interface DistributionData {
  label: string
  value: number
  percentage: number
}

export interface ComparisonData {
  currentPeriod: number
  previousPeriod: number
  change: number
  changePercentage: number
}
