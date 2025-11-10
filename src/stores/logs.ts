import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getSystemLogs,
  getAuditLogs,
  getErrorLogs,
  getLogDetail,
  exportLogs as exportLogsApi,
  type SystemLog,
  type AuditLog,
  type ErrorLog,
  type LogDetail,
  type LogQueryParams,
} from '@/services/api/facade'

export const useLogsStore = defineStore('logs', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // System Logs
  const systemLogs = ref<SystemLog[]>([])
  const systemLogsTotal = ref(0)

  // Audit Logs
  const auditLogs = ref<AuditLog[]>([])
  const auditLogsTotal = ref(0)

  // Error Logs
  const errorLogs = ref<ErrorLog[]>([])
  const errorLogsTotal = ref(0)

  // Current Log Detail
  const currentLog = ref<LogDetail | null>(null)

  // Actions
  async function fetchSystemLogs(params: LogQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await getSystemLogs(params)
      if (response.error) throw response.error
      systemLogs.value = response.data.items
      systemLogsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch system logs'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAuditLogs(params: LogQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await getAuditLogs(params)
      if (response.error) throw response.error
      auditLogs.value = response.data.items
      auditLogsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch audit logs'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchErrorLogs(params: LogQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await getErrorLogs(params)
      if (response.error) throw response.error
      errorLogs.value = response.data.items
      errorLogsTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch error logs'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchLogDetail(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await getLogDetail(id)
      if (response.error) throw response.error
      currentLog.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch log detail'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function exportLogs(type: 'system' | 'audit' | 'error', params: LogQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await exportLogsApi(type, params)
      if (response.error) throw response.error
      const blob = response.data

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}-logs-${new Date().toISOString()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return blob
    } catch (e: any) {
      error.value = e.message || 'Failed to export logs'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    systemLogs.value = []
    systemLogsTotal.value = 0
    auditLogs.value = []
    auditLogsTotal.value = 0
    errorLogs.value = []
    errorLogsTotal.value = 0
    currentLog.value = null
  }

  return {
    // State
    loading,
    error,
    systemLogs,
    systemLogsTotal,
    auditLogs,
    auditLogsTotal,
    errorLogs,
    errorLogsTotal,
    currentLog,
    // Actions
    fetchSystemLogs,
    fetchAuditLogs,
    fetchErrorLogs,
    fetchLogDetail,
    exportLogs,
    reset,
  }
})
