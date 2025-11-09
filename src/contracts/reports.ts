/**
 * Reports Module Contracts
 * 
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Trade Report Entity
export interface TradeReport {
  id: string
  symbol: string
  date: string
  volume: string
  turnover: string
  trades: number
  takerBuyVolume: string
  takerBuyTurnover: string
}

// Finance Report Entity
export interface FinanceReport {
  id: string
  date: string
  depositAmount: string
  depositCount: number
  withdrawalAmount: string
  withdrawalCount: number
  feeIncome: string
  userCount: number
  activeUserCount: number
}

// Retention Report Entity
export interface RetentionReport {
  id: string
  date: string
  newUserCount: number
  day1: number
  day7: number
  day30: number
  day90: number
  mtd: number
  qtd: number
  ytd: number
}

// Trade Daily Data Entity
export interface TradeDailyData {
  date: string
  volume: string
  turnover: string
  trades: number
}

// Symbol Volume Data Entity
export interface SymbolVolumeData {
  symbol: string
  volume: string
  turnover: string
  percentage: number
}

// Finance Daily Data Entity
export interface FinanceDailyData {
  date: string
  depositAmount: string
  withdrawalAmount: string
  feeIncome: string
  netFlow: string
}

// Fee Income Data Entity
export interface FeeIncomeData {
  date: string
  feeType: string
  income: string
  currency: string
}

// Retention Data Entity
export interface RetentionData {
  date: string
  day1: number
  day7: number
  day30: number
  day90: number
}

// Funnel Data Entity
export interface FunnelData {
  stage: string
  count: number
  conversion: number
}

// Query Parameter Contracts
export interface TradeReportQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  symbol?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface FinanceReportQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  currency?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface RetentionReportQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  startDate?: string
  endDate?: string
  period?: 'daily' | 'weekly' | 'monthly'
  search?: string
}

// List Response Contracts
export interface TradeReportListResponse {
  data: TradeReport[]
  total: number
  page: number
  pageSize: number
}

export interface FinanceReportListResponse {
  data: FinanceReport[]
  total: number
  page: number
  pageSize: number
}

export interface RetentionReportListResponse {
  data: RetentionReport[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface TradeReportDetailResponse {
  report: TradeReport
  chartData: TradeDailyData[]
}

export interface FinanceReportDetailResponse {
  report: FinanceReport
  chartData: FinanceDailyData[]
}

export interface RetentionReportDetailResponse {
  report: RetentionReport
  chartData: RetentionData[]
}

// Payload Contracts
export interface GenerateReportPayload {
  type: 'trade' | 'finance' | 'retention'
  startDate: string
  endDate: string
  filters?: Record<string, any>
}

export interface ExportReportParams {
  type: 'trade' | 'finance' | 'retention'
  format: 'csv' | 'excel' | 'pdf'
  params?: any
}

// Response Wrapper Contract
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      total: number
    }
  }
}

// Export Response Contract
export type ReportExportResponse = Blob

// Constants for validation
export const REPORT_TYPE_OPTIONS = [
  { label: 'Trade', value: 'trade' },
  { label: 'Finance', value: 'finance' },
  { label: 'Retention', value: 'retention' },
] as const

export const EXPORT_FORMAT_OPTIONS = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'excel' },
  { label: 'PDF', value: 'pdf' },
] as const

export const RETENTION_PERIOD_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
] as const