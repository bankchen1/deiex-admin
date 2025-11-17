import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDashboardStats,
  getDashboardCharts,
  getDashboardAlerts,
  getDashboardAlertById,
  updateAlertStatus as updateAlertStatusFacade,
} from '@/services/api/facade'
import type {
  DashboardStats,
  DashboardCharts,
  Alert,
  AlertDetail,
  DashboardQueryParams,
} from '@/contracts/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const statsLoading = ref(false)
  const chartsLoading = ref(false)
  const alertsLoading = ref(false)
  const alertDetailLoading = ref(false)

  const stats = ref<DashboardStats | null>(null)
  const charts = ref<DashboardCharts | null>(null)
  const alerts = ref<Alert[]>([])
  const currentAlert = ref<AlertDetail | null>(null)

  const error = ref<string | null>(null)

  // Actions
  async function fetchStats(params?: DashboardQueryParams) {
    statsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getDashboardStats(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      stats.value = data || null
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch dashboard stats'
      throw e
    } finally {
      statsLoading.value = false
    }
  }

  async function fetchCharts(params?: DashboardQueryParams) {
    chartsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getDashboardCharts(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      charts.value = data || null
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch dashboard charts'
      throw e
    } finally {
      chartsLoading.value = false
    }
  }

  async function fetchAlerts(params?: { status?: string; type?: string; limit?: number }) {
    alertsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getDashboardAlerts(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      alerts.value = data || []
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch alerts'
      throw e
    } finally {
      alertsLoading.value = false
    }
  }

  async function fetchAlertById(id: string) {
    alertDetailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getDashboardAlertById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      currentAlert.value = data || null
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch alert detail'
      throw e
    } finally {
      alertDetailLoading.value = false
    }
  }

  async function updateAlert(id: string, status: string, notes?: string) {
    error.value = null
    try {
      const { data, error: err } = await updateAlertStatusFacade(id, status, notes)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (data) {
        // Update the alert in the list
        const index = alerts.value.findIndex((a) => a.id === id)
        if (index !== -1) {
          alerts.value[index] = data
        }
        // Update current alert if it's the same
        if (currentAlert.value?.id === id) {
          currentAlert.value = { ...currentAlert.value, ...data }
        }
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update alert status'
      throw e
    }
  }

  async function refreshDashboard(params?: DashboardQueryParams) {
    await Promise.all([
      fetchStats(params),
      fetchCharts(params),
      fetchAlerts({ status: 'pending', limit: 10 }),
    ])
  }

  function reset() {
    statsLoading.value = false
    chartsLoading.value = false
    alertsLoading.value = false
    alertDetailLoading.value = false
    stats.value = null
    charts.value = null
    alerts.value = []
    currentAlert.value = null
    error.value = null
  }

  return {
    // State
    statsLoading,
    chartsLoading,
    alertsLoading,
    alertDetailLoading,
    stats,
    charts,
    alerts,
    currentAlert,
    error,
    // Actions
    fetchStats,
    fetchCharts,
    fetchAlerts,
    fetchAlertById,
    updateAlert,
    refreshDashboard,
    reset,
  }
})
