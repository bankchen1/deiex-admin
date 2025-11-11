export interface Order {
  id: string
  symbol: string
  userId: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop' | 'oco'
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  price: number
  quantity: number
  filledQuantity: number
  remainingQuantity: number
  fee: number
  feeAsset: string
  createdAt: string
  updatedAt: string
  clientOrderId?: string
  stopPrice?: number
  icebergQty?: number
}

export interface FuturesOrder {
  id: string
  symbol: string
  userId: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop' | 'take_profit' | 'trailing_stop'
  positionSide: 'long' | 'short' | 'both'
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected' | 'expired'
  price: number
  quantity: number
  filledQuantity: number
  remainingQuantity: number
  avgFillPrice: number
  leverage: number
  marginType: 'cross' | 'isolated'
  reduceOnly: boolean
  closePosition: boolean
  createdAt: string
  updatedAt: string
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'GTX'
  activatePrice?: number
  priceRate?: number
  workingType: 'MARK_PRICE' | 'CONTRACT_PRICE'
  priceProtect: boolean
}

export interface Position {
  id: string
  symbol: string
  userId: string
  positionSide: 'long' | 'short' | 'both'
  positionType: 'isolated' | 'cross'
  quantity: number
  entryPrice: number
  markPrice: number
  unrealizedPnL: number
  realizedPnL: number
  margin: number
  leverage: number
  liquidationPrice: number
  marginType: 'cross' | 'isolated'
  updateTime: string
  autoMargin: boolean
}

export interface Liquidation {
  id: string
  symbol: string
  userId: string
  positionSide: 'long' | 'short'
  quantity: number
  price: number
  orderType: string
  time: string
  eventReason: string
  eventType: 'LIQUIDATION' | 'ADL'
}

export interface OrderQueryParams {
  symbol?: string
  side?: 'buy' | 'sell'
  status?: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  userId?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface PositionQueryParams {
  symbol?: string
  side?: 'long' | 'short'
  userId?: string
  page?: number
  pageSize?: number
}

export interface LiquidationQueryParams {
  symbol?: string
  side?: 'long' | 'short'
  userId?: string
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

// Copy Trading Contracts
export interface CopyTradingRelation {
  id: string
  followerId: string
  followerNickname: string
  traderId: string
  traderNickname: string
  copyRatio: number
  maxPositionSize: string
  stopLossRatio: number
  profitShareRatio: number
  status: 'active' | 'paused' | 'stopped'
  totalProfit: string
  createdAt: string
}

export interface CopyTradingQueryParams {
  page?: number
  pageSize?: number
  masterId?: string
  followerId?: string
  status?: 'active' | 'paused' | 'stopped'
  search?: string
}
