import { apiClient } from './AdminApiClient'
import type { ApiResponse } from '@/types/api'

export interface DashboardStats {
  registrations: {
    total: number
    change: number
  }
  activeUsers: {
    total: number
    change: number
  }
  pendingKyc: {
    total: number
    change: number
  }
  deposits: {
    total: number
    totalUsd: number
    change: number
  }
  withdrawals: {
    total: number
    totalUsd: number
    change: number
  }
  tradingVolume: {
    totalUsd: number
    change: number
  }
}

export interface ChartDataPoint {
  timestamp: string
  value: number
}

export interface DashboardCharts {
  tradingVolume: ChartDataPoint[]
  fundingRates: ChartDataPoint[]
  netInflows: ChartDataPoint[]
}

export interface Alert {
  id: string
  title: string
  description: string
  type: 'kyc' | 'withdrawal' | 'order' | 'alert'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
  metadata?: Record<string, any>
}

export interface AlertDetail extends Alert {
  assignedTo?: string
  resolvedAt?: string
  resolvedBy?: string
  notes?: string
  relatedObjects?: Array<{
    type: string
    id: string
    label: string
  }>
}

export interface DashboardQueryParams {
  timeRange?: '7d' | '30d' | '90d'
  startDate?: string
  endDate?: string
}

export const dashboardApi = {
  /**
   * Fetch dashboard statistics
   */
  getStats(params?: DashboardQueryParams) {
    return apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats', { params })
  },

  /**
   * Fetch dashboard charts data
   */
  getCharts(params?: DashboardQueryParams) {
    return apiClient.get<ApiResponse<DashboardCharts>>('/admin/dashboard/charts', { params })
  },

  /**
   * Fetch pending alerts and tasks
   */
  getAlerts(params?: { status?: string; type?: string; limit?: number }) {
    return apiClient.get<ApiResponse<Alert[]>>('/admin/dashboard/alerts', { params })
  },

  /**
   * Fetch alert detail by ID
   */
  getAlertById(id: string) {
    return apiClient.get<ApiResponse<AlertDetail>>(`/admin/dashboard/alerts/${id}`)
  },

  /**
   * Update alert status
   */
  updateAlertStatus(id: string, status: string, notes?: string) {
    return apiClient.patch<ApiResponse<Alert>>(`/admin/dashboard/alerts/${id}`, {
      status,
      notes,
    })
  },
}
