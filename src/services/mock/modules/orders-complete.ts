// Complete Mock Orders Service
import type { MockResponse } from '../index'

class MockOrdersCompleteService {
  // Spot Orders
  private mockSpotOrders = Array.from({ length: 100 }, (_, i) => ({
    id: `spot-${i + 1}`,
    userId: `user-${(i % 50) + 1}`,
    userNickname: `user${(i % 50) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'][i % 5],
    type: 'spot' as const,
    side: (i % 2 === 0 ? 'buy' : 'sell') as 'buy' | 'sell',
    orderType: ['limit', 'market', 'stop-limit', 'stop-market'][i % 4] as
      | 'limit'
      | 'market'
      | 'stop-limit'
      | 'stop-market',
    price: (50000 + Math.random() * 10000).toFixed(2),
    quantity: (Math.random() * 10).toFixed(4),
    filled: (Math.random() * 10).toFixed(4),
    status: ['pending', 'filled', 'cancelled', 'partial', 'rejected'][i % 5] as
      | 'pending'
      | 'filled'
      | 'cancelled'
      | 'partial'
      | 'rejected',
    errorCode: i % 10 === 0 ? 'INSUFFICIENT_BALANCE' : undefined,
    matchingLatency: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Futures Orders
  private mockFuturesOrders = Array.from({ length: 80 }, (_, i) => ({
    id: `futures-${i + 1}`,
    userId: `user-${(i % 40) + 1}`,
    userNickname: `user${(i % 40) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i % 3],
    type: 'futures' as const,
    side: (i % 2 === 0 ? 'buy' : 'sell') as 'buy' | 'sell',
    orderType: ['limit', 'market', 'stop-limit', 'stop-market'][i % 4] as
      | 'limit'
      | 'market'
      | 'stop-limit'
      | 'stop-market',
    price: (50000 + Math.random() * 10000).toFixed(2),
    quantity: (Math.random() * 10).toFixed(4),
    filled: (Math.random() * 10).toFixed(4),
    status: ['pending', 'filled', 'cancelled', 'partial'][i % 4] as
      | 'pending'
      | 'filled'
      | 'cancelled'
      | 'partial',
    leverage: [5, 10, 20, 50][i % 4],
    marginMode: (i % 2 === 0 ? 'isolated' : 'cross') as 'isolated' | 'cross',
    positionSide: (i % 2 === 0 ? 'long' : 'short') as 'long' | 'short',
    liquidationPrice: (45000 + Math.random() * 5000).toFixed(2),
    fundingImpact: ((Math.random() - 0.5) * 100).toFixed(2),
    errorCode: i % 10 === 0 ? 'INSUFFICIENT_MARGIN' : undefined,
    matchingLatency: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Positions
  private mockPositions = Array.from({ length: 30 }, (_, i) => ({
    id: `position-${i + 1}`,
    userId: `user-${(i % 20) + 1}`,
    userNickname: `user${(i % 20) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i % 3],
    side: (i % 2 === 0 ? 'long' : 'short') as 'long' | 'short',
    leverage: [5, 10, 20, 50][i % 4],
    marginMode: (i % 2 === 0 ? 'isolated' : 'cross') as 'isolated' | 'cross',
    entryPrice: (50000 + Math.random() * 10000).toFixed(2),
    markPrice: (51000 + Math.random() * 10000).toFixed(2),
    liquidationPrice: (45000 + Math.random() * 5000).toFixed(2),
    quantity: (Math.random() * 10).toFixed(4),
    margin: (Math.random() * 5000).toFixed(2),
    unrealizedPnl: ((Math.random() - 0.5) * 1000).toFixed(2),
    riskRatio: parseFloat(Math.random().toFixed(4)),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Liquidations
  private mockLiquidations = Array.from({ length: 20 }, (_, i) => ({
    id: `liquidation-${i + 1}`,
    userId: `user-${(i % 15) + 1}`,
    userNickname: `user${(i % 15) + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT'][i % 2],
    side: (i % 2 === 0 ? 'long' : 'short') as 'long' | 'short',
    leverage: [5, 10, 20, 50][i % 4],
    entryPrice: (50000 + Math.random() * 10000).toFixed(2),
    liquidationPrice: (45000 + Math.random() * 5000).toFixed(2),
    quantity: (Math.random() * 10).toFixed(4),
    loss: (Math.random() * 5000).toFixed(2),
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    reason: ['Insufficient margin', 'Price hit liquidation level', 'Forced liquidation'][i % 3],
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Spot Orders List
    if (url.includes('/orders/spot') && method === 'get' && !url.match(/\/spot\/[^/]+$/)) {
      return this.createPaginatedResponse(this.mockSpotOrders, url)
    }

    // Spot Order Detail
    if (url.match(/\/orders\/spot\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const order = this.mockSpotOrders.find((o) => o.id === id) || this.mockSpotOrders[0]
      return this.createDetailResponse(order)
    }

    // Futures Orders List
    if (url.includes('/orders/futures') && method === 'get' && !url.match(/\/futures\/[^/]+$/)) {
      return this.createPaginatedResponse(this.mockFuturesOrders, url)
    }

    // Futures Order Detail
    if (url.match(/\/orders\/futures\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const order = this.mockFuturesOrders.find((o) => o.id === id) || this.mockFuturesOrders[0]
      return this.createDetailResponse(order)
    }

    // Positions List
    if (url.includes('/positions') && method === 'get' && !url.match(/\/positions\/[^/]+$/)) {
      return this.createPaginatedResponse(this.mockPositions, url)
    }

    // Position Detail
    if (url.match(/\/positions\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const position = this.mockPositions.find((p) => p.id === id) || this.mockPositions[0]
      return this.createDetailResponse(position)
    }

    // Liquidations List
    if (url.includes('/liquidations') && method === 'get') {
      return this.createPaginatedResponse(this.mockLiquidations, url)
    }

    // Copy Trading (empty for now)
    if (url.includes('/copy-trading') && method === 'get') {
      return this.createPaginatedResponse([], url)
    }

    // Create/Update/Delete operations
    if (
      (url.includes('/orders') || url.includes('/positions')) &&
      ['post', 'put', 'patch', 'delete'].includes(method)
    ) {
      return this.createDetailResponse(data || {})
    }

    return null
  }

  private createPaginatedResponse(data: any[], url: string): MockResponse {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '1')
    const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      data: {
        success: true,
        data: {
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
        message: 'Detail retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }
}

export const mockOrdersCompleteService = new MockOrdersCompleteService()
