/**
 * Market Module Contracts
 *
 * Type contracts for market data entities
 */

export interface KlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteVolume: string
  trades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
}

export interface MarketTrade {
  id: string
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}

export interface MarketDepth {
  bids: [string, string][] // [price, quantity][]
  asks: [string, string][] // [price, quantity][]
  timestamp: number
}

export interface MarketSummary {
  symbol: string
  displayName: Record<string, string>
  base: string
  quote: string
  lastPrice: string
  priceChange: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  volumePrecision: number
  pricePrecision: number
  status: 'trading' | 'halted' | 'delisted'
}

export interface KlineQueryParams {
  symbol: string
  interval: string
  startTime?: number
  endTime?: number
  limit?: number
}

export interface MarketTradeQueryParams {
  symbol: string
  limit?: number
}

export interface MarketDepthQueryParams {
  symbol: string
  limit?: number
}
