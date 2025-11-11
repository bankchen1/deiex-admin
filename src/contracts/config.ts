export interface Instrument {
  symbol: string
  baseAsset: string
  quoteAsset: string
  type: 'spot' | 'futures' | 'options'
  status: 'draft' | 'published' | 'suspended' | 'delisted'
  visible: boolean
  tickSize: number
  minTradeAmount: number
  maxTradeAmount: number
  minTradeVolume: number
  maxTradeVolume: number
  makerFeeRate: number
  takerFeeRate: number
  makerDiscountRate: number
  takerDiscountRate: number
  priceLimitType: 'none' | 'percentage' | 'fixed'
  priceLimitValue: number
  priceLimitWindow: number // seconds
  quantityLimitType: 'none' | 'percentage' | 'fixed'
  quantityLimitValue: number
  quantityLimitWindow: number // seconds
  marginEnabled: boolean
  maxLeverage: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  delistedAt?: string
  description?: string
  tags?: string[]
}

export interface MarginTemplate {
  id: string
  name: string
  description?: string
  leverage: number
  maintenanceMarginRate: number
  initialMarginRate: number
  liquidationFeeRate: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'draft'
  applicableSymbols: string[]
}

export interface TradingFeeTemplate {
  id: string
  name: string
  description?: string
  feeType: 'maker' | 'taker' | 'both'
  feeStructure: 'flat' | 'tiered' | 'volume_based'
  feeRate: number
  minFeeRate: number
  maxFeeRate: number
  volumeTiers?: Array<{
    volume: number
    feeRate: number
  }>
  applicableSymbols: string[]
  applicableUserGroups?: string[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'draft'
}

export interface InstrumentQueryParams {
  type?: 'spot' | 'futures'
  status?: 'draft' | 'published'
  visible?: boolean
  search?: string
  page?: number
  pageSize?: number
}

export interface MarginTemplateQueryParams {
  status?: 'active' | 'inactive' | 'draft'
  search?: string
  page?: number
  pageSize?: number
}

export interface TradingFeeQueryParams {
  feeType?: 'maker' | 'taker' | 'both'
  status?: 'active' | 'inactive' | 'draft'
  search?: string
  page?: number
  pageSize?: number
}

// Margin Binding Entity Contracts
export interface MarginBinding {
  symbol: string
  templateId: string
  templateName: string
  status: 'draft' | 'published'
  version: string
  updatedAt: string
}

export interface MarginBindingQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published'
  templateId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface CreateMarginBindingPayload {
  symbol: string
  templateId: string
}

export interface UpdateMarginBindingPayload {
  templateId?: string
}
