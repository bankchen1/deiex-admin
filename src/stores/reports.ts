import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportsApi } from '@/services/api/reports'
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

export const useReportsStore = defineStore('reports', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Trade Reports State
  const tradeReports = ref<TradeReportResponse | null>(null)
  const tradeDailyData = ref<TradeDailyData[]>([])
  const symbolVolumeData = ref<SymbolVolumeData[]>([])

  // Finance Reports State
  const financeReports = ref<FinanceReportResponse | null>(null)
  const financeDailyData = ref<FinanceDailyData[]>([])
  const feeIncomeData = ref<FeeIncomeData[]>([])

  // Retention Reports State
  const retentionReports = ref<RetentionReportResponse | null>(null)
  const retentionData = ref<RetentionData[]>([])
  const funnelData = ref<FunnelData[]>([])

  // Trade Reports Actions
  async function fetchTradeReports(params: TradeReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getTradeReports(params)
      tradeReports.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trade reports'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTradeDailyData(params: TradeReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getTradeDailyData(params)
      tradeDailyData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trade daily data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchSymbolVolumeData(params: TradeReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getSymbolVolumeData(params)
      symbolVolumeData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch symbol volume data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportTradeReport(params: TradeReportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await reportsApi.exportTradeReport(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `trade-report-${params.startDate}-${params.endDate}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export trade report'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Finance Reports Actions
  async function fetchFinanceReports(params: FinanceReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getFinanceReports(params)
      financeReports.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch finance reports'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFinanceDailyData(params: FinanceReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getFinanceDailyData(params)
      financeDailyData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch finance daily data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFeeIncomeData(params: FinanceReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getFeeIncomeData(params)
      feeIncomeData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch fee income data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportFinanceReport(params: FinanceReportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await reportsApi.exportFinanceReport(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finance-report-${params.startDate}-${params.endDate}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export finance report'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Retention Reports Actions
  async function fetchRetentionReports(params: RetentionReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getRetentionReports(params)
      retentionReports.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retention reports'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRetentionData(params: RetentionReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getRetentionData(params)
      retentionData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retention data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFunnelData(params: RetentionReportParams) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getFunnelData(params)
      funnelData.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch funnel data'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportRetentionReport(params: RetentionReportParams) {
    loading.value = true
    error.value = null
    try {
      const blob = await reportsApi.exportRetentionReport(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `retention-report-${params.startDate}-${params.endDate}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export retention report'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    tradeReports.value = null
    tradeDailyData.value = []
    symbolVolumeData.value = []
    financeReports.value = null
    financeDailyData.value = []
    feeIncomeData.value = []
    retentionReports.value = null
    retentionData.value = []
    funnelData.value = []
  }

  return {
    // State
    loading,
    error,
    tradeReports,
    tradeDailyData,
    symbolVolumeData,
    financeReports,
    financeDailyData,
    feeIncomeData,
    retentionReports,
    retentionData,
    funnelData,
    // Actions
    fetchTradeReports,
    fetchTradeDailyData,
    fetchSymbolVolumeData,
    exportTradeReport,
    fetchFinanceReports,
    fetchFinanceDailyData,
    fetchFeeIncomeData,
    exportFinanceReport,
    fetchRetentionReports,
    fetchRetentionData,
    fetchFunnelData,
    exportRetentionReport,
    reset,
  }
})
