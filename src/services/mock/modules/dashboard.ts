// Mock Dashboard Service
import type { MockResponse } from '../index'

class MockDashboardService {
  handle(url: string, method: string): MockResponse | null {
    // Stats endpoint
    if (url.includes('/dashboard/stats') && method === 'get') {
      return {
        data: {
          success: true,
          data: {
            registrations: {
              total: 1234,
              change: 12.5,
            },
            activeUsers: {
              total: 8932,
              change: 8.3,
            },
            pendingKyc: {
              total: 45,
              change: -5.2,
            },
            deposits: {
              totalUsd: 1234567.89,
              change: 15.7,
            },
            withdrawals: {
              totalUsd: 987654.32,
              change: -3.4,
            },
            tradingVolume: {
              totalUsd: 9876543.21,
              change: 22.1,
            },
          },
          message: 'Dashboard stats retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Charts endpoint
    if (url.includes('/dashboard/charts') && method === 'get') {
      const now = Date.now()
      const dayMs = 24 * 60 * 60 * 1000
      return {
        data: {
          success: true,
          data: {
            tradingVolume: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(now - (29 - i) * dayMs).toISOString().split('T')[0],
              value: Math.random() * 1000000 + 500000,
            })),
            userGrowth: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(now - (29 - i) * dayMs).toISOString().split('T')[0],
              value: Math.floor(Math.random() * 100 + 50),
            })),
            orderDistribution: [
              { type: 'Spot', value: 45 },
              { type: 'Futures', value: 35 },
              { type: 'Margin', value: 20 },
            ],
          },
          message: 'Dashboard charts retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Alerts endpoint
    if (url.includes('/dashboard/alerts') && method === 'get') {
      const alerts = [
        {
          id: 'alert-1',
          type: 'kyc',
          title: 'KYC Review Required',
          description: 'User KYC-12345 needs review',
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          metadata: { userId: 'user-123', kycId: 'kyc-12345' },
        },
        {
          id: 'alert-2',
          type: 'withdrawal',
          title: 'Large Withdrawal Pending',
          description: 'Withdrawal of $50,000 needs approval',
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          metadata: { userId: 'user-456', amount: 50000 },
        },
        {
          id: 'alert-3',
          type: 'order',
          title: 'Abnormal Trading Pattern',
          description: 'Unusual order activity detected',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          metadata: { userId: 'user-789', orderId: 'order-999' },
        },
        {
          id: 'alert-4',
          type: 'alert',
          title: 'Risk Alert',
          description: 'High risk score detected for user',
          priority: 'high',
          status: 'pending',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          metadata: { userId: 'user-321', riskScore: 85 },
        },
        {
          id: 'alert-5',
          type: 'kyc',
          title: 'KYC Document Expired',
          description: 'User KYC-67890 document expired',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date(Date.now() - 18000000).toISOString(),
          metadata: { userId: 'user-654', kycId: 'kyc-67890' },
        },
      ]

      return {
        data: {
          success: true,
          data: alerts,
          message: 'Alerts retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockDashboardService = new MockDashboardService()
