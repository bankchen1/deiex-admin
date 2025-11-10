import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listTradeReports,
  listFinanceReports,
  listRetentionReports,
  getTradeDailyData,
  getSymbolVolumeData,
  getFinanceDailyData,
  getFeeIncomeData,
  getRetentionData,
  getFunnelData,
  exportTradeReport,
  exportFinanceReport,
  exportRetentionReport,
  type TradeReportQueryParams,
  type FinanceReportQueryParams,
  type RetentionReportQueryParams,
  type ExportReportParams,
} from '@/services/api/facade'
import { message } from 'ant-design-vue'
import type {
  TradeReport,
  FinanceReport,
  RetentionReport,
  TradeDailyData,
  SymbolVolumeData,
  FinanceDailyData,
  FeeIncomeData,
  RetentionData,
  FunnelData,
} from '@/contracts/reports'

export const useReportsStore = defineStore('reports', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Trade Reports State
  const tradeReports = ref<TradeReport[]>([])
  const tradeReportsTotal = ref(0)
  const tradeReportsCurrentPage = ref(1)
  const tradeReportsPageSize = ref(20)
  const tradeDailyData = ref<TradeDailyData[]>([])
  const symbolVolumeData = ref<SymbolVolumeData[]>([])

  // Finance Reports State
  const financeReports = ref<FinanceReport[]>([])
  const financeReportsTotal = ref(0)
  const financeReportsCurrentPage = ref(1)
  const financeReportsPageSize = ref(20)
  const financeDailyData = ref<FinanceDailyData[]>([])
  const feeIncomeData = ref<FeeIncomeData[]>([])

  // Retention Reports State
  const retentionReports = ref<RetentionReport[]>([])
  const retentionReportsTotal = ref(0)
  const retentionReportsCurrentPage = ref(1)
  const retentionReportsPageSize = ref(20)
  const retentionData = ref<RetentionData[]>([])
  const funnelData = ref<FunnelData[]>([])

  // Getters
  const hasTradeReports = computed(() => tradeReports.value.length > 0)
  const hasFinanceReports = computed(() => financeReports.value.length > 0)
  const hasRetentionReports = computed(() => retentionReports.value.length > 0)

  // Trade Reports Actions
  async function fetchTradeReports(params: TradeReportQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listTradeReports({
        page: tradeReportsCurrentPage.value,
        pageSize: tradeReportsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        tradeReports.value = []
        tradeReportsTotal.value = 0
        return
      }

      tradeReports.value = data.data
      tradeReportsTotal.value = data.total
      tradeReportsCurrentPage.value = data.page
      tradeReportsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trade reports'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTradeDailyData(
    params: { startDate?: string; endDate?: string; symbol?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getTradeDailyData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        tradeDailyData.value = []
        return
      }

      tradeDailyData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch trade daily data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchSymbolVolumeData(
    params: { startDate?: string; endDate?: string; currency?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getSymbolVolumeData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        symbolVolumeData.value = []
        return
      }

      symbolVolumeData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch symbol volume data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Finance Reports Actions
  async function fetchFinanceReports(params: FinanceReportQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listFinanceReports({
        page: financeReportsCurrentPage.value,
        pageSize: financeReportsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        financeReports.value = []
        financeReportsTotal.value = 0
        return
      }

      financeReports.value = data.data
      financeReportsTotal.value = data.total
      financeReportsCurrentPage.value = data.page
      financeReportsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch finance reports'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFinanceDailyData(
    params: { startDate?: string; endDate?: string; currency?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getFinanceDailyData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        financeDailyData.value = []
        return
      }

      financeDailyData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch finance daily data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFeeIncomeData(
    params: { startDate?: string; endDate?: string; feeType?: string; currency?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getFeeIncomeData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        feeIncomeData.value = []
        return
      }

      feeIncomeData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch fee income data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Retention Reports Actions
  async function fetchRetentionReports(params: RetentionReportQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listRetentionReports({
        page: retentionReportsCurrentPage.value,
        pageSize: retentionReportsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        retentionReports.value = []
        retentionReportsTotal.value = 0
        return
      }

      retentionReports.value = data.data
      retentionReportsTotal.value = data.total
      retentionReportsCurrentPage.value = data.page
      retentionReportsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retention reports'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRetentionData(
    params: { startDate?: string; endDate?: string; period?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getRetentionData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        retentionData.value = []
        return
      }

      retentionData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retention data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFunnelData(
    params: { startDate?: string; endDate?: string; step?: string } = {}
  ) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await getFunnelData(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        funnelData.value = []
        return
      }

      funnelData.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch funnel data'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Export Actions
  async function exportTradeReportAction(params: ExportReportParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await exportTradeReport(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to export trade report')
      }

      // Create download
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `trade-reports-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success('Trade report exported successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to export trade report'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportFinanceReportAction(params: ExportReportParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await exportFinanceReport(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to export finance report')
      }

      // Create download
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `finance-reports-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success('Finance report exported successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to export finance report'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportRetentionReportAction(params: ExportReportParams) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await exportRetentionReport(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to export retention report')
      }

      // Create download
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `retention-reports-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success('Retention report exported successfully')
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to export retention report'
      message.error(error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Page setters
  function setTradeReportsPage(page: number) {
    tradeReportsCurrentPage.value = page
  }

  function setTradeReportsPageSize(size: number) {
    tradeReportsPageSize.value = size
    tradeReportsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setFinanceReportsPage(page: number) {
    financeReportsCurrentPage.value = page
  }

  function setFinanceReportsPageSize(size: number) {
    financeReportsPageSize.value = size
    financeReportsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setRetentionReportsPage(page: number) {
    retentionReportsCurrentPage.value = page
  }

  function setRetentionReportsPageSize(size: number) {
    retentionReportsPageSize.value = size
    retentionReportsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  // Reset function
  function reset() {
    loading.value = false
    error.value = null

    // Reset trade reports state
    tradeReports.value = []
    tradeReportsTotal.value = 0
    tradeReportsCurrentPage.value = 1
    tradeReportsPageSize.value = 20
    tradeDailyData.value = []
    symbolVolumeData.value = []

    // Reset finance reports state
    financeReports.value = []
    financeReportsTotal.value = 0
    financeReportsCurrentPage.value = 1
    financeReportsPageSize.value = 20
    financeDailyData.value = []
    feeIncomeData.value = []

    // Reset retention reports state
    retentionReports.value = []
    retentionReportsTotal.value = 0
    retentionReportsCurrentPage.value = 1
    retentionReportsPageSize.value = 20
    retentionData.value = []
    funnelData.value = []
  }

  return {
    // State - Trade Reports
    loading,
    error,
    tradeReports,
    tradeReportsTotal,
    tradeReportsCurrentPage,
    tradeReportsPageSize,
    tradeDailyData,
    symbolVolumeData,
    // State - Finance Reports
    financeReports,
    financeReportsTotal,
    financeReportsCurrentPage,
    financeReportsPageSize,
    financeDailyData,
    feeIncomeData,
    // State - Retention Reports
    retentionReports,
    retentionReportsTotal,
    retentionReportsCurrentPage,
    retentionReportsPageSize,
    retentionData,
    funnelData,
    // Getters
    hasTradeReports,
    hasFinanceReports,
    hasRetentionReports,
    // Actions - Trade Reports
    fetchTradeReports,
    fetchTradeDailyData,
    fetchSymbolVolumeData,
    // Actions - Finance Reports
    fetchFinanceReports,
    fetchFinanceDailyData,
    fetchFeeIncomeData,
    // Actions - Retention Reports
    fetchRetentionReports,
    fetchRetentionData,
    fetchFunnelData,
    // Actions - Export
    exportTradeReport: exportTradeReportAction,
    exportFinanceReport: exportFinanceReportAction,
    exportRetentionReport: exportRetentionReportAction,
    // Page setters
    setTradeReportsPage,
    setTradeReportsPageSize,
    setFinanceReportsPage,
    setFinanceReportsPageSize,
    setRetentionReportsPage,
    setRetentionReportsPageSize,
    // Reset
    reset,
  }
})
