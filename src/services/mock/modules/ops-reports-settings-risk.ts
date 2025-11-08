// Complete Mock for Ops, Reports, Settings, Risk
import type { MockResponse } from '../index'

class MockOpsReportsSettingsRiskService {
  // Operations - Logs
  private mockSystemLogs = Array.from({ length: 100 }, (_, i) => ({
    id: `log-${i + 1}`,
    level: ['info', 'warning', 'error'][i % 3],
    message: `System log message ${i + 1}`,
    module: ['auth', 'trading', 'withdrawal', 'deposit'][i % 4],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    details: { action: 'system_operation', userId: `user-${i % 10}` },
  }))

  // Operations - Tasks
  private mockTasks = Array.from({ length: 50 }, (_, i) => ({
    id: `task-${i + 1}`,
    type: ['withdrawal_review', 'kyc_review', 'risk_alert'][i % 3],
    status: ['pending', 'in_progress', 'completed'][i % 3],
    priority: ['high', 'medium', 'low'][i % 3],
    assignedTo: i % 2 === 0 ? `admin-${i % 5}` : null,
    createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Reports - Trading
  private mockTradingReports = Array.from({ length: 30 }, (_, i) => ({
    id: `report-${i + 1}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalVolume: Math.random() * 10000000,
    totalTrades: Math.floor(Math.random() * 10000),
    uniqueUsers: Math.floor(Math.random() * 1000),
    revenue: Math.random() * 100000,
  }))

  // Reports - User Analytics
  private mockUserReports = Array.from({ length: 30 }, (_, i) => ({
    id: `user-report-${i + 1}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    newUsers: Math.floor(Math.random() * 100),
    activeUsers: Math.floor(Math.random() * 1000),
    kycCompleted: Math.floor(Math.random() * 50),
    totalUsers: 10000 + i * 10,
  }))

  // Reports - Financial
  private mockFinancialReports = Array.from({ length: 30 }, (_, i) => ({
    id: `financial-${i + 1}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDeposits: Math.random() * 1000000,
    totalWithdrawals: Math.random() * 800000,
    netFlow: Math.random() * 200000,
    fees: Math.random() * 50000,
  }))

  // Settings
  private mockSettings = {
    general: {
      siteName: 'DEIEX Admin',
      siteUrl: 'https://admin.deiex.com',
      supportEmail: 'support@deiex.com',
      timezone: 'UTC',
    },
    trading: {
      maintenanceMode: false,
      maxOrderSize: 1000000,
      minOrderSize: 10,
      defaultLeverage: 10,
    },
    security: {
      twoFactorRequired: true,
      ipWhitelistEnabled: true,
      sessionTimeout: 3600,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
    },
  }

  // Risk - Rules
  private mockRiskRules = Array.from({ length: 40 }, (_, i) => ({
    id: `risk-rule-${i + 1}`,
    name: `Risk Rule ${i + 1}`,
    description: `Description for risk rule ${i + 1}`,
    conditions: [
      {
        field: ['amount', 'frequency', 'country', 'vipLevel'][i % 4],
        operator: ['gt', 'gte', 'eq', 'in'][i % 4] as
          | 'eq'
          | 'ne'
          | 'gt'
          | 'gte'
          | 'lt'
          | 'lte'
          | 'in'
          | 'contains',
        value: i % 4 === 0 ? 10000 : i % 4 === 1 ? 5 : i % 4 === 2 ? 'US' : 0,
      },
    ],
    actions: [
      {
        type: ['block', 'review', 'alert', 'tag'][i % 4] as 'block' | 'review' | 'alert' | 'tag',
        params: {
          message: `Action triggered by rule ${i + 1}`,
          tag: i % 4 === 3 ? 'high_risk' : undefined,
        },
      },
    ],
    priority: i + 1,
    enabled: i % 5 !== 0,
    status: (i % 3 === 0 ? 'draft' : 'published') as 'draft' | 'published',
    version: `v${Math.floor(i / 5) + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: `admin-${(i % 3) + 1}`,
    matchCount: Math.floor(Math.random() * 100),
    lastMatchedAt:
      i % 3 === 0
        ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  }))

  // Risk - Alerts
  private mockRiskAlerts = Array.from({ length: 60 }, (_, i) => ({
    id: `alert-${i + 1}`,
    userId: `user-${(i % 30) + 1}`,
    type: ['high_volume', 'suspicious_pattern', 'kyc_mismatch', 'multiple_accounts'][i % 4],
    severity: ['high', 'medium', 'low'][i % 3],
    status: ['open', 'investigating', 'resolved'][i % 3],
    description: `Risk alert description ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Risk - Limits
  private mockRiskLimits = Array.from({ length: 25 }, (_, i) => ({
    id: `limit-${i + 1}`,
    name: `Risk Limit ${i + 1}`,
    description: `Description for limit ${i + 1}`,
    scope: ['user', 'country', 'device', 'currency'][i % 4] as
      | 'user'
      | 'country'
      | 'device'
      | 'currency',
    scopeValue:
      i % 4 === 0
        ? `user-${i}`
        : i % 4 === 1
          ? ['US', 'UK', 'CN'][i % 3]
          : i % 4 === 2
            ? `device-${i}`
            : ['BTC', 'ETH', 'USDT'][i % 3],
    type: ['deposit', 'withdrawal', 'trading', 'position'][i % 4] as
      | 'deposit'
      | 'withdrawal'
      | 'trading'
      | 'position',
    period: ['daily', 'weekly', 'monthly', 'lifetime'][i % 4] as
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'lifetime',
    threshold: (10000 * (i + 1)).toString(),
    currency: ['BTC', 'ETH', 'USDT'][i % 3],
    enabled: i % 4 !== 0,
    effectiveFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveTo:
      i % 5 === 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: `admin-${(i % 3) + 1}`,
    currentUsage: (Math.random() * 10000 * (i + 1)).toFixed(2),
    usagePercentage: Math.floor(Math.random() * 100),
  }))

  // Risk - Blacklist
  private mockBlacklist = Array.from({ length: 30 }, (_, i) => ({
    id: `blacklist-${i + 1}`,
    type: ['address', 'device', 'ip', 'country', 'email', 'phone'][i % 6] as
      | 'address'
      | 'device'
      | 'ip'
      | 'country'
      | 'email'
      | 'phone',
    value:
      i % 6 === 0
        ? `0x${Math.random().toString(16).substring(2, 42)}`
        : i % 6 === 1
          ? `device-${Math.random().toString(36).substring(7)}`
          : i % 6 === 2
            ? `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
            : i % 6 === 3
              ? ['KP', 'IR', 'SY'][i % 3]
              : i % 6 === 4
                ? `user${i}@suspicious.com`
                : `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    reason: [
      'Suspicious activity detected',
      'Fraud attempt',
      'Money laundering',
      'Sanctioned entity',
    ][i % 4],
    source: ['manual', 'auto', 'import'][i % 3] as 'manual' | 'auto' | 'import',
    status: ['active', 'expired', 'removed'][i % 10 === 0 ? 1 : i % 15 === 0 ? 2 : 0] as
      | 'active'
      | 'expired'
      | 'removed',
    addedBy: `admin-${(i % 3) + 1}`,
    addedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt:
      i % 5 === 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    removedAt:
      i % 15 === 0
        ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    removedBy: i % 15 === 0 ? `admin-${(i % 3) + 1}` : undefined,
    notes: i % 7 === 0 ? 'Additional investigation required' : undefined,
    matchCount: Math.floor(Math.random() * 50),
    lastMatchedAt:
      i % 3 === 0
        ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Operations - Logs
    if (url.includes('/ops/logs') || url.includes('/logs')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockSystemLogs, url, true)
      }
    }

    // Operations - Tasks
    if (url.includes('/ops/tasks') || url.includes('/tasks')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockTasks, url, true)
      }
    }

    // Reports - Trading
    if (url.includes('/reports/trading')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockTradingReports, url)
      }
    }

    // Reports - Users
    if (url.includes('/reports/users')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockUserReports, url)
      }
    }

    // Reports - Financial
    if (url.includes('/reports/financial')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockFinancialReports, url)
      }
    }

    // Generic Reports
    if (url.includes('/reports/') && method === 'get') {
      return this.createPaginatedResponse([], url)
    }

    // Settings
    if (url.includes('/settings')) {
      if (method === 'get') {
        return this.createDetailResponse(this.mockSettings)
      }
      if (['post', 'put', 'patch'].includes(method)) {
        return this.createDetailResponse(data || this.mockSettings)
      }
    }

    // Risk - Rules
    if (url.includes('/risk/rules')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockRiskRules, url, true)
      }
    }

    // Risk - Alerts
    if (url.includes('/risk/alerts')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockRiskAlerts, url, true)
      }
    }

    // Risk - Limits
    if (url.includes('/risk/limits')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockRiskLimits, url, true)
      }
    }

    // Risk - Blacklist
    if (url.includes('/risk/blacklist') || url.includes('/blacklist')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockBlacklist, url, true)
      }
    }

    // Generic Risk
    if (url.includes('/risk/') && method === 'get') {
      return this.createPaginatedResponse([], url, true)
    }

    // Create/Update/Delete
    if (
      (url.includes('/ops/') || url.includes('/reports/') || url.includes('/risk/')) &&
      ['post', 'put', 'patch', 'delete'].includes(method)
    ) {
      return this.createDetailResponse(data || {})
    }

    return null
  }

  private createPaginatedResponse(data: any[], url: string, useItems = false): MockResponse {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: {
        success: true,
        data: useItems
          ? {
              items: data.slice(start, end),
              total: data.length,
            }
          : {
              data: data.slice(start, end),
              total: data.length,
              page,
              pageSize,
            },
        message: 'Data retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }

  private createDetailResponse(data: any): MockResponse {
    return {
      data: {
        success: true,
        data: data,
        message: 'Data retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }
}

export const mockOpsReportsSettingsRiskService = new MockOpsReportsSettingsRiskService()
