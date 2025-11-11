export interface DashboardStats {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  trading: {
    volume24h: number
    orders24h: number
    growth: number
  }
  revenue: {
    total: number
    today: number
    growth: number
  }
  kyc: {
    pending: number
    approved: number
    rejected: number
  }
}

export interface ChartDataPoint {
  timestamp: string
  value: number
}

export interface DashboardCharts {
  userGrowth: Array<{ date: string; count: number }>
  tradingVolume: Array<{ date: string; volume: number }>
  revenue: Array<{ date: string; amount: number }>
  orderDistribution: Array<{ type: string; count: number }>
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
