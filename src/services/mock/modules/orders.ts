// Mock Orders Service
import type { MockResponse } from '../index'

class MockOrdersService {
  private mockOrders = Array.from({ length: 100 }, (_, i) => ({
    id: `order-${i + 1}`,
    userId: `user-${(i % 50) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'][i % 5],
    side: i % 2 === 0 ? 'buy' : 'sell',
    type: ['limit', 'market', 'stop_limit'][i % 3],
    price: 50000 + Math.random() * 10000,
    quantity: Math.random() * 10,
    filled: Math.random() * 10,
    status: ['pending', 'filled', 'cancelled', 'partial'][i % 4],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  private mockPositions = Array.from({ length: 30 }, (_, i) => ({
    id: `position-${i + 1}`,
    userId: `user-${(i % 20) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i % 3],
    side: i % 2 === 0 ? 'long' : 'short',
    leverage: [5, 10, 20, 50][i % 4],
    entryPrice: 50000 + Math.random() * 10000,
    markPrice: 51000 + Math.random() * 10000,
    liquidationPrice: 45000 + Math.random() * 5000,
    quantity: Math.random() * 10,
    unrealizedPnl: (Math.random() - 0.5) * 1000,
    unrealizedPnlPercent: (Math.random() - 0.5) * 20,
    marginMode: i % 2 === 0 ? 'isolated' : 'cross',
    riskRatio: Math.random(),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Positions list
    if (url.includes('/positions') && method === 'get' && !url.match(/\/positions\/[^/]+$/)) {
      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: this.mockPositions.slice(start, end),
            total: this.mockPositions.length,
            page,
            pageSize,
          },
          message: 'Positions retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Orders list
    if (url.includes('/orders') && method === 'get' && !url.match(/\/orders\/[^/]+$/)) {
      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: this.mockOrders.slice(start, end),
            total: this.mockOrders.length,
            page,
            pageSize,
          },
          message: 'Orders retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Order detail
    if (url.match(/\/orders\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const order = this.mockOrders.find((o) => o.id === id) || this.mockOrders[0]

      return {
        data: {
          success: true,
          data: order,
          message: 'Order retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Position detail
    if (url.match(/\/positions\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const position = this.mockPositions.find((p) => p.id === id) || this.mockPositions[0]

      return {
        data: {
          success: true,
          data: position,
          message: 'Position retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Create/Update/Delete
    if (
      (url.includes('/orders') || url.includes('/positions')) &&
      ['post', 'put', 'patch', 'delete'].includes(method)
    ) {
      return {
        data: {
          success: true,
          data: data || {},
          message: 'Operation successful',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockOrdersService = new MockOrdersService()
