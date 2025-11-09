import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listStrategyTemplates,
  getStrategyTemplateById,
  createStrategyTemplate,
  updateStrategyTemplate,
  deleteStrategyTemplate,
  listStrategyInstances,
  getStrategyInstanceById,
  createStrategyInstance,
  updateStrategyInstance,
  deleteStrategyInstance,
  startStrategyInstance,
  stopStrategyInstance,
  listBacktestResults,
  getBacktestResultById,
  runBacktest,
  deleteBacktestResult,
  listStrategyPerformance,
  getStrategyPerformanceById,
  listStrategyMonitoring,
  getStrategyMonitoringById,
  updateStrategyMonitoring,
  type StrategyTemplateQueryParams,
  type StrategyInstanceQueryParams,
  type BacktestQueryParams,
  type StrategyPerformanceQueryParams,
  type StrategyMonitoringQueryParams,
  type CreateStrategyTemplatePayload,
  type UpdateStrategyTemplatePayload,
  type CreateStrategyInstancePayload,
  type UpdateStrategyInstancePayload,
  type RunBacktestPayload,
  type UpdateStrategyMonitoringPayload,
} from '@/services/api/facade'
import type { 
  StrategyTemplate, 
  StrategyInstance, 
  BacktestResult, 
  StrategyPerformance, 
  StrategyMonitoring 
} from '@/contracts/strategies'

