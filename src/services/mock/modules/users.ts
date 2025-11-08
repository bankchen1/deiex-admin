// Mock Users Service
import type { MockResponse } from '../index'

class MockUserService {
  private mockUsers = Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    nickname: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    kycStatus: ['none', 'pending', 'approved', 'rejected'][i % 4] as
      | 'none'
      | 'pending'
      | 'approved'
      | 'rejected',
    vipLevel: i % 6,
    riskTags: i % 5 === 0 ? ['high_risk'] : i % 7 === 0 ? ['suspicious_activity'] : [],
    assetSnapshot: {
      totalUsd: Math.random() * 100000,
      availableUsd: Math.random() * 80000,
      frozenUsd: Math.random() * 20000,
      currencies: {
        BTC: {
          currency: 'BTC',
          available: (Math.random() * 10).toFixed(8),
          frozen: (Math.random() * 2).toFixed(8),
          usdValue: Math.random() * 50000,
        },
        ETH: {
          currency: 'ETH',
          available: (Math.random() * 100).toFixed(8),
          frozen: (Math.random() * 20).toFixed(8),
          usdValue: Math.random() * 30000,
        },
        USDT: {
          currency: 'USDT',
          available: (Math.random() * 10000).toFixed(2),
          frozen: (Math.random() * 2000).toFixed(2),
          usdValue: Math.random() * 10000,
        },
      },
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['active', 'disabled', 'suspended'][i % 10 === 0 ? 1 : i % 15 === 0 ? 2 : 0] as
      | 'active'
      | 'disabled'
      | 'suspended',
    country: ['US', 'UK', 'JP', 'CN', 'KR', 'SG'][i % 6],
    registrationIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    twoFactorEnabled: i % 3 === 0,
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    console.log('[Mock Users] Handling:', url, method)

    // User stats
    if (url.includes('/users/stats') && method === 'get') {
      console.log('[Mock Users] Matched: stats')
      const activeCount = this.mockUsers.filter((u) => u.status === 'active').length
      const disabledCount = this.mockUsers.filter((u) => u.status === 'disabled').length
      const suspendedCount = this.mockUsers.filter((u) => u.status === 'suspended').length
      const kycPendingCount = this.mockUsers.filter((u) => u.kycStatus === 'pending').length
      const kycApprovedCount = this.mockUsers.filter((u) => u.kycStatus === 'approved').length

      return {
        data: {
          success: true,
          data: {
            total: this.mockUsers.length,
            active: activeCount,
            disabled: disabledCount,
            suspended: suspendedCount,
            todayRegistrations: Math.floor(this.mockUsers.length * 0.05),
            kycPending: kycPendingCount,
            kycApproved: kycApprovedCount,
          },
          message: 'User stats retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // List users
    if (url.includes('/users') && method === 'get' && !url.match(/\/users\/[^/]+$/)) {
      console.log('[Mock Users] Matched: user list')
      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: this.mockUsers.slice(start, end),
            total: this.mockUsers.length,
            page,
            pageSize,
          },
          message: 'Users retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Get user by ID
    if (url.match(/\/users\/[^/]+$/) && method === 'get') {
      console.log('[Mock Users] Matched: user detail')
      const id = url.split('/').pop()
      console.log('[Mock Users] User ID:', id)
      const user = this.mockUsers.find((u) => u.id === id) || this.mockUsers[0]
      console.log('[Mock Users] Found user:', user)

      // Return detailed user info with full UserDetailResponse structure
      const detailResponse = {
        user: user,
        loginRecords: Array.from({ length: 10 }, (_, i) => ({
          id: `login-${i + 1}`,
          userId: user.id,
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Singapore, SG'][i % 4],
          device: ['iPhone 14', 'Chrome on Windows', 'Safari on Mac', 'Android Phone'][i % 4],
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          success: i % 10 !== 0,
        })),
        devices: Array.from({ length: 3 }, (_, i) => ({
          id: `device-${i + 1}`,
          userId: user.id,
          deviceId: `device-${Math.random().toString(36).substring(7)}`,
          deviceType: ['mobile', 'desktop', 'tablet'][i % 3] as 'mobile' | 'desktop' | 'tablet',
          deviceName: ['iPhone 14', 'MacBook Pro', 'iPad'][i % 3],
          os: ['iOS 17', 'macOS 14', 'iPadOS 17'][i % 3],
          browser: ['Safari', 'Chrome', 'Firefox'][i % 3],
          firstSeen: new Date(Date.now() - (30 - i * 10) * 24 * 60 * 60 * 1000).toISOString(),
          lastSeen: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          trusted: i === 0,
        })),
        chainAddresses: Array.from({ length: 5 }, (_, i) => ({
          chain: ['BTC', 'ETH', 'BSC', 'TRX', 'SOL'][i],
          address: `0x${Math.random().toString(16).substring(2, 42)}`,
          createdAt: new Date(Date.now() - (20 - i * 4) * 24 * 60 * 60 * 1000).toISOString(),
        })),
        recentOrders: Array.from({ length: 5 }, (_, i) => ({
          id: `order-${i + 1}`,
          symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i % 3],
          type: ['spot', 'futures'][i % 2] as 'spot' | 'futures',
          side: ['buy', 'sell'][i % 2] as 'buy' | 'sell',
          orderType: ['limit', 'market'][i % 2] as 'limit' | 'market',
          price: (50000 + Math.random() * 10000).toFixed(2),
          quantity: (Math.random() * 10).toFixed(4),
          filled: (Math.random() * 10).toFixed(4),
          status: ['filled', 'partial', 'cancelled'][i % 3] as 'filled' | 'partial' | 'cancelled',
          createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
        })),
        recentPositions: Array.from({ length: 3 }, (_, i) => ({
          id: `position-${i + 1}`,
          symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i],
          side: ['long', 'short'][i % 2] as 'long' | 'short',
          leverage: [5, 10, 20][i],
          entryPrice: (50000 + Math.random() * 10000).toFixed(2),
          markPrice: (51000 + Math.random() * 10000).toFixed(2),
          liquidationPrice: (45000 + Math.random() * 5000).toFixed(2),
          quantity: (Math.random() * 10).toFixed(4),
          unrealizedPnl: ((Math.random() - 0.5) * 1000).toFixed(2),
          riskRatio: Math.random(),
        })),
        auditTrail: Array.from({ length: 10 }, (_, i) => ({
          id: `audit-${i + 1}`,
          adminId: `admin-${(i % 3) + 1}`,
          adminName: `Admin ${(i % 3) + 1}`,
          action: ['update_vip', 'add_tag', 'remove_tag', 'disable_account', 'enable_account'][
            i % 5
          ],
          objectType: 'user',
          objectId: user.id,
          before: {},
          after: {},
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        })),
      }

      console.log('[Mock Users] Returning detailed user response')

      return {
        data: {
          success: true,
          data: detailResponse,
          message: 'User retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Create/Update/Delete - just return success
    if (url.includes('/users') && ['post', 'put', 'patch', 'delete'].includes(method)) {
      return {
        data: {
          success: true,
          data: data || {},
          message: `User ${method}ed successfully`,
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockUserService = new MockUserService()
