/**
 * Strategies Module Contracts
 * 
 * Field contracts based on actual page usage
 * All fields must match exactly what pages expect to render
 */

export interface StrategyTemplate {
  id: string
  name: string
  description: string
  category: 'arbitrage' | 'market-making' | 'trend-following' | 'mean-reversion' | 'custom'
  riskLevel: 'low' | 'medium' | 'high'
  author: string
  status: 'draft' | 'published' | 'archived'
  parameters: Record<string, any>
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface StrategyInstance {
  id: string
  templateId: string
  templateName: string
  name: string
  description: string
  symbol: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  balance: string
  leverage: number
  totalPnl: string
  dailyPnl: string
  winRate: number
  activeSince: string
  lastActivity: string
  riskMetrics?: {
    maxDrawdown: number
    sharpeRatio: number
    volatility: number
  }
  createdAt: string
  updatedAt: string
}

export interface BacktestResult {
  id: string
  strategyId: string
  strategyName: string
  symbol: string
  startTime: string
  endTime: string
  initialCapital: string
  finalCapital: string
  totalReturn: string
  totalReturnPercent: string
  maxDrawdown: string
  sharpeRatio: string
  winRate: string
  totalTrades: number
  profitableTrades: number
  avgTradeReturn: string
  maxConsecutiveWins: number
  maxConsecutiveLosses: number
  parameters: Record<string, any>
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface StrategyPerformance {
  id: string
  strategyId: string
  strategyName: string
  symbol: string
  periodStart: string
  periodEnd: string
  totalPnl: string
  totalPnlPercent: string
  maxDrawdown: number
  sharpeRatio: number
  winRate: number
  totalTrades: number
  avgReturnPerTrade: string
  profitFactor: number
  createdAt: string
  updatedAt: string
}

export interface StrategyMonitoring {
  id: string
  instanceId: string
  instanceName: string
  symbol: string
  status: 'running' | 'warning' | 'error' | 'paused'
  pnl: string
  currentDrawdown: number
  riskMetrics: {
    var: number
    es: number
    maxPositionSize: string
    concentration: number
  }
  lastActivity: string
  alerts: StrategyAlert[]
  createdAt: string
  updatedAt: string
}

export interface StrategyAlert {
  id: string
  strategyId: string
  type: 'drawdown' | 'position_size' | 'concentration' | 'volume_spike' | 'pnl_drop'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  triggeredAt: string
  resolvedAt?: string
  resolvedBy?: string
  status: 'active' | 'resolved' | 'acknowledged'
}

// List Response Contracts
export interface StrategyTemplateListResponse {
  data: StrategyTemplate[]
  total: number
  page: number
  pageSize: number
}

export interface StrategyInstanceListResponse {
  data: StrategyInstance[]
  total: number
  page: number
  pageSize: number
}

export interface BacktestResultListResponse {
  data: BacktestResult[]
  total: number
  page: number
  pageSize: number
}

export interface StrategyPerformanceListResponse {
  data: StrategyPerformance[]
  total: number
  page: number
  pageSize: number
}

export interface StrategyMonitoringListResponse {
  data: StrategyMonitoring[]
  total: number
  page: number
  pageSize: number
}

// Query Parameter Contracts
export interface StrategyTemplateQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published' | 'archived'
  category?: string
  search?: string
}

export interface StrategyInstanceQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'running' | 'paused' | 'stopped' | 'error'
  templateId?: string
  symbol?: string
}

export interface BacktestQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'running' | 'completed' | 'failed' | 'cancelled'
  strategyId?: string
  symbol?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface StrategyPerformanceQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  strategyId?: string
  symbol?: string
  periodStart?: string
  periodEnd?: string
}

export interface StrategyMonitoringQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'running' | 'warning' | 'error' | 'paused'
  alertSeverity?: 'low' | 'medium' | 'high' | 'critical'
  symbol?: string
}

// Action Payload Contracts
export interface CreateStrategyTemplatePayload {
  name: string
  description: string
  category: string
  parameters: Record<string, any>
  riskLevel: 'low' | 'medium' | 'high'
}

export interface UpdateStrategyTemplatePayload {
  name?: string
  description?: string
  category?: string
  parameters?: Record<string, any>
  riskLevel?: 'low' | 'medium' | 'high'
  status?: 'draft' | 'published' | 'archived'
}

export interface CreateStrategyInstancePayload {
  templateId: string
  name: string
  description: string
  symbol: string
  balance: string
  leverage: number
}

export interface UpdateStrategyInstancePayload {
  name?: string
  description?: string
  symbol?: string
  balance?: string
  leverage?: number
  status?: 'running' | 'paused' | 'stopped'
}

export interface RunBacktestPayload {
  strategyId: string
  symbols: string[]
  startDate: string
  endDate: string
  initialCapital: string
  parameters: Record<string, any>
}

export interface UpdateStrategyMonitoringPayload {
  alertThresholds?: Record<string, number>
}