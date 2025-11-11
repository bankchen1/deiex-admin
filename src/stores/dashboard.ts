import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDashboardStats,
  getDashboardCharts,
  getDashboardAlerts,
  getDashboardAlertById,
  updateAlertStatus,
  type DateRangeParams,
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
      const response = await getDashboardStats(params)
      if (response.success) {
        stats.value = response.data
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats')
      }
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
      const response = await getDashboardCharts(params)
      if (response.success) {
        charts.value = response.data
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard charts')
      }
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
      const response = await getDashboardAlerts(params)
      if (response.success) {
        alerts.value = response.data
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch alerts')
      }
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
      const response = await getDashboardAlertById(id)
      if (response.success) {
        currentAlert.value = response.data
        return response
      } else {
        throw new Error(response.message || 'Failed to fetch alert detail')
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch alert detail'
      throw e
    } finally {
      alertDetailLoading.value = false
    }
  }

  async function updateAlertStatus(id: string, status: string, notes?: string) {
    error.value = null
    try {
      const response = await updateAlertStatus(id, status, notes)
      if (response.success) {
        // Update the alert in the list
        const index = alerts.value.findIndex((a) => a.id === id)
        if (index !== -1) {
          alerts.value[index] = response.data
        }
        // Update current alert if it's the same
        if (currentAlert.value?.id === id) {
          currentAlert.value = { ...currentAlert.value, ...response.data }
        }
        return response
      } else {
        throw new Error(response.message || 'Failed to update alert status')
      }
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
    updateAlertStatus,
    refreshDashboard,
    reset,
  }
})
