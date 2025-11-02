import { apiClient } from './AdminApiClient'
import type {
  TradeReportParams,
  TradeReportResponse,
  FinanceReportParams,
  FinanceReportResponse,
  RetentionReportParams,
  RetentionReportResponse,
  TradeDailyData,
  SymbolVolumeData,
  FinanceDailyData,
  FeeIncomeData,
  RetentionData,
  FunnelData,
} from '@/types/api'

export const reportsApi = {
  // Trade Reports
  getTradeReports(params: TradeReportParams) {
    return apiClient.get<TradeReportResponse>('/admin/reports/trade', { params })
  },

  getTradeDailyData(params: TradeReportParams) {
    return apiClient.get<{ data: TradeDailyData[] }>('/admin/reports/trade/daily', { params })
  },

  getSymbolVolumeData(params: TradeReportParams) {
    return apiClient.get<{ data: SymbolVolumeData[] }>('/admin/reports/trade/symbols', { params })
  },

  exportTradeReport(params: TradeReportParams) {
    return apiClient.get<Blob>('/admin/reports/trade/export', {
      params,
      responseType: 'blob',
    })
  },

  // Finance Reports
  getFinanceReports(params: FinanceReportParams) {
    return apiClient.get<FinanceReportResponse>('/admin/reports/finance', { params })
  },

  getFinanceDailyData(params: FinanceReportParams) {
    return apiClient.get<{ data: FinanceDailyData[] }>('/admin/reports/finance/daily', { params })
  },

  getFeeIncomeData(params: FinanceReportParams) {
    return apiClient.get<{ data: FeeIncomeData[] }>('/admin/reports/finance/fees', { params })
  },

  exportFinanceReport(params: FinanceReportParams) {
    return apiClient.get<Blob>('/admin/reports/finance/export', {
      params,
      responseType: 'blob',
    })
  },

  // Retention Reports
  getRetentionReports(params: RetentionReportParams) {
    return apiClient.get<RetentionReportResponse>('/admin/reports/retention', { params })
  },

  getRetentionData(params: RetentionReportParams) {
    return apiClient.get<{ data: RetentionData[] }>('/admin/reports/retention/data', { params })
  },

  getFunnelData(params: RetentionReportParams) {
    return apiClient.get<{ data: FunnelData[] }>('/admin/reports/retention/funnel', { params })
  },

  exportRetentionReport(params: RetentionReportParams) {
    return apiClient.get<Blob>('/admin/reports/retention/export', {
      params,
      responseType: 'blob',
    })
  },
}
