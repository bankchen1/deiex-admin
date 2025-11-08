// Mock Assets Service
import type { MockResponse } from '../index'

class MockAssetsService {
  private mockAssets = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'].map((symbol, i) => ({
    id: `asset-${i + 1}`,
    symbol,
    name: `${symbol} Token`,
    type: symbol === 'USDT' ? 'stablecoin' : 'crypto',
    status: 'active',
    decimals: 8,
    minWithdrawal: 0.001,
    maxWithdrawal: 100,
    withdrawalFee: 0.0001,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Deposits
    if (url.includes('/deposits') && method === 'get') {
      const deposits = Array.from({ length: 50 }, (_, i) => ({
        id: `deposit-${i + 1}`,
        userId: `user-${(i % 30) + 1}`,
        userNickname: `user${(i % 30) + 1}`,
        currency: this.mockAssets[i % this.mockAssets.length].symbol,
        chain: ['BTC', 'ETH', 'BSC', 'TRX', 'SOL'][i % 5],
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        amount: (Math.random() * 10000).toFixed(8),
        status: ['pending', 'confirming', 'completed', 'failed'][i % 4] as
          | 'pending'
          | 'confirming'
          | 'completed'
          | 'failed',
        confirmations: i % 4 === 1 ? Math.floor(Math.random() * 10) : i % 4 === 2 ? 12 : 0,
        requiredConfirmations: 12,
        riskFlags: i % 7 === 0 ? ['large_amount'] : i % 11 === 0 ? ['suspicious_address'] : [],
        riskScore: i % 7 === 0 ? 75 : i % 11 === 0 ? 85 : Math.floor(Math.random() * 50),
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt:
          i % 4 === 2
            ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        notes: i % 10 === 0 ? 'Flagged for review' : undefined,
      }))

      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: deposits.slice(start, end),
            total: deposits.length,
            page,
            pageSize,
          },
          message: 'Deposits retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Withdrawals
    if (url.includes('/withdrawals') && method === 'get') {
      const withdrawals = Array.from({ length: 50 }, (_, i) => ({
        id: `withdrawal-${i + 1}`,
        userId: `user-${(i % 30) + 1}`,
        userNickname: `user${(i % 30) + 1}`,
        currency: this.mockAssets[i % this.mockAssets.length].symbol,
        chain: ['BTC', 'ETH', 'BSC', 'TRX', 'SOL'][i % 5],
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        amount: (Math.random() * 5000).toFixed(8),
        fee: (Math.random() * 10).toFixed(8),
        status: ['pending', 'reviewing', 'approved', 'processing', 'completed', 'rejected'][
          i % 6
        ] as 'pending' | 'reviewing' | 'approved' | 'processing' | 'completed' | 'rejected',
        riskScore: Math.floor(Math.random() * 100),
        matchedRules:
          i % 5 === 0 ? ['large_amount', 'new_address'] : i % 7 === 0 ? ['high_frequency'] : [],
        approvals:
          i % 3 === 0
            ? [
                {
                  role: 'risk_manager',
                  adminId: 'admin-1',
                  adminName: 'Risk Manager',
                  action: 'approve' as const,
                  reason: 'Risk check passed',
                  timestamp: new Date(
                    Date.now() - Math.random() * 24 * 60 * 60 * 1000
                  ).toISOString(),
                },
              ]
            : [],
        txHash: i % 6 === 4 ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt:
          i % 6 === 4
            ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        rejectedReason: i % 6 === 5 ? 'High risk score' : undefined,
        notes: i % 10 === 0 ? 'Requires additional review' : undefined,
      }))

      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: withdrawals.slice(start, end),
            total: withdrawals.length,
            page,
            pageSize,
          },
          message: 'Withdrawals retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    if (url.includes('/assets') && method === 'get') {
      return {
        data: {
          success: true,
          data: {
            items: this.mockAssets,
            total: this.mockAssets.length,
          },
          message: 'Assets retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    if (url.includes('/assets') && ['post', 'put', 'patch', 'delete'].includes(method)) {
      return {
        data: {
          success: true,
          data: data || {},
          message: 'Asset updated successfully',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockAssetsService = new MockAssetsService()
