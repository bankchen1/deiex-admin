// Complete Mock Config Service
import type { MockResponse } from '../index'

class MockConfigCompleteService {
  // Instruments
  private mockInstruments = Array.from({ length: 50 }, (_, i) => ({
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'][i % 5],
    displayName: {
      en: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT'][i % 5],
      zh: ['比特币/USDT', '以太坊/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT'][i % 5],
    },
    base: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'][i % 5],
    quote: 'USDT',
    type: (i % 2 === 0 ? 'spot' : 'futures') as 'spot' | 'futures',
    pricePrecision: 2,
    qtyStep: '0.001',
    minOrder: '10',
    maxOrder: i % 2 === 0 ? '100000' : undefined,
    maxPosition: i % 2 === 1 ? '1000000' : undefined,
    priceTickSize: '0.01',
    visible: i % 5 !== 0,
    rank: i + 1,
    region: ['US', 'EU', 'ASIA'],
    tags: i % 3 === 0 ? ['popular'] : i % 5 === 0 ? ['new'] : [],
    feeTemplateId: `fee-${(i % 5) + 1}`,
    marginTemplateId: i % 2 === 1 ? `margin-${(i % 3) + 1}` : undefined,
    iconId: `icon-${(i % 5) + 1}`,
    status: (i % 5 === 0 ? 'draft' : 'published') as 'draft' | 'published',
    version: `v${Math.floor(i / 5) + 1}`,
    oracleSource: i % 2 === 1 ? 'chainlink' : undefined,
    indexSymbol: i % 2 === 1 ? `.${['BTC', 'ETH', 'BNB', 'SOL', 'ADA'][i % 5]}USDT` : undefined,
    maxLeverage: i % 2 === 1 ? [5, 10, 20, 50, 100][i % 5] : undefined,
    maintenanceMarginRate: i % 2 === 1 ? 0.005 + Math.random() * 0.01 : undefined,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Margin Templates
  private mockMarginTemplates = Array.from({ length: 20 }, (_, i) => ({
    id: `margin-${i + 1}`,
    name: `Margin Template ${i + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT'][i % 2],
    leverage: [5, 10, 20, 50][i % 4],
    maintenanceMargin: 0.5 + Math.random() * 2,
    initialMargin: 1 + Math.random() * 5,
    status: i % 3 === 0 ? 'draft' : 'published',
    version: `v${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Fees
  private mockFees = Array.from({ length: 30 }, (_, i) => ({
    id: `fee-${i + 1}`,
    type: ['trading', 'withdrawal', 'deposit'][i % 3],
    asset: ['BTC', 'ETH', 'USDT'][i % 3],
    makerFee: 0.001 + Math.random() * 0.002,
    takerFee: 0.002 + Math.random() * 0.003,
    withdrawalFee: Math.random() * 0.001,
    status: i % 4 === 0 ? 'draft' : 'published',
    version: `v${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Calendar/Funding
  private mockFunding = Array.from({ length: 15 }, (_, i) => ({
    id: `funding-${i + 1}`,
    symbol: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'][i % 3],
    period: 8,
    nextFundingTime: new Date(Date.now() + (i + 1) * 8 * 60 * 60 * 1000).toISOString(),
    calculationRule: 'standard',
    enabled: i % 4 !== 0,
    status: i % 3 === 0 ? 'draft' : 'published',
    version: `v${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Maintenance Windows
  private mockMaintenance = Array.from({ length: 10 }, (_, i) => ({
    id: `maintenance-${i + 1}`,
    title: `System Maintenance ${i + 1}`,
    description: `Scheduled maintenance for system upgrade`,
    startTime: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(),
    affectedScope: ['trading', 'withdrawal'],
    announcementPush: true,
    status: i % 3 === 0 ? 'draft' : 'published',
    version: `v${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Icons
  private mockIcons = Array.from({ length: 40 }, (_, i) => ({
    id: `icon-${i + 1}`,
    asset: ['BTC', 'ETH', 'BNB', 'SOL', 'ADA'][i % 5],
    url: `https://example.com/icons/${['BTC', 'ETH', 'BNB', 'SOL', 'ADA'][i % 5]}.png`,
    type: 'crypto',
    status: 'active',
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Mappings
  private mockMappings = Array.from({ length: 25 }, (_, i) => ({
    id: `mapping-${i + 1}`,
    navSymbol: `NAV_${['BTC', 'ETH', 'BNB'][i % 3]}`,
    apiSymbol: `${['BTC', 'ETH', 'BNB'][i % 3]}USDT`,
    type: 'symbol',
    enabled: i % 5 !== 0,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  // Security Settings
  private mockSecuritySettings = {
    twoFactorRequired: true,
    ipWhitelistEnabled: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  }

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Instruments
    if (url.includes('/config/instruments') || url.includes('/instruments')) {
      if (method === 'get' && !url.match(/\/instruments\/[^/]+$/)) {
        return this.createPaginatedResponse(this.mockInstruments, url)
      }
      if (url.match(/\/instruments\/[^/]+$/) && method === 'get') {
        return this.createDetailResponse(this.mockInstruments[0])
      }
    }

    // Margin
    if (url.includes('/config/margin') || url.includes('/margin')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockMarginTemplates, url)
      }
    }

    // Fees
    if (url.includes('/config/fees') || url.includes('/fees')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockFees, url)
      }
    }

    // Calendar/Funding
    if (url.includes('/config/calendar') || url.includes('/funding')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockFunding, url)
      }
    }

    // Maintenance
    if (url.includes('/maintenance')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockMaintenance, url)
      }
    }

    // Icons
    if (url.includes('/config/icons') || url.includes('/icons')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockIcons, url)
      }
    }

    // Mappings
    if (url.includes('/config/mappings') || url.includes('/mappings')) {
      if (method === 'get') {
        return this.createPaginatedResponse(this.mockMappings, url)
      }
    }

    // Security
    if (url.includes('/config/security') || url.includes('/security')) {
      if (method === 'get') {
        return this.createDetailResponse(this.mockSecuritySettings)
      }
    }

    // Generic config endpoints
    if (url.includes('/config/') && method === 'get') {
      return this.createPaginatedResponse([], url)
    }

    // Create/Update/Delete
    if (url.includes('/config/') && ['post', 'put', 'patch', 'delete'].includes(method)) {
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
        message: 'Data retrieved',
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
    }
  }
}

export const mockConfigCompleteService = new MockConfigCompleteService()
