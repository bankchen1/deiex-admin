// API Response Types

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiError {
  code: string
  message: string

  details?: any
}

export interface BatchResult {
  success: number
  failed: number
  errors?: Array<{ id: string; error: string }>
}

// Query Parameters
export interface InstrumentQueryParams {
  page?: number
  pageSize?: number
  type?: 'spot' | 'futures' | 'all'
  visible?: boolean
  status?: 'draft' | 'published'
  search?: string
  region?: string
  tags?: string[]
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

// Payload Types
export interface InstrumentCreatePayload {
  symbol: string
  displayName: Record<string, string>
  base: string
  quote: string
  type: 'spot' | 'futures'
  pricePrecision: number
  qtyStep: string
  minOrder: string
  visible?: boolean
  rank?: number
  region?: string[]
  tags?: string[]
  feeTemplateId?: string
  marginTemplateId?: string
  iconId?: string
  maxOrder?: string
  maxPosition?: string
  priceTickSize?: string
  oracleSource?: string
  indexSymbol?: string
  maxLeverage?: number
  maintenanceMarginRate?: number
}

export interface InstrumentUpdatePayload extends Partial<InstrumentCreatePayload> {}

export interface PublishPayload {
  notes: string
  tags?: string[]
}

export interface ImportPayload {
  format: 'csv' | 'json'
  data: string | object[]
  fieldMapping?: Record<string, string>
  overwrite?: boolean
}

export interface ExportParams {
  format?: 'csv' | 'json'
  type?: 'spot' | 'futures' | 'all'
  visible?: boolean
  status?: 'draft' | 'published'
}

// Margin API Types
export interface MarginQueryParams {
  page?: number
  pageSize?: number
  status?: 'draft' | 'published'
  search?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface MarginTemplateCreatePayload {
  name: string
  description?: string
  tiers: Array<{
    notionalFrom: string
    notionalTo: string
    initialMarginRate: number
    maintenanceMarginRate: number
    maxLeverage: number
  }>
}

export interface MarginTemplateUpdatePayload extends Partial<MarginTemplateCreatePayload> {}

export interface MarginBindingPayload {
  symbol: string
  templateId: string
}

// Reports API Types
export interface TradeReportParams {
  startDate: string
  endDate: string
  market?: 'spot' | 'futures' | 'all'
  region?: string
  symbol?: string
}

export interface TradeReportResponse {
  summary: {
    totalVolume: string
    totalTrades: number
    makerVolume: string
    takerVolume: string
    makerTrades: number
    takerTrades: number
    avgTradeSize: string
    topSymbol: string
    topSymbolVolume: string
  }
  charts: {
    volumeTrend: Array<{ date: string; volume: string; trades: number }>
    makerTakerComposition: Array<{ date: string; maker: string; taker: string }>
  }
}

export interface TradeDailyData {
  date: string
  volume: string
  trades: number
  makerVolume: string
  takerVolume: string
  makerTrades: number
  takerTrades: number
  avgTradeSize: string
  uniqueUsers: number
}

export interface SymbolVolumeData {
  symbol: string
  volume: string
  trades: number
  percentage: number
  change24h: number
}

export interface FinanceReportParams {
  startDate: string
  endDate: string
  currency?: string
  type?: 'deposit' | 'withdrawal' | 'fee' | 'funding' | 'all'
}

export interface FinanceReportResponse {
  summary: {
    totalDeposits: string
    totalWithdrawals: string
    netInflow: string
    totalFeeIncome: string
    tradingFees: string
    withdrawalFees: string
    fundingSettlements: string
    depositCount: number
    withdrawalCount: number
  }
  charts: {
    inflowTrend: Array<{ date: string; deposits: string; withdrawals: string; net: string }>
    feeIncomeTrend: Array<{ date: string; trading: string; withdrawal: string; total: string }>
  }
}

export interface FinanceDailyData {
  date: string
  deposits: string
  withdrawals: string
  netInflow: string
  tradingFees: string
  withdrawalFees: string
  fundingSettlements: string
  totalFees: string
  depositCount: number
  withdrawalCount: number
}

export interface FeeIncomeData {
  currency: string
  tradingFees: string
  withdrawalFees: string
  totalFees: string
  percentage: number
}

export interface RetentionReportParams {
  startDate: string
  endDate: string
  cohortType?: 'daily' | 'weekly' | 'monthly'
  region?: string
}

export interface RetentionReportResponse {
  summary: {
    dau: number
    wau: number
    mau: number
    newUsers: number
    activeUsers: number
    retentionRate: number
    conversionRate: number
  }
  charts: {
    dauTrend: Array<{ date: string; dau: number; wau: number; mau: number }>
    retentionFunnel: Array<{ stage: string; users: number; percentage: number }>
  }
}

export interface RetentionData {
  cohortDate: string
  cohortSize: number
  day0: number
  day1: number
  day3: number
  day7: number
  day14: number
  day30: number
  day60: number
  day90: number
}

export interface FunnelData {
  stage: string
  users: number
  percentage: number
  dropoffRate: number
  avgTimeToNext?: number
}
