// Mock Risk Service
import type { MockResponse } from '../index'

class MockRiskService {
  handle(url: string, method: string, data?: unknown): MockResponse | null {
    if (url.includes('/risk') && method === 'get') {
      return {
        data: {
          success: true,
          data: {
            riskScore: 75,
            alerts: Array.from({ length: 5 }, (_, i) => ({
              id: `alert-${i}`,
              type: ['high_volume', 'suspicious_pattern', 'kyc_mismatch'][i % 3],
              severity: ['high', 'medium', 'low'][i % 3],
              userId: `user-${i + 1}`,
              timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            })),
          },
          message: 'Risk data retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    if (url.includes('/risk') && ['post', 'put', 'patch'].includes(method)) {
      return {
        data: {
          success: true,
          data: data || {},
          message: 'Risk settings updated',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockRiskService = new MockRiskService()