export const useStrategiesStore = defineStore('strategies', () => {
  // State
  const loading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)
  const error = ref<string | null>(null)

  // Strategy Templates
  const strategyTemplates = ref<StrategyTemplate[]>([])
  const strategyTemplatesTotal = ref(0)
  const strategyTemplatesPage = ref(1)
  const strategyTemplatesPageSize = ref(20)

  const currentTemplate = ref<StrategyTemplate | null>(null)

  // Strategy Instances
  const strategyInstances = ref<StrategyInstance[]>([])
  const strategyInstancesTotal = ref(0)
  const strategyInstancesPage = ref(1)
  const strategyInstancesPageSize = ref(20)

  const currentInstance = ref<StrategyInstance | null>(null)

  // Backtest Results
  const backtestResults = ref<BacktestResult[]>([])
  const backtestResultsTotal = ref(0)
  const backtestResultsPage = ref(1)
  const backtestResultsPageSize = ref(20)

  const currentBacktestResult = ref<BacktestResult | null>(null)

  // Strategy Performance
  const strategyPerformance = ref<StrategyPerformance[]>([])
  const strategyPerformanceTotal = ref(0)
  const strategyPerformancePage = ref(1)
  const strategyPerformancePageSize = ref(20)

  const currentPerformance = ref<StrategyPerformance | null>(null)

  // Strategy Monitoring
  const strategyMonitoring = ref<StrategyMonitoring[]>([])
  const strategyMonitoringTotal = ref(0)
  const strategyMonitoringPage = ref(1)
  const strategyMonitoringPageSize = ref(20)

  const currentMonitoring = ref<StrategyMonitoring | null>(null)

  // Getters
  const hasStrategyTemplates = computed(() => strategyTemplates.value.length > 0)
  const hasStrategyInstances = computed(() => strategyInstances.value.length > 0)
  const hasBacktestResults = computed(() => backtestResults.value.length > 0)
  const hasStrategyPerformance = computed(() => strategyPerformance.value.length > 0)
  const hasStrategyMonitoring = computed(() => strategyMonitoring.value.length > 0)

  // Actions - Strategy Templates
  async function fetchStrategyTemplates(params: StrategyTemplateQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listStrategyTemplates({
        page: strategyTemplatesPage.value,
        pageSize: strategyTemplatesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        strategyTemplates.value = []
        strategyTemplatesTotal.value = 0
        return
      }

      strategyTemplates.value = data.data
      strategyTemplatesTotal.value = data.total
      strategyTemplatesPage.value = data.page
      strategyTemplatesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy templates'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchStrategyTemplateById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getStrategyTemplateById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Strategy template not found')
      }

      currentTemplate.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy template'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function createStrategyTemplateAction(payload: CreateStrategyTemplatePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createStrategyTemplate(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create strategy template')
      }

      // Add to the list
      strategyTemplates.value.unshift(data)
      strategyTemplatesTotal.value += 1

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create strategy template'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateStrategyTemplateAction(id: string, payload: UpdateStrategyTemplatePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateStrategyTemplate(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update strategy template')
      }

      // Update the template in the list
      const index = strategyTemplates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        strategyTemplates.value[index] = data
      }

      // Update current template if it's the same
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update strategy template'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteStrategyTemplateAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteStrategyTemplate(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete strategy template')
      }

      // Remove from the list
      const index = strategyTemplates.value.findIndex(template => template.id === id)
      if (index !== -1) {
        strategyTemplates.value.splice(index, 1)
        strategyTemplatesTotal.value -= 1
      }

      // Clear current template if it's the same
      if (currentTemplate.value?.id === id) {
        currentTemplate.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete strategy template'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Strategy Instances
  async function fetchStrategyInstances(params: StrategyInstanceQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listStrategyInstances({
        page: strategyInstancesPage.value,
        pageSize: strategyInstancesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        strategyInstances.value = []
        strategyInstancesTotal.value = 0
        return
      }

      strategyInstances.value = data.data
      strategyInstancesTotal.value = data.total
      strategyInstancesPage.value = data.page
      strategyInstancesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy instances'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchStrategyInstanceById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getStrategyInstanceById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Strategy instance not found')
      }

      currentInstance.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy instance'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function createStrategyInstanceAction(payload: CreateStrategyInstancePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createStrategyInstance(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create strategy instance')
      }

      // Add to the list
      strategyInstances.value.unshift(data)
      strategyInstancesTotal.value += 1

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create strategy instance'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateStrategyInstanceAction(id: string, payload: UpdateStrategyInstancePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateStrategyInstance(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update strategy instance')
      }

      // Update the instance in the list
      const index = strategyInstances.value.findIndex(instance => instance.id === id)
      if (index !== -1) {
        strategyInstances.value[index] = data
      }

      // Update current instance if it's the same
      if (currentInstance.value?.id === id) {
        currentInstance.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update strategy instance'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function startStrategyInstanceAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await startStrategyInstance(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to start strategy instance')
      }

      // Update the instance in the list
      const index = strategyInstances.value.findIndex(instance => instance.id === id)
      if (index !== -1) {
        strategyInstances.value[index] = data
      }

      // Update current instance if it's the same
      if (currentInstance.value?.id === id) {
        currentInstance.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to start strategy instance'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function stopStrategyInstanceAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await stopStrategyInstance(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to stop strategy instance')
      }

      // Update the instance in the list
      const index = strategyInstances.value.findIndex(instance => instance.id === id)
      if (index !== -1) {
        strategyInstances.value[index] = data
      }

      // Update current instance if it's the same
      if (currentInstance.value?.id === id) {
        currentInstance.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to stop strategy instance'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteStrategyInstanceAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteStrategyInstance(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete strategy instance')
      }

      // Remove from the list
      const index = strategyInstances.value.findIndex(instance => instance.id === id)
      if (index !== -1) {
        strategyInstances.value.splice(index, 1)
        strategyInstancesTotal.value -= 1
      }

      // Clear current instance if it's the same
      if (currentInstance.value?.id === id) {
        currentInstance.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete strategy instance'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Backtest Results
  async function fetchBacktestResults(params: BacktestQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listBacktestResults({
        page: backtestResultsPage.value,
        pageSize: backtestResultsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        backtestResults.value = []
        backtestResultsTotal.value = 0
        return
      }

      backtestResults.value = data.data
      backtestResultsTotal.value = data.total
      backtestResultsPage.value = data.page
      backtestResultsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch backtest results'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchBacktestResultById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getBacktestResultById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Backtest result not found')
      }

      currentBacktestResult.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch backtest result'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function runBacktestAction(payload: RunBacktestPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await runBacktest(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to run backtest')
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to run backtest'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteBacktestResultAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteBacktestResult(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete backtest result')
      }

      // Remove from the list
      const index = backtestResults.value.findIndex(result => result.id === id)
      if (index !== -1) {
        backtestResults.value.splice(index, 1)
        backtestResultsTotal.value -= 1
      }

      // Clear current backtest result if it's the same
      if (currentBacktestResult.value?.id === id) {
        currentBacktestResult.value = null
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete backtest result'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Strategy Performance
  async function fetchStrategyPerformance(params: StrategyPerformanceQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listStrategyPerformance({
        page: strategyPerformancePage.value,
        pageSize: strategyPerformancePageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        strategyPerformance.value = []
        strategyPerformanceTotal.value = 0
        return
      }

      strategyPerformance.value = data.data
      strategyPerformanceTotal.value = data.total
      strategyPerformancePage.value = data.page
      strategyPerformancePageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy performance'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchStrategyPerformanceById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getStrategyPerformanceById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Strategy performance not found')
      }

      currentPerformance.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy performance'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  // Actions - Strategy Monitoring
  async function fetchStrategyMonitoring(params: StrategyMonitoringQueryParams = {}) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await listStrategyMonitoring({
        page: strategyMonitoringPage.value,
        pageSize: strategyMonitoringPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        strategyMonitoring.value = []
        strategyMonitoringTotal.value = 0
        return
      }

      strategyMonitoring.value = data.data
      strategyMonitoringTotal.value = data.total
      strategyMonitoringPage.value = data.page
      strategyMonitoringPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy monitoring'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchStrategyMonitoringById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getStrategyMonitoringById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Strategy monitoring not found')
      }

      currentMonitoring.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch strategy monitoring'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function updateStrategyMonitoringAction(id: string, payload: UpdateStrategyMonitoringPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateStrategyMonitoring(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update strategy monitoring')
      }

      // Update the monitoring in the list
      const index = strategyMonitoring.value.findIndex(monitor => monitor.id === id)
      if (index !== -1) {
        strategyMonitoring.value[index] = data
      }

      // Update current monitoring if it's the same
      if (currentMonitoring.value?.id === id) {
        currentMonitoring.value = data
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update strategy monitoring'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Page setters
  function setStrategyTemplatesPage(page: number) {
    strategyTemplatesPage.value = page
  }

  function setStrategyTemplatesPageSize(size: number) {
    strategyTemplatesPageSize.value = size
    strategyTemplatesPage.value = 1 // Reset to first page when changing page size
  }

  function setStrategyInstancesPage(page: number) {
    strategyInstancesPage.value = page
  }

  function setStrategyInstancesPageSize(size: number) {
    strategyInstancesPageSize.value = size
    strategyInstancesPage.value = 1 // Reset to first page when changing page size
  }

  function setBacktestResultsPage(page: number) {
    backtestResultsPage.value = page
  }

  function setBacktestResultsPageSize(size: number) {
    backtestResultsPageSize.value = size
    backtestResultsPage.value = 1 // Reset to first page when changing page size
  }

  function setStrategyPerformancePage(page: number) {
    strategyPerformancePage.value = page
  }

  function setStrategyPerformancePageSize(size: number) {
    strategyPerformancePageSize.value = size
    strategyPerformancePage.value = 1 // Reset to first page when changing page size
  }

  function setStrategyMonitoringPage(page: number) {
    strategyMonitoringPage.value = page
  }

  function setStrategyMonitoringPageSize(size: number) {
    strategyMonitoringPageSize.value = size
    strategyMonitoringPage.value = 1 // Reset to first page when changing page size
  }

  // Reset function
  function reset() {
    loading.value = false
    detailLoading.value = false
    actionLoading.value = false
    error.value = null

    strategyTemplates.value = []
    strategyTemplatesTotal.value = 0
    strategyTemplatesPage.value = 1
    strategyTemplatesPageSize.value = 20
    currentTemplate.value = null

    strategyInstances.value = []
    strategyInstancesTotal.value = 0
    strategyInstancesPage.value = 1
    strategyInstancesPageSize.value = 20
    currentInstance.value = null

    backtestResults.value = []
    backtestResultsTotal.value = 0
    backtestResultsPage.value = 1
    backtestResultsPageSize.value = 20
    currentBacktestResult.value = null

    strategyPerformance.value = []
    strategyPerformanceTotal.value = 0
    strategyPerformancePage.value = 1
    strategyPerformancePageSize.value = 20
    currentPerformance.value = null

    strategyMonitoring.value = []
    strategyMonitoringTotal.value = 0
    strategyMonitoringPage.value = 1
    strategyMonitoringPageSize.value = 20
    currentMonitoring.value = null
  }

  return {
    // State
    loading,
    detailLoading,
    actionLoading,
    error,

    // Templates
    strategyTemplates,
    strategyTemplatesTotal,
    strategyTemplatesPage,
    strategyTemplatesPageSize,
    currentTemplate,

    // Instances
    strategyInstances,
    strategyInstancesTotal,
    strategyInstancesPage,
    strategyInstancesPageSize,
    currentInstance,

    // Backtest Results
    backtestResults,
    backtestResultsTotal,
    backtestResultsPage,
    backtestResultsPageSize,
    currentBacktestResult,

    // Performance
    strategyPerformance,
    strategyPerformanceTotal,
    strategyPerformancePage,
    strategyPerformancePageSize,
    currentPerformance,

    // Monitoring
    strategyMonitoring,
    strategyMonitoringTotal,
    strategyMonitoringPage,
    strategyMonitoringPageSize,
    currentMonitoring,

    // Getters
    hasStrategyTemplates,
    hasStrategyInstances,
    hasBacktestResults,
    hasStrategyPerformance,
    hasStrategyMonitoring,

    // Template Actions
    fetchStrategyTemplates,
    fetchStrategyTemplateById,
    createStrategyTemplate: createStrategyTemplateAction,
    updateStrategyTemplate: updateStrategyTemplateAction,
    deleteStrategyTemplate: deleteStrategyTemplateAction,

    // Instance Actions
    fetchStrategyInstances,
    fetchStrategyInstanceById,
    createStrategyInstance: createStrategyInstanceAction,
    updateStrategyInstance: updateStrategyInstanceAction,
    deleteStrategyInstance: deleteStrategyInstanceAction,
    startStrategyInstance: startStrategyInstanceAction,
    stopStrategyInstance: stopStrategyInstanceAction,

    // Backtest Actions
    fetchBacktestResults,
    fetchBacktestResultById,
    runBacktest: runBacktestAction,
    deleteBacktestResult: deleteBacktestResultAction,

    // Performance Actions
    fetchStrategyPerformance,
    fetchStrategyPerformanceById,

    // Monitoring Actions
    fetchStrategyMonitoring,
    fetchStrategyMonitoringById,
    updateStrategyMonitoring: updateStrategyMonitoringAction,

    // Page setters
    setStrategyTemplatesPage,
    setStrategyTemplatesPageSize,
    setStrategyInstancesPage,
    setStrategyInstancesPageSize,
    setBacktestResultsPage,
    setBacktestResultsPageSize,
    setStrategyPerformancePage,
    setStrategyPerformancePageSize,
    setStrategyMonitoringPage,
    setStrategyMonitoringPageSize,

    // Reset
    reset,
  }
})